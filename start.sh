#!/bin/bash

# Base path
base_pwd="/Users/burakgolec/Documents/Programing/docix"

# Start the frontend
cd "$base_pwd/frontend" || exit
npm run start &
frontend_pid=$!
echo "Frontend started with PID: $frontend_pid"

# Start the mockdata-api
cd "$base_pwd/microservices/mockdata-api" || exit
source venv/bin/activate
python3 app.py &
mockdata_api_pid=$!
echo "Mockdata API started with PID: $mockdata_api_pid"

# Start the ssh-services
cd "$base_pwd/microservices/ssh-services" || exit
go run main.go &
ssh_services_pid=$!
echo "SSH Services started with PID: $ssh_services_pid"

# Wait for all processes to finish
wait $frontend_pid
wait $mockdata_api_pid
wait $ssh_services_pid

echo "All services have stopped."