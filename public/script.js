const uploadData = [];
const downloadData = [];
const labels = [];
let totalUpload = 0;
let totalDownload = 0;
let dataCount = 0;

const ctx = document.getElementById('usageChart').getContext('2d');
const usageChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: labels,
        datasets: [
            {
                label: 'Upload (MB)',
                data: uploadData,
                borderColor: 'rgba(75, 192, 192, 1)',
                fill: false,
            },
            {
                label: 'Download (MB)',
                data: downloadData,
                borderColor: 'rgba(153, 102, 255, 1)',
                fill: false,
            },
        ],
    },
    options: {
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (seconds)',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Data (MB)',
                },
            },
        },
    },
});

function fetchUsage() {
    fetch('/network-usage')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        const currentUpload = parseFloat(data.upload) || 0; // Ensure we don't get NaN
        const currentDownload = parseFloat(data.download) || 0; // Ensure we don't get NaN
        document.getElementById('upload').innerText = currentUpload.toFixed(2);
        document.getElementById('download').innerText = currentDownload.toFixed(2);

        // Update totals and count for averages
        totalUpload += currentUpload;
        totalDownload += currentDownload;

        // Increment data count only if the current values are valid
        if (currentUpload > 0 || currentDownload > 0) {
            dataCount++;
        }

        // Calculate averages
        const avgUpload = dataCount > 0 ? (totalUpload / dataCount).toFixed(2) : 0;
        const avgDownload = dataCount > 0 ? (totalDownload / dataCount).toFixed(2) : 0;
        document.getElementById('avgUpload').innerText = avgUpload;
        document.getElementById('avgDownload').innerText = avgDownload;

        // Update chart data
        uploadData.push(currentUpload);
        downloadData.push(currentDownload);
        labels.push(labels.length + 1); // Increment time label

        // Update chart
        usageChart.update();
    })
    .catch(err => {
        console.error('Fetch error:', err); // Debugging: Log fetch errors
    });
}

let intervalId;

function startFetching() {
    intervalId = setInterval(fetchUsage, 1000);
}

function stopFetching() {
    clearInterval(intervalId);
}

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        startFetching();
    } else {
        stopFetching();
    }
});

fetchUsage(); // Initial fetch

// Night mode toggle
const toggleNightModeButton = document.getElementById('toggleNightMode');

// Function to apply night mode based on localStorage
function applyNightMode() {
    if (localStorage.getItem('nightMode') === 'enabled') {
        document.body.classList.add('night-mode');
    } else {
        document.body.classList.remove('night-mode');
    }
}

// Initial check for night mode on page load
applyNightMode();

// Event listener for night mode toggle
toggleNightModeButton.addEventListener('click', () => {
    document.body.classList.toggle('night-mode');

    // Update localStorage based on the current state
    if (document.body.classList.contains('night-mode')) {
        localStorage.setItem('nightMode', 'enabled');
    } else {
        localStorage.setItem('nightMode', 'disabled');
    }
});
