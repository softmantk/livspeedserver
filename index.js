#!/usr/bin/env node
const express = require('express');
const { exec } = require('child_process');
const app = express();

// Default port is 8010; can be changed with command-line argument
const PORT = process.argv.includes('-p') ?
    parseInt(process.argv[process.argv.indexOf('-p') + 1]) || 8010 : 8010;

app.get('/network-usage', (req, res) => {
    // Use ifstat to get network usage
    exec('ifstat 1 1', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            return res.status(500).send('Error fetching network usage');
        }

        const lines = stdout.trim().split('\n');
        if (lines.length < 3) {
            return res.status(500).send('Not enough data returned');
        }

        // The last line contains the usage data
        const lastLine = lines[lines.length - 1].trim().split(/\s+/);
        const uploadKB = parseFloat(lastLine[1]);
        const downloadKB = parseFloat(lastLine[0]);

        // Convert KB/s to Mbps
        const uploadMbps = (uploadKB * 8 / 1000).toFixed(2); // convert to Mbps
        const downloadMbps = (downloadKB * 8 / 1000).toFixed(2); // convert to Mbps

        res.json({
            upload: uploadMbps, // Upload speed in Mbps
            download: downloadMbps, // Download speed in Mbps
        });
    });
});

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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

