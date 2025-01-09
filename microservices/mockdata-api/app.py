from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import json

app = Flask(__name__)
CORS(app)

DOCKER_API_URL = "http://86.48.6.99:2375/v1.38/containers/json"

MOCK_CONTAINERS = [
  {
    "Id": "alpine",
    "Names": ["/alpine"],
    "Image": "alpine:latest",
    "ImageID": "sha256:mock_alpine",
    "Command": "sh -c 'echo 'Alpine…",
    "Created": "1699000100",
    "Ports": [],
    "Labels": {
      "mock": "true",
      "service": "alpine"
    },
    "State": "exited",
    "Status": "Exited (0) 8 seconds ago",
    "HostConfig": {
      "NetworkMode": "bridge"
    },
    "NetworkSettings": {
      "Networks": {
        "bridge": {}
      }
    },
    "Mounts": []
  },
  {
    "Id": "busybox",
    "Names": ["/busybox"],
    "Image": "busybox:latest",
    "ImageID": "sha256:mock_busybox",
    "Command": "sh -c 'echo 'Busybo…",
    "Created": "1699000100",
    "Ports": [],
    "Labels": {
      "mock": "true",
      "service": "busybox"
    },
    "State": "running",
    "Status": "Up 53 seconds",
    "HostConfig": {
      "NetworkMode": "bridge"
    },
    "NetworkSettings": {
      "Networks": {
        "bridge": {}
      }
    },
    "Mounts": []
  },
  {
    "Id": "debian",
    "Names": ["/debian"],
    "Image": "debian:latest",
    "ImageID": "sha256:mock_debian",
    "Command": "sh -c 'echo 'Debian…",
    "Created": "1699000100",
    "Ports": [],
    "Labels": {
      "mock": "true",
      "service": "debian"
    },
    "State": "running",
    "Status": "Up 47 seconds",
    "HostConfig": {
      "NetworkMode": "bridge"
    },
    "NetworkSettings": {
      "Networks": {
        "bridge": {}
      }
    },
    "Mounts": []
  },
  {
    "Id": "golang",
    "Names": ["/golang"],
    "Image": "golang:latest",
    "ImageID": "sha256:mock_golang",
    "Command": "go version",
    "Created": "1699000100",
    "Ports": [],
    "Labels": {
      "mock": "true",
      "service": "golang"
    },
    "State": "exited",
    "Status": "Exited (0) 11 seconds ago",
    "HostConfig": {
      "NetworkMode": "bridge"
    },
    "NetworkSettings": {
      "Networks": {
        "bridge": {}
      }
    },
    "Mounts": []
  },
  {
    "Id": "memcached",
    "Names": ["/memcached"],
    "Image": "memcached:latest",
    "ImageID": "sha256:mock_memcached",
    "Command": "docker-entrypoint.s…",
    "Created": "1699000100",
    "Ports": [
      {
        "PrivatePort": 11211,
        "PublicPort": 11211,
        "Type": "tcp"
      }
    ],
    "Labels": {
      "mock": "true",
      "service": "memcached"
    },
    "State": "running",
    "Status": "Up 54 seconds",
    "HostConfig": {
      "NetworkMode": "bridge"
    },
    "NetworkSettings": {
      "Networks": {
        "bridge": {}
      }
    },
    "Mounts": []
  },
  {
    "Id": "mongo",
    "Names": ["/mongo"],
    "Image": "mongo:latest",
    "ImageID": "sha256:mock_mongo",
    "Command": "docker-entrypoint.s…",
    "Created": "1699000100",
    "Ports": [
      {
        "PrivatePort": 27017,
        "PublicPort": 27017,
        "Type": "tcp"
      }
    ],
    "Labels": {
      "mock": "true",
      "service": "mongo"
    },
    "State": "running",
    "Status": "Up 40 seconds",
    "HostConfig": {
      "NetworkMode": "bridge"
    },
    "NetworkSettings": {
      "Networks": {
        "bridge": {}
      }
    },
    "Mounts": []
  },
  {
    "Id": "mysql",
    "Names": ["/mysql"],
    "Image": "mysql:latest",
    "ImageID": "sha256:mock_mysql",
    "Command": "docker-entrypoint.s…",
    "Created": "20 seconds ago",
    "Ports": [
      {
        "PrivatePort": 33060,
        "Type": "tcp"
      },
      {
        "PrivatePort": 3306,
        "PublicPort": 3307,
        "Type": "tcp"
      }
    ],
    "Labels": {
      "mock": "true",
      "service": "mysql"
    },
    "State": "running",
    "Status": "Up 17 seconds",
    "HostConfig": {
      "NetworkMode": "bridge"
    },
    "NetworkSettings": {
      "Networks": {
        "bridge": {}
      }
    },
    "Mounts": []
  },
  {
    "Id": "nginx",
    "Names": ["/nginx"],
    "Image": "nginx:latest",
    "ImageID": "sha256:mock_nginx",
    "Command": "/docker-entrypoint.…",
    "Created": "1699000100",
    "Ports": [
      {
        "PrivatePort": 80,
        "PublicPort": 8080,
        "Type": "tcp"
      }
    ],
    "Labels": {
      "mock": "true",
      "service": "nginx"
    },
    "State": "running",
    "Status": "Up 54 seconds",
    "HostConfig": {
      "NetworkMode": "bridge"
    },
    "NetworkSettings": {
      "Networks": {
        "bridge": {}
      }
    },
    "Mounts": []
  },
  {
    "Id": "node",
    "Names": ["/node"],
    "Image": "node:latest",
    "ImageID": "sha256:mock_node",
    "Command": "docker-entrypoint.s…",
    "Created": "1699000100",
    "Ports": [],
    "Labels": {
      "mock": "true",
      "service": "node"
    },
    "State": "exited",
    "Status": "Exited (0) 12 seconds ago",
    "HostConfig": {
      "NetworkMode": "bridge"
    },
    "NetworkSettings": {
      "Networks": {
        "bridge": {}
      }
    },
    "Mounts": []
  },
  {
    "Id": "openjdk",
    "Names": ["/openjdk"],
    "Image": "openjdk:latest",
    "ImageID": "sha256:mock_openjdk",
    "Command": "java -version",
    "Created": "1699000100",
    "Ports": [],
    "Labels": {
      "mock": "true",
      "service": "openjdk"
    },
    "State": "exited",
    "Status": "Exited (0) 12 seconds ago",
    "HostConfig": {
      "NetworkMode": "bridge"
    },
    "NetworkSettings": {
      "Networks": {
        "bridge": {}
      }
    },
    "Mounts": []
  },
  {
    "Id": "perl",
    "Names": ["/perl"],
    "Image": "perl:latest",
    "ImageID": "sha256:mock_perl",
    "Command": "perl -e 'print 'Per…",
    "Created": "1699000100",
    "Ports": [],
    "Labels": {
      "mock": "true",
      "service": "perl"
    },
    "State": "exited",
    "Status": "Exited (0) 9 seconds ago",
    "HostConfig": {
      "NetworkMode": "bridge"
    },
    "NetworkSettings": {
      "Networks": {
        "bridge": {}
      }
    },
    "Mounts": []
  },
  {
    "Id": "php",
    "Names": ["/php"],
    "Image": "php:latest",
    "ImageID": "sha256:mock_php",
    "Command": "docker-php-entrypoi…",
    "Created": "1699000100",
    "Ports": [],
    "Labels": {
      "mock": "true",
      "service": "php"
    },
    "State": "exited",
    "Status": "Exited (0) 7 seconds ago",
    "HostConfig": {
      "NetworkMode": "bridge"
    },
    "NetworkSettings": {
      "Networks": {
        "bridge": {}
      }
    },
    "Mounts": []
  },
  {
    "Id": "postgres",
    "Names": ["/postgres"],
    "Image": "postgres:latest",
    "ImageID": "sha256:mock_postgres",
    "Command": "docker-entrypoint.s…",
    "Created": "1699000100",
    "Ports": [
      {
        "PrivatePort": 5432,
        "PublicPort": 5432,
        "Type": "tcp"
      }
    ],
    "Labels": {
      "mock": "true",
      "service": "postgres"
    },
    "State": "running",
    "Status": "Up 49 seconds",
    "HostConfig": {
      "NetworkMode": "bridge"
    },
    "NetworkSettings": {
      "Networks": {
        "bridge": {}
      }
    },
    "Mounts": []
  },
  {
    "Id": "python",
    "Names": ["/python"],
    "Image": "python:latest",
    "ImageID": "sha256:mock_python",
    "Command": "python3 -c 'print('…",
    "Created": "1699000100",
    "Ports": [],
    "Labels": {
      "mock": "true",
      "service": "python"
    },
    "State": "exited",
    "Status": "Exited (0) 6 seconds ago",
    "HostConfig": {
      "NetworkMode": "bridge"
    },
    "NetworkSettings": {
      "Networks": {
        "bridge": {}
      }
    },
    "Mounts": []
  },
  {
    "Id": "rabbitmq",
    "Names": ["/rabbitmq"],
    "Image": "rabbitmq:latest",
    "ImageID": "sha256:mock_rabbitmq",
    "Command": "docker-entrypoint.s…",
    "Created": "1699000100",
    "Ports": [
      {
        "PrivatePort": 4369,
        "Type": "tcp"
      },
      {
        "PrivatePort": 5671,
        "Type": "tcp"
      },
      {
        "PrivatePort": 15691,
        "Type": "tcp"
      },
      {
        "PrivatePort": 15692,
        "Type": "tcp"
      },
      {
        "PrivatePort": 25672,
        "Type": "tcp"
      },
      {
        "PrivatePort": 5672,
        "PublicPort": 5672,
        "Type": "tcp"
      }
    ],
    "Labels": {
      "mock": "true",
      "service": "rabbitmq"
    },
    "State": "running",
    "Status": "Up 53 seconds",
    "HostConfig": {
      "NetworkMode": "bridge"
    },
    "NetworkSettings": {
      "Networks": {
        "bridge": {}
      }
    },
    "Mounts": []
  },
  {
    "Id": "redis",
    "Names": ["/redis"],
    "Image": "redis:latest",
    "ImageID": "sha256:mock_redis",
    "Command": "docker-entrypoint.s…",
    "Created": "1699000100",
    "Ports": [
      {
        "PrivatePort": 6379,
        "Type": "tcp"
      }
    ],
    "Labels": {
      "mock": "true",
      "service": "redis"
    },
    "State": "running",
    "Status": "Up 50 seconds",
    "HostConfig": {
      "NetworkMode": "bridge"
    },
    "NetworkSettings": {
      "Networks": {
        "bridge": {}
      }
    },
    "Mounts": []
  },
  {
    "Id": "ruby",
    "Names": ["/ruby"],
    "Image": "ruby:latest",
    "ImageID": "sha256:mock_ruby",
    "Command": "ruby -e 'puts 'Ruby…",
    "Created": "1699000100",
    "Ports": [],
    "Labels": {
      "mock": "true",
      "service": "ruby"
    },
    "State": "exited",
    "Status": "Exited (0) 6 seconds ago",
    "HostConfig": {
      "NetworkMode": "bridge"
    },
    "NetworkSettings": {
      "Networks": {
        "bridge": {}
      }
    },
    "Mounts": []
  },
  {
    "Id": "rust",
    "Names": ["/rust"],
    "Image": "rust:latest",
    "ImageID": "sha256:mock_rust",
    "Command": "rustc --version",
    "Created": "1699000100",
    "Ports": [],
    "Labels": {
      "mock": "true",
      "service": "rust"
    },
    "State": "exited",
    "Status": "Exited (0) 12 seconds ago",
    "HostConfig": {
      "NetworkMode": "bridge"
    },
    "NetworkSettings": {
      "Networks": {
        "bridge": {}
      }
    },
    "Mounts": []
  }
]

