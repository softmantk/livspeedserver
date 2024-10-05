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
   ```

2. **Install the package globally**:
   Use npm to install the **livspeedserver** package globally:
   ```bash
   npm install -g livspeedserver
   ```

## Running the Application

1. **Start the server**:
   After installation, you can start the server using the command:
   ```bash
   livspeedserver
   ```

   You can also specify a custom port using the `-p` flag:
   ```bash
   livspeedserver -p 8080
   ```

2. **Access the application**:
   Open your web browser and navigate to `http://localhost:8010` (or the port you have set).

## Configuration

- The application serves static files from the `public` folder.
- Network usage data is fetched from the endpoint `/network-usage`. Ensure you have a server or API providing this data in the correct format.

## Command-Line Options

- **Custom Port**: Specify a custom port with the `-p` option:
  ```bash
  livspeedserver -p 8080
  ```

- **Disable Console Logging**: To disable console logging of network speeds, use the `--no-log` option:
  ```bash
  livspeedserver --no-log
  ```

## Night Mode 

- Click the "Toggle Night Mode" button to switch between light and dark themes. Your preference will be saved in the browser's local storage.

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Chart.js](https://www.chartjs.org/) for data visualization.
- [Express](https://expressjs.com/) for server-side functionality.
