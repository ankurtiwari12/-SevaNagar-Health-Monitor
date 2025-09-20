#!/bin/bash

echo "========================================"
echo "SevaNagar Health Dashboard Setup"
echo "========================================"
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

echo "Node.js found: $(node --version)"
echo

# Install dependencies
echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi

echo
echo "Dependencies installed successfully!"
echo
echo "Starting SevaNagar Health Dashboard..."
echo
echo "The dashboard will be available at: http://localhost:3000"
echo "Press Ctrl+C to stop the server"
echo

# Start the server
npm start