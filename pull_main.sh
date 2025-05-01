#!/bin/bash

# Pull from main with fast-forward only
git pull --ff-only origin main

# Check if pull was successful and if any changes were made
if [ $? -eq 0 ] && [ "$(git diff HEAD@{1} HEAD)" != "" ]; then
    echo "Changes detected, running npm install..."
    npm install
else
    echo "No changes or pull failed"
fi
