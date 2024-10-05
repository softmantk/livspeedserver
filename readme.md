# Live Network Usage Monitor

This project is a Node.js installation package named **livspeedserver** that monitors and displays network usage in real-time. It provides a live view of upload and download speeds, along with average speeds over time. The application also supports night mode for better visibility in low-light environments.

## Features

- Real-time monitoring of upload and download speeds
- Display of average upload and download speeds
- Night mode support that persists across sessions
- Responsive design for different screen sizes

## Prerequisites

- **Node.js** (v14 or higher)
- **ifstat** tool (for network statistics)

## Installation

1. **Install the ifstat tool**:
   Ensure you have `ifstat` installed on your system. You can install it using the following command:
   ```bash
   # For Debian/Ubuntu
   sudo apt-get install ifstat

   # For macOS (using Homebrew)
   brew install ifstat
