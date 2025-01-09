from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)  # CORS'u etkinleştir

DOCKER_API_URL = "http://86.48.6.99:2375/v1.38/containers/json"

# Mock veri tanımla
MOCK_CONTAINERS = [
    {
        "Id": "mock_container_1",
        "Names": ["/nginx_web"],
        "Image": "nginx:latest",
        "ImageID": "sha256:mock123",
        "Command": "nginx -g 'daemon off;'",
        "Created": 1699000000,
        "Ports": [{"PrivatePort": 80, "PublicPort": 8080, "Type": "tcp"}],
        "Labels": {"mock": "true"},
        "State": "running",
        "Status": "Up 2 hours",
        "HostConfig": {"NetworkMode": "bridge"},
        "NetworkSettings": {"Networks": {"bridge": {}}},
        "Mounts": []
    },
    {
        "Id": "mock_container_2",
        "Names": ["/mysql_db"],
        "Image": "mysql:8.0",
        "ImageID": "sha256:mock456",
        "Command": "mysqld",
        "Created": 1699000100,
        "Ports": [{"PrivatePort": 3306, "PublicPort": 3306, "Type": "tcp"}],
        "Labels": {"mock": "true"},
        "State": "exited",
        "Status": "Exited (0) 30 minutes ago",
        "HostConfig": {"NetworkMode": "bridge"},
        "NetworkSettings": {"Networks": {"bridge": {}}},
        "Mounts": []
    },
    {
        "Id": "mock_container_3",
        "Names": ["/redis_cache"],
        "Image": "redis:alpine",
        "ImageID": "sha256:mock789",
        "Command": "redis-server",
        "Created": 1699000200,
        "Ports": [{"PrivatePort": 6379, "PublicPort": 6379, "Type": "tcp"}],
        "Labels": {"mock": "true"},
        "State": "restarting",
        "Status": "Restarting (0) 5 seconds ago",
        "HostConfig": {"NetworkMode": "bridge"},
        "NetworkSettings": {"Networks": {"bridge": {}}},
        "Mounts": []
    },
    {
        "Id": "verbum-frontend-web-1",
        "Names": ["/mongodb"],
        "Image": "mongo:latest",
        "ImageID": "sha256:mock101",
        "Command": "mongod",
        "Created": 1699000300,
        "Ports": [{"PrivatePort": 27017, "PublicPort": 27017, "Type": "tcp"}],
        "Labels": {"mock": "true"},
        "State": "running",
        "Status": "Up 5 days",
        "HostConfig": {"NetworkMode": "bridge"},
        "NetworkSettings": {"Networks": {"bridge": {}}},
        "Mounts": []
    },
    {
        "Id": "mock_container_5",
        "Names": ["/postgres_db"],
        "Image": "postgres:13",
        "ImageID": "sha256:mock202",
        "Command": "postgres",
        "Created": 1699000400,
        "Ports": [{"PrivatePort": 5432, "PublicPort": 5432, "Type": "tcp"}],
        "Labels": {"mock": "true"},
        "State": "stopped",
        "Status": "Stopped 1 hour ago",
        "HostConfig": {"NetworkMode": "bridge"},
        "NetworkSettings": {"Networks": {"bridge": {}}},
        "Mounts": []
    },
    {
        "Id": "mock_container_6",
        "Names": ["/elasticsearch"],
        "Image": "elasticsearch:7.9.3",
        "ImageID": "sha256:mock303",
        "Command": "./elasticsearch",
        "Created": 1699000500,
        "Ports": [{"PrivatePort": 9200, "PublicPort": 9200, "Type": "tcp"}],
        "Labels": {"mock": "true"},
        "State": "exited",
        "Status": "Exited (1) 2 days ago",
        "HostConfig": {"NetworkMode": "bridge"},
        "NetworkSettings": {"Networks": {"bridge": {}}},
        "Mounts": []
    },
    {
        "Id": "mock_container_7",
        "Names": ["/rabbitmq"],
        "Image": "rabbitmq:3-management",
        "ImageID": "sha256:mock404",
        "Command": "rabbitmq-server",
        "Created": 1699000600,
        "Ports": [{"PrivatePort": 5672, "PublicPort": 5672, "Type": "tcp"}],
        "Labels": {"mock": "true"},
        "State": "running",
        "Status": "Up 12 hours",
        "HostConfig": {"NetworkMode": "bridge"},
        "NetworkSettings": {"Networks": {"bridge": {}}},
        "Mounts": []
    },
    {
        "Id": "mock_container_8",
        "Names": ["/wordpress"],
        "Image": "wordpress:latest",
        "ImageID": "sha256:mock505",
        "Command": "apache2-foreground",
        "Created": 1699000700,
        "Ports": [{"PrivatePort": 80, "PublicPort": 8081, "Type": "tcp"}],
        "Labels": {"mock": "true"},
        "State": "restarting",
        "Status": "Restarting (2) 10 seconds ago",
        "HostConfig": {"NetworkMode": "bridge"},
        "NetworkSettings": {"Networks": {"bridge": {}}},
        "Mounts": []
    },
    {
        "Id": "mock_container_9",
        "Names": ["/phpmyadmin"],
        "Image": "phpmyadmin:latest",
        "ImageID": "sha256:mock606",
        "Command": "apache2-foreground",
        "Created": 1699000800,
        "Ports": [{"PrivatePort": 80, "PublicPort": 8082, "Type": "tcp"}],
        "Labels": {"mock": "true"},
        "State": "stopped",
        "Status": "Stopped 3 hours ago",
        "HostConfig": {"NetworkMode": "bridge"},
        "NetworkSettings": {"Networks": {"bridge": {}}},
        "Mounts": []
    },
    {
        "Id": "mock_container_10",
        "Names": ["/grafana"],
        "Image": "grafana/grafana:latest",
        "ImageID": "sha256:mock707",
        "Command": "/run.sh",
        "Created": 1699000900,
        "Ports": [{"PrivatePort": 3000, "PublicPort": 3000, "Type": "tcp"}],
        "Labels": {"mock": "true"},
        "State": "running",
        "Status": "Up 30 minutes",
        "HostConfig": {"NetworkMode": "bridge"},
        "NetworkSettings": {"Networks": {"bridge": {}}},
        "Mounts": []
    }
]

