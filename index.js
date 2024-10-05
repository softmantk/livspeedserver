#!/usr/bin/env node
const express = require('express');
const { exec } = require('child_process');
const os = require('os'); // Import the os module
const app = express();

// Default port is 8010; can be changed with command-line argument
const PORT = process.argv.includes('-p') ?
    parseInt(process.argv[process.argv.indexOf('-p') + 1]) || 8010 : 8010;

// Function to check if ifstat is installed
const checkIfstat = () => {
    return new Promise((resolve, reject) => {
        exec('ifstat -v', (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve(stdout);
            }
        });
    });
};

// Function to provide installation instructions based on OS
const installInstructions = () => {
    const platform = os.platform();
    if (platform === 'darwin') {
        console.log('To install ifstat on macOS, use Homebrew:');
        console.log('  brew install ifstat');
    } else if (platform === 'linux') {
        console.log('To install ifstat on Linux, use the package manager for your distribution:');
        console.log('  For Debian/Ubuntu: sudo apt install ifstat');
        console.log('  For Red Hat/Fedora: sudo dnf install ifstat');
    } else {
        console.log('ifstat is not installed. Please install it manually.');
    }
};

// Function to fetch and log network usage
const fetchNetworkUsage = () => {
    exec('ifstat 1 1', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return;
        }

        const lines = stdout.trim().split('\n');
        if (lines.length < 3) {
            console.error('Not enough data returned');
            return;
        }

        // Find the line that starts with a number (indicating data)
        const dataLine = lines.find(line => /^\s*\d/.test(line));

        if (!dataLine) {
            console.error('No valid data line found');
            return;
        }

        // Split the data line into individual values
        const dataValues = dataLine.trim().split(/\s+/);

        // Ensure that there are even number of values (KB/s in and KB/s out per interface)
        if (dataValues.length % 2 !== 0) {
            console.error('Unexpected data format');
            return;
        }

        let totalDownloadKB = 0;
        let totalUploadKB = 0;

        // Iterate through the data values, summing downloads and uploads
        for (let i = 0; i < dataValues.length; i += 2) {
            const downloadKB = parseFloat(dataValues[i]);
            const uploadKB = parseFloat(dataValues[i + 1]);

            // Validate parsed numbers
            if (isNaN(downloadKB) || isNaN(uploadKB)) {
                console.error('Invalid numerical data encountered');
                return;
            }

            totalDownloadKB += downloadKB;
            totalUploadKB += uploadKB;
        }

        // Convert KB/s to Mbps
        const downloadMbps = (totalDownloadKB * 8 / 1000).toFixed(2); // convert to Mbps
        const uploadMbps = (totalUploadKB * 8 / 1000).toFixed(2); // convert to Mbps

        // Log the speeds to the console on the same line
        process.stdout.write(`\rUpload Speed: ${uploadMbps} Mbps, Download Speed: ${downloadMbps} Mbps`);
    });
};

// Check for ifstat before starting the server
checkIfstat()
.then(() => {
    console.log('ifstat is installed. Starting the server...');

    // Set an interval to log network usage every second
    setInterval(fetchNetworkUsage, 1000);

    // Define the /network-usage endpoint
    app.get('/network-usage', (req, res) => {
        exec('ifstat 1 1', (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                return res.status(500).send('Error fetching network usage');
            }

            const lines = stdout.trim().split('\n');
            if (lines.length < 3) {
                return res.status(500).send('Not enough data returned');
            }

            // Find the line that starts with a number (indicating data)
            const dataLine = lines.find(line => /^\s*\d/.test(line));

            if (!dataLine) {
                return res.status(500).send('No valid data line found');
            }

            // Split the data line into individual values
            const dataValues = dataLine.trim().split(/\s+/);

            // Ensure that there are even number of values (KB/s in and KB/s out per interface)
            if (dataValues.length % 2 !== 0) {
                return res.status(500).send('Unexpected data format');
            }

            let totalDownloadKB = 0;
            let totalUploadKB = 0;

            // Iterate through the data values, summing downloads and uploads
            for (let i = 0; i < dataValues.length; i += 2) {
                const downloadKB = parseFloat(dataValues[i]);
                const uploadKB = parseFloat(dataValues[i + 1]);

                // Validate parsed numbers
                if (isNaN(downloadKB) || isNaN(uploadKB)) {
                    return res.status(500).send('Invalid numerical data encountered');
                }

                totalDownloadKB += downloadKB;
                totalUploadKB += uploadKB;
            }

            // Convert KB/s to Mbps
            const downloadMbps = (totalDownloadKB * 8 / 1000).toFixed(2); // convert to Mbps
            const uploadMbps = (totalUploadKB * 8 / 1000).toFixed(2); // convert to Mbps

            res.json({
                upload: uploadMbps, // Upload speed in Mbps
                download: downloadMbps, // Download speed in Mbps
            });
        });
    });

    // Define the root endpoint
    app.get('/', (req, res) => {
        res.send(`
                <h1>Live Network Usage Monitor</h1>
                <div id="results">
                    <p>Upload Speed: <span id="upload">0</span> Mbps</p>
                    <p>Download Speed: <span id="download">0</span> Mbps</p>
                </div>
                <script>
                    function fetchUsage() {
                        fetch('/network-usage')
                            .then(response => response.json())
                            .then(data => {
                                document.getElementById('upload').innerText = data.upload;
                                document.getElementById('download').innerText = data.download;
                            })
                            .catch(err => {
                                console.error(err);
                            });
                    }

                    // Fetch usage every second
                    setInterval(fetchUsage, 1000);
                    // Initial fetch
                    fetchUsage();
                </script>
            `);
    });

    // Start the Express server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
.catch((error) => {
    console.error('ifstat is not installed. Please install it to use this application.');
    installInstructions();
});
