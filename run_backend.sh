#!/bin/bash
# Navigate to the project root directory
cd "$(dirname "$0")"

# Activate the macOS virtual environment
if [ -d "mac_env" ]; then
    echo "Activating virtual environment..."
    source mac_env/bin/activate
else
    echo "Error: mac_env virtual environment not found in the root directory!"
    exit 1
fi

# Navigate to backend and run commands
cd backend
echo "Running migrations..."
python manage.py migrate

echo "Starting server..."
python manage.py runserver