@app.route('/api/containers', methods=['GET'])
def get_containers():
    return jsonify({"containers": MOCK_CONTAINERS})

@app.route('/api/containers/<id>/start', methods=['POST'])
def start_container(id):
    container = next((c for c in MOCK_CONTAINERS if c["Id"] == id), None)
    if container:
        container["State"] = "running"
        container["Status"] = "Up"
    return jsonify({"message": "Container started"})

@app.route('/api/containers/<id>/stop', methods=['POST'])
def stop_container(id):
    container = next((c for c in MOCK_CONTAINERS if c["Id"] == id), None)
    if container:
        container["State"] = "exited"
        container["Status"] = "Exited"
    return jsonify({"message": "Container stopped"})

@app.route('/api/containers/<id>', methods=['DELETE'])
def delete_container(id):
    global MOCK_CONTAINERS
    MOCK_CONTAINERS = [c for c in MOCK_CONTAINERS if c["Id"] != id]
    return jsonify({"message": "Container deleted"})

@app.route('/documentation', methods=['GET'])
def documentation():
    try:
        # db.json dosyasını oku
        with open('db.json', 'r', encoding='utf-8') as file:
            data = json.load(file)
        
        # JSON verisini döndür
        return jsonify(data), 200

    except FileNotFoundError:
        # db.json bulunamazsa hata döndür
        return jsonify({"error": "db.json dosyası bulunamadı"}), 404

    except json.JSONDecodeError:
        # JSON format hatası durumunda hata döndür
        return jsonify({"error": "db.json dosyası geçerli bir JSON formatında değil"}), 500

if __name__ == '__main__':
    app.run(port=5002)