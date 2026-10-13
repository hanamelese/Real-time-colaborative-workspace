// 'use client';

// import { useEffect, useRef, useState, useCallback } from 'react';

// type WebSocketStatus = 'Connecting' | 'Connected' | 'Disconnected' | 'Error';

// interface UseWebSocketOptions {
//     roomId: string;
//     onMessage?: (data: any) => void;
// }

// export function useWebSocket({ roomId, onMessage }: UseWebSocketOptions) {
//     const [status, setStatus] = useState<WebSocketStatus>('Connecting');
//     const socketRef = useRef<WebSocket | null>(null);
//     const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
//     const isMountedRef = useRef<boolean>(true);

//     // Keep a stable ref to onMessage so it never forces socket re-connections on re-renders
//     const onMessageRef = useRef(onMessage);
//     useEffect(() => {
//         onMessageRef.current = onMessage;
//     }, [onMessage]);

//     const connect = useCallback(() => {
//         if (!isMountedRef.current) return;

//         setStatus('Connecting');
//         const ws = new WebSocket(`ws://127.0.0.1:8080/ws/${roomId}`);
//         socketRef.current = ws;

//         ws.onopen = () => {
//             if (!isMountedRef.current) return;
//             setStatus('Connected');
//             console.log(`Connected to room: ${roomId}`);
//         };

//         ws.onmessage = (event) => {
//             if (!isMountedRef.current) return;
//             try {
//                 const parsedData = JSON.parse(event.data);
//                 if (onMessageRef.current) onMessageRef.current(parsedData);
//             } catch (err) {
//                 console.log('Received raw message:', event.data);
//             }
//         };

//         ws.onerror = () => {
//             if (!isMountedRef.current) return;
//             setStatus('Error');
//         };

//         ws.onclose = () => {
//             if (!isMountedRef.current) return;
//             setStatus('Disconnected');

//             if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
//             reconnectTimeoutRef.current = setTimeout(() => {
//                 connect();
//             }, 2000); // Back off to 2 seconds for quicker recovery if needed
//         };
//     }, [roomId]); // Removed onMessage dependency to prevent unwanted connection re-drops

//     useEffect(() => {
//         isMountedRef.current = true;
//         connect();

//         return () => {
//             isMountedRef.current = false;
//             if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
//             if (socketRef.current) {
//                 socketRef.current.close();
//             }
//         };
//     }, [connect]);

//     const sendMessage = useCallback((message: object) => {
//         if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
//             socketRef.current.send(JSON.stringify(message));
//         } else {
//             console.warn('WebSocket is not connected. Message not sent.');
//         }
//     }, []);

//     return { status, sendMessage };
// }



'use client';

import { useEffect, useRef, useState, useCallback } from 'react';

type WebSocketStatus = 'Connecting' | 'Connected' | 'Disconnected' | 'Error';

interface UseWebSocketOptions {
    roomId: string;
    onMessage?: (data: any) => void;
}

export function useWebSocket({ roomId, onMessage }: UseWebSocketOptions) {
    const [status, setStatus] = useState<WebSocketStatus>('Connecting');
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isMountedRef = useRef<boolean>(true);

    // Keep a stable ref to onMessage so it never forces socket re-connections on re-renders
    const onMessageRef = useRef(onMessage);
    useEffect(() => {
        onMessageRef.current = onMessage;
    }, [onMessage]);

    const connect = useCallback(() => {
        if (!isMountedRef.current) return;

        setStatus('Connecting');
        const wsUrl = `wss://real-time-collaborative-workspace-production.up.railway.app/ws/${roomId}`;
        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
            if (!isMountedRef.current) return;
            setStatus('Connected');
            console.log(`Connected to room: ${roomId}`);
        };

        ws.onmessage = (event) => {
            if (!isMountedRef.current) return;
            try {
                const parsedData = JSON.parse(event.data);
                if (onMessageRef.current) onMessageRef.current(parsedData);
            } catch (err) {
                console.log('Received raw message:', event.data);
            }
        };

        ws.onerror = () => {
            if (!isMountedRef.current) return;
            setStatus('Error');
        };

        ws.onclose = () => {
            if (!isMountedRef.current) return;
            setStatus('Disconnected');

            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
            reconnectTimeoutRef.current = setTimeout(() => {
                connect();
            }, 2000); // Back off to 2 seconds for quicker recovery if needed
        };
    }, [roomId]);

    useEffect(() => {
        isMountedRef.current = true;
        connect();

        return () => {
            isMountedRef.current = false;
            if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [connect]);

    const sendMessage = useCallback((message: object) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
        } else {
            console.warn('WebSocket is not connected. Message not sent.');
        }
    }, []);

    return { status, sendMessage };
}