// use axum::{
//     extract::ws::{Message, WebSocket, WebSocketUpgrade},
//     extract::Path,
//     response::IntoResponse,
//     routing::get,
//     Router,
// };
// use dashmap::DashMap;
// use futures_util::{SinkExt, StreamExt};
// use serde::{Deserialize, Serialize};
// use std::net::SocketAddr;
// use std::sync::Arc;
// use tokio::sync::broadcast;
// use tower_http::cors::{Any, CorsLayer};

// // Message structure exchanged between client and server
// #[derive(Debug, Clone, Serialize, Deserialize)]
// #[serde(tag = "type", content = "payload")]
// pub enum RoomMessage {
//     CursorUpdate { user_id: String, x: f64, y: f64 },
//     NodeUpdate { node_id: String, content: String },
//     CrdtSync { delta: Vec<u8> },
// }

// // Global App State managing rooms and broadcast channels
// type RoomStore = Arc<DashMap<String, broadcast::Sender<String>>>;

// #[tokio::main]
// async fn main() {
//     tracing_subscriber::fmt::init();

//     let rooms: RoomStore = Arc::new(DashMap::new());

//     // Allow CORS for Next.js frontend running at localhost:3000
//     let cors = CorsLayer::new()
//         .allow_origin(Any)
//         .allow_methods(Any)
//         .allow_headers(Any);

//     let app = Router::new()
//         .route("/ws/:room_id", get(ws_handler))
//         .layer(cors)
//         .with_state(rooms);

//     // Bind explicitly to 127.0.0.1 to match browser WebSocket loopback requirements
//     let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
//     println!("🚀 Rust Real-Time Sync Server running at ws://{}", addr);

//     let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
//     axum::serve(listener, app).await.unwrap();
// }

// // WebSocket Route Handler
// async fn ws_handler(
//     ws: WebSocketUpgrade,
//     Path(room_id): Path<String>,
//     axum::extract::State(rooms): axum::extract::State<RoomStore>,
// ) -> impl IntoResponse {
//     ws.on_upgrade(move |socket| handle_socket(socket, room_id, rooms))
// }

// // Handle socket stream & broadcast pipeline
// async fn handle_socket(socket: WebSocket, room_id: String, rooms: RoomStore) {
//     println!("🔌 Handshake accepted for room: {}", room_id);
//     let (mut sender, mut receiver) = socket.split();

//     // Get or create broadcast channel for this workspace room
//     let tx = rooms
//         .entry(room_id.clone())
//         .or_insert_with(|| {
//             let (tx, _) = broadcast::channel(100);
//             tx
//         })
//         .value()
//         .clone();

//     let mut rx = tx.subscribe();

//     // Task 1: Forward messages received from broadcast channel to this client
//     let mut send_task = tokio::spawn(async move {
//         while let Ok(msg) = rx.recv().await {
//             if sender.send(Message::Text(msg)).await.is_err() {
//                 break;
//             }
//         }
//     });

//     // Task 2: Receive messages from client and broadcast to all room subscribers
//     let tx_clone = tx.clone();
//     let mut recv_task = tokio::spawn(async move {
//         while let Some(Ok(Message::Text(text))) = receiver.next().await {
//             let _ = tx_clone.send(text);
//         }
//     });

//     // Abort active tasks when client disconnects
//     tokio::select! {
//         _ = (&mut send_task) => recv_task.abort(),
//         _ = (&mut recv_task) => send_task.abort(),
//     };
// }



use axum::{
    extract::ws::{Message, WebSocket, WebSocketUpgrade},
    extract::Path,
    response::IntoResponse,
    routing::get,
    Router,
};
use dashmap::DashMap;
use futures_util::{SinkExt, StreamExt};
use serde::{Deserialize, Serialize};
use sqlx::{sqlite::SqlitePoolOptions, SqlitePool};
use std::net::SocketAddr;
use std::sync::Arc;
use tokio::sync::broadcast;
use tower_http::cors::{Any, CorsLayer};

// Message structure exchanged between client and server
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", content = "payload")]
pub enum RoomMessage {
    CursorUpdate { user_id: String, x: f64, y: f64 },
    NodeUpdate { node_id: String, content: String },
    CrdtSync { delta: Vec<u8> },
}

