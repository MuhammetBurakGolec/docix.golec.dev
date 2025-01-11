FROM golang:1.23 AS builder

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o websocket-terminal

FROM debian:bullseye-slim

RUN apt-get update && apt-get install -y \
    bash \
    openssh-client \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /root/

COPY --from=builder /app/websocket-terminal .

EXPOSE 8084


ENTRYPOINT ["./websocket-terminal"]