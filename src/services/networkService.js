const { exec } = require('child_process');

// Function to fetch network usage data
const fetchNetworkUsage = () => {
    return new Promise((resolve, reject) => {
        exec('ifstat 1 1', (error, stdout) => {
            if (error) {
                return reject(`exec error: ${error}`);
            }

            const lines = stdout.trim().split('\n');
            if (lines.length < 3) {
                return reject('Not enough data returned');
            }

            const dataLine = lines.find(line => /^\s*\d/.test(line));
            if (!dataLine) {
                return reject('No valid data line found');
            }

            const dataValues = dataLine.trim().split(/\s+/);
            if (dataValues.length % 2 !== 0) {
                return reject('Unexpected data format');
            }

            let totalDownloadKB = 0;
            let totalUploadKB = 0;

            for (let i = 0; i < dataValues.length; i += 2) {
                const downloadKB = parseFloat(dataValues[i]);
                const uploadKB = parseFloat(dataValues[i + 1]);

                if (isNaN(downloadKB) || isNaN(uploadKB)) {
                    return reject('Invalid numerical data encountered');
                }

                totalDownloadKB += downloadKB;
                totalUploadKB += uploadKB;
            }

            const downloadMbps = (totalDownloadKB * 8 / 1000).toFixed(2);
            const uploadMbps = (totalUploadKB * 8 / 1000).toFixed(2);

            resolve({ upload: uploadMbps, download: downloadMbps });
        });
    });
};

module.exports = { fetchNetworkUsage };
