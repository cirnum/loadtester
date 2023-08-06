#!/bin/bash
latest_version=$(curl -s https://api.github.com/repos/cirnum/loadtester/releases/latest | grep '"tag_name":' | cut -d'"' -f4)


# Replace these values with your Go binary details
APP_NAME="loadster"
GITHUB_USER="cirnum"
GITHUB_REPO="loadtester"
INSTALL_DIR="/usr/local/bin"


# Detect the OS and architecture
OS=$(uname | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)

# Adjust the OS and ARCH values for macOS (darwin) and x86_64
if [[ "$OS" == "darwin" ]]; then
    OS="darwin"
elif [[ "$OS" == "linux" ]]; then
    OS="linux"
fi
if [[ "$ARCH" == "amd64" ]]; then
    ARCH="amd64"
elif [[ "$ARCH" == "arm64" ]]; then
    ARCH="arm64"
elif [[ "$ARCH" == "x86_64" ]]; then
    ARCH="amd64"
fi

echo "Getting latest build for os: ${OS} and arch: ${ARCH}"
# Create the download URL
URL="https://github.com/${GITHUB_USER}/${GITHUB_REPO}/releases/download/${latest_version}/${GITHUB_REPO}-${latest_version}-${OS}-${ARCH}.tar.gz"

# Define the installation directory
NAMET="loadtester.tar.gz"
RMDIR=${GITHUB_REPO}-${latest_version}-${OS}-${ARCH}

# Step 1: Download the tarball
echo "Step 1 of 4: Downloading $URL..."
response_code=$(curl -sL -o "loadtester.tar.gz" -w "%{http_code}" $URL)
if [ "$response_code" -eq 200 ]; then
  echo "GitHub page found!"
else
  echo "Seems build not found, you can create issue here: https://github.com/cirnum/loadtester/issues"
  exit 1;
fi

curl -sL -o "loadtester.tar.gz" "$URL"

# Step 2: Extract the tarball
echo "Step 2 of 4: Extracting $NAMET..."
tar -xzf $NAMET

# Step 3: Move the extracted files to the "bin" folder
echo "Step 3 of 4: Moving files to $INSTALL_DIR..."
mv "$RMDIR/$APP_NAME" "$INSTALL_DIR"

# Step 4: Cleanup - delete the downloaded tarball and empty folder
echo "Step 4 of 4: Cleaning up..."
rm -r  "$NAMET" "$RMDIR"

# Verify installation
if command -v "$APP_NAME" &>/dev/null; then
    echo "${APP_NAME} installed successfully!"
else
    echo "Failed to install ${APP_NAME}. Please check for errors."
fi