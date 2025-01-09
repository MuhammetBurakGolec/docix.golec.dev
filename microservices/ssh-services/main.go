package main

import (
	"fmt"
	"log"
	"net/http"
	"os/exec"
	"time"

	"github.com/creack/pty"
	"github.com/gorilla/websocket"
)

// WebSocket upgrader
var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func handleWebSocket(w http.ResponseWriter, r *http.Request) {
	// Upgrade HTTP connection to WebSocket
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Upgrade Error:", err)
		return
	}
	defer ws.Close()

	// Get container ID from query parameter
	containerId := r.URL.Query().Get("containerId")
	if containerId == "" {
		log.Println("Container ID not provided")
		return
	}

	// Create command
	cmd := exec.Command("/bin/bash")

	// Create PTY
	ptmx, err := pty.Start(cmd)
	if err != nil {
		log.Println("PTY Start Error:", err)
		return
	}
	defer func() {
		ptmx.Close()
		cmd.Process.Kill()
	}()

	// Connect to server and enter container
	sshCommand := "ssh root@86.48.6.99\n"
	dockerExecCommand := fmt.Sprintf("docker exec -it %s sh\n", containerId)

	// Execute SSH command
	if _, err = ptmx.Write([]byte(sshCommand)); err != nil {
		log.Println("SSH Command Write Error:", err)
		return
	}

	// Wait for SSH connection
	time.Sleep(2 * time.Second)

	// Execute docker exec command
	if _, err = ptmx.Write([]byte(dockerExecCommand)); err != nil {
		log.Println("Docker Exec Command Write Error:", err)
		return
	}

	// Read from PTY and send to WebSocket
	go func() {
		buf := make([]byte, 1024)
		for {
			n, err := ptmx.Read(buf)
			if err != nil {
				log.Println("PTY Read Error:", err)
				return
			}
			if err := ws.WriteMessage(websocket.TextMessage, buf[:n]); err != nil {
				log.Println("WebSocket Write Error:", err)
				return
			}
		}
	}()

	// Read from WebSocket and write to PTY
	for {
		_, message, err := ws.ReadMessage()
		if err != nil {
			log.Println("WebSocket Read Error:", err)
			return
		}
		if _, err := ptmx.Write(message); err != nil {
			log.Println("PTY Write Error:", err)
			return
		}
	}
}

func main() {
	http.HandleFunc("/ws", handleWebSocket)

	server := &http.Server{
		Addr:         ":8084",
		ReadTimeout:  10 * time.Second,
		WriteTimeout: 10 * time.Second,
	}

	log.Println("WebSocket terminal server running at ws://localhost:8080/ws")
	if err := server.ListenAndServe(); err != nil {
		log.Fatal("Server Error:", err)
	}
}
