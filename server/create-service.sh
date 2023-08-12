#!/bin/bash

# Check if the Go binary path is provided as an argument
if [ -z "$1" ]; then
    echo "Usage: $0 /path/to/your/binary"
    exit 1
fi

# Get the binary path and name
binary_path="$1"
binary_name=$(basename "$binary_path")

# Create the systemd service file
service_file="/etc/systemd/system/$binary_name.service"

cat <<EOF > "$service_file"
[Unit]
Description=Service for $binary_name
After=network.target

[Service]
Type=simple
ExecStart=$binary_path
WorkingDirectory=$(dirname "$binary_path")
Restart=on-failure

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and start the service
systemctl daemon-reload
systemctl enable "$binary_name"
systemctl start "$binary_name"

echo "Service '$binary_name' has been created and started."
