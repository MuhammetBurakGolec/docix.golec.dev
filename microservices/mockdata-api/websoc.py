from flask import Flask
from flask_socketio import SocketIO
import os
import pty
import select
import threading

app = Flask(__name__)
socketio = SocketIO(app, cors_allowed_origins="*")

# Global PTY ve process bilgileri
process = None
master_fd = None

def read_and_emit():
    """Terminalden gelen verileri okur ve istemciye iletir."""
    while True:
        if master_fd:
            try:
                data = os.read(master_fd, 1024).decode()
                if data:
                    socketio.emit('output', data)
            except OSError:
                break

@socketio.on('input')
def handle_input(data):
    """İstemciden gelen girdiyi terminale gönderir."""
    global master_fd
    if master_fd:
        os.write(master_fd, data.encode())

@socketio.on('connect')
def connect():
    """İstemci bağlandığında terminali başlat."""
    global process, master_fd
    master_fd, slave_fd = pty.openpty()
    process = os.fork()
    if process == 0:
        # Çocuk işlem: Shell başlat
        os.execlp('bash', 'bash')
    else:
        # Ana işlem: Verileri okumak için thread başlat
        threading.Thread(target=read_and_emit, daemon=True).start()
        socketio.emit('output', "Bağlantı kuruldu. Terminal aktif.\r\n")

@socketio.on('disconnect')
def disconnect():
    """İstemci bağlantısı kesildiğinde terminali sonlandır."""
    global process
    if process:
        os.kill(process, 9)
        process = None
        print("Terminal bağlantısı sonlandırıldı.")

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=5003)