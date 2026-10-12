# Use the official Rust image for building
FROM rust:latest AS builder

WORKDIR /app
COPY . .

# Build the Rust application in release mode
RUN cargo build --release

# Use a lightweight Debian image for the final runtime
FROM debian:bookworm-slim
WORKDIR /app

# Copy the compiled binary from the builder stage
# (Replace 'workspace-backend' with the binary name from your Cargo.toml if different)
COPY --from=builder /app/target/release/workspace-backend /app/workspace-backend

# Expose your backend port (default Axum port)
EXPOSE 8080

# Run the binary
CMD ["./workspace-backend"]