# Normalize edilmiş olan veri tipi örneği
#     {
#         "Id": "1",
#         "Names": ["/nginx_web"],
#         "Image": "nginx:latest",
#         "ImageID": "sha256:mock123",
#         "Command": "nginx -g 'daemon off;'",
#         "Created": 1699000000,
#         "Ports": [{"PrivatePort": 80, "PublicPort": 8080, "Type": "tcp"}],
#         "Labels": {"mock": "true"},
#         "State": "running",
#         "Status": "Up 2 hours",
#         "HostConfig": {"NetworkMode": "bridge"},
#         "NetworkSettings": {"Networks": {"bridge": {}}},
#         "Mounts": []
#     }

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
    elif id == "all":
        for c in MOCK_CONTAINERS:
            c["State"] = "running"
            c["Status"] = "Up"
        return jsonify({"message": "ALL Containers started"})
    else:
        return jsonify({"error": "Container not found"}), 404
    

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
    # bu kısıma delete işlemi için gerekli docker sock işlemrleri yapılacak
    return jsonify({"message": "Container deleted"})

@app.route('/documentation', methods=['GET'])
def documentation():
    try:
        with open('db.json', 'r', encoding='utf-8') as file:
            data = json.load(file)
        return jsonify(data), 200

    except FileNotFoundError:
        return jsonify({"error": "db.json dosyası bulunamadı"}), 404

    except json.JSONDecodeError:
        return jsonify({"error": "db.json dosyası geçerli bir JSON formatında değil"}), 500

if __name__ == '__main__':
    app.run(port=5002)