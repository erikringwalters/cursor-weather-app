#!/bin/bash

# Build the app for GitHub Pages
echo "Building app for GitHub Pages..."
npm run build:gh-pages

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "Build successful! The app is ready for deployment."
    echo "Push your changes to GitHub and the GitHub Action will automatically deploy to Pages."
    echo "Or manually copy the contents of dist/weather-app/browser/ to your gh-pages branch."
else
    echo "Build failed! Please check for errors."
    exit 1
fi