// Global App State managing rooms and database pool
type RoomStore = Arc<DashMap<String, broadcast::Sender<String>>>;

#[derive(Clone)]
pub struct AppState {
    pub rooms: RoomStore,
    pub db: SqlitePool,
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    // Initialize SQLite database pool (creates workspace.db automatically)
    let db = SqlitePoolOptions::new()
        .connect("sqlite:workspace.db?mode=rwc")
        .await
        .expect("Failed to connect to SQLite database");

    // Create the persistent node states table if it doesn't exist
    sqlx::query(
        r#"
        CREATE TABLE IF NOT EXISTS node_states (
            room_id TEXT NOT NULL,
            node_id TEXT NOT NULL,
            content TEXT NOT NULL,
            PRIMARY KEY (room_id, node_id)
        )
        "#,
    )
    .execute(&db)
    .await
    .expect("Failed to initialize database schema");

    let rooms: RoomStore = Arc::new(DashMap::new());
    let app_state = AppState { rooms, db };

    // Allow CORS for Next.js frontend running at localhost:3000
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/ws/:room_id", get(ws_handler))
        .route("/api/rooms/:room_id/nodes", get(get_room_nodes))
        .layer(cors)
        .with_state(app_state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 8080));
    println!("🚀 Rust Real-Time Sync Server with SQLite running at ws://{}", addr);

    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

// WebSocket Route Handler
async fn ws_handler(
    ws: WebSocketUpgrade,
    Path(room_id): Path<String>,
    axum::extract::State(state): axum::extract::State<AppState>,
) -> impl IntoResponse {
    ws.on_upgrade(move |socket| handle_socket(socket, room_id, state))
}

// API Handler to fetch saved node states for a room on page load
async fn get_room_nodes(
    Path(room_id): Path<String>,
    axum::extract::State(state): axum::extract::State<AppState>,
) -> impl IntoResponse {
    let rows = sqlx::query_as::<_, (String, String)>(
        "SELECT node_id, content FROM node_states WHERE room_id = ?"
    )
    .bind(room_id)
    .fetch_all(&state.db)
    .await;

    match rows {
        Ok(data) => axum::Json(data),
        Err(_) => axum::Json(vec![]),
    }
}
// Handle socket stream, broadcast pipeline, and database persistence
async fn handle_socket(socket: WebSocket, room_id: String, state: AppState) {
    println!("🔌 Handshake accepted for room: {}", room_id);
    let (mut sender, mut receiver) = socket.split();

    // Get or create broadcast channel for this workspace room
    let tx = state
        .rooms
        .entry(room_id.clone())
        .or_insert_with(|| {
            let (tx, _) = broadcast::channel(100);
            tx
        })
        .value()
        .clone();

    let mut rx = tx.subscribe();

    // Task 1: Forward messages received from broadcast channel to this client
    let mut send_task = tokio::spawn(async move {
        while let Ok(msg) = rx.recv().await {
            if sender.send(Message::Text(msg)).await.is_err() {
                break;
            }
        }
    });

    // Task 2: Receive messages from client, persist NodeUpdates, and broadcast
    let tx_clone = tx.clone();
    let db_pool = state.db.clone();
    let room_id_clone = room_id.clone();

    let mut recv_task = tokio::spawn(async move {
        while let Some(Ok(Message::Text(text))) = receiver.next().await {
            // Intercept NodeUpdates and persist them asynchronously to SQLite
            if let Ok(RoomMessage::NodeUpdate { node_id, content }) =
                serde_json::from_str::<RoomMessage>(&text)
            {
                let db = db_pool.clone();
                let r_id = room_id_clone.clone();
                tokio::spawn(async move {
                    let _ = sqlx::query(
                        r#"
                        INSERT INTO node_states (room_id, node_id, content)
                        VALUES (?, ?, ?)
                        ON CONFLICT(room_id, node_id) DO UPDATE SET content = excluded.content
                        "#,
                    )
                    .bind(r_id)
                    .bind(node_id)
                    .bind(content)
                    .execute(&db)
                    .await;
                });
            }

            let _ = tx_clone.send(text);
        }
    });

    // Abort active tasks when client disconnects
    tokio::select! {
        _ = (&mut send_task) => recv_task.abort(),
        _ = (&mut recv_task) => send_task.abort(),
    };
}