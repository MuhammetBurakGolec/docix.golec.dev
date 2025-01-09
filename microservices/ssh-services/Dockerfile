# Stage 1: Build
FROM golang:1.23 AS builder

# Set the working directory
WORKDIR /app

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application
RUN go build -o websocket-terminal

# Stage 2: Run
FROM debian:bullseye-slim

# Install bash and other dependencies
RUN apt-get update && apt-get install -y \
    bash \
    openssh-client \
    && rm -rf /var/lib/apt/lists/*

# Set the working directory
WORKDIR /root/

# Copy the built application from the builder stage
COPY --from=builder /app/websocket-terminal .

# Expose the port the application runs on
EXPOSE 8084

# Set the entrypoint
ENTRYPOINT ["./websocket-terminal"]