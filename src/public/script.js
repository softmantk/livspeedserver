const uploadData = [];
const downloadData = [];
const labels = [];
let totalUpload = 0;
let totalDownload = 0;
let dataCount = 0;
let intervalId;
const FETCH_INTERVAL = 1000; // Fetch interval in milliseconds
const INACTIVITY_TIMEOUT = 10 * 60 * 1000; // 10 minutes in milliseconds
let inactivityTimeout;

// Initialize Chart.js
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

// Fetch network usage data
function fetchUsage() {
    fetch('/network-usage')
    .then(handleResponse)
    .then(updateUsageData)
    .catch(handleError);
}

// Handle fetch response
function handleResponse( response ) {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

// Handle fetch error
function handleError( err ) {
    console.error('Fetch error:', err);
    document.getElementById('error-message').innerText = 'Failed to fetch data. Please try again later.';
}

// Update the displayed usage data and chart
function updateUsageData( data ) {
    const currentUpload = parseFloat(data.upload) || 0;
    const currentDownload = parseFloat(data.download) || 0;

    document.getElementById('upload').innerText = currentUpload.toFixed(2);
    document.getElementById('download').innerText = currentDownload.toFixed(2);

    // Update totals and count for averages
    updateTotals(currentUpload, currentDownload);

    // Update chart data
    updateChartData(currentUpload, currentDownload);

    // Update the chart
    usageChart.update();

    // Reset inactivity timer on successful fetch
    resetInactivityTimer();
}

// Update totals and data count
function updateTotals( currentUpload, currentDownload ) {
    totalUpload += currentUpload;
    totalDownload += currentDownload;

    if (currentUpload > 0 || currentDownload > 0) {
        dataCount++;
    }

    const avgUpload = (dataCount > 0) ? (totalUpload / dataCount).toFixed(2) : 0;
    const avgDownload = (dataCount > 0) ? (totalDownload / dataCount).toFixed(2) : 0;

    document.getElementById('avgUpload').innerText = avgUpload;
    document.getElementById('avgDownload').innerText = avgDownload;
}

// Update chart data
function updateChartData( currentUpload, currentDownload ) {
    uploadData.push(currentUpload);
    downloadData.push(currentDownload);
    labels.push(labels.length + 1);
}

// Start fetching data at a regular interval
function startFetching() {
    if (!intervalId) { // Prevent multiple intervals
        intervalId = setInterval(fetchUsage, FETCH_INTERVAL);
        fetchUsage(); // Fetch immediately to get initial data
    }
}

// Stop fetching data
function stopFetching() {
    clearInterval(intervalId);
    intervalId = null; // Clear the interval ID
}

// Handle tab visibility change
document.addEventListener('visibilitychange', handleVisibilityChange);

// Handle visibility change event
function handleVisibilityChange() {
    if (document.visibilityState === 'visible') {
        resetInactivityTimer(); // Reset inactivity timer when the tab is active
    } else {
        setInactivityTimeout(); // Start inactivity timeout when tab is hidden
    }
}

// Reset inactivity timer
function resetInactivityTimer() {
    clearTimeout(inactivityTimeout);
}

// Set timeout to stop fetching after inactivity
function setInactivityTimeout() {
    inactivityTimeout = setTimeout(() => {
        stopFetching(); // Stop fetching if inactive for 10 minutes
        console.log('Stopped fetching due to inactivity for 10 minutes.');
    }, INACTIVITY_TIMEOUT);
}

// Initial fetch and start fetching on page load
startFetching(); // Start fetching immediately

// Night mode toggle
const toggleNightModeButton = document.getElementById('toggleNightMode');

// Apply night mode based on localStorage
function applyNightMode() {
    const nightMode = localStorage.getItem('nightMode');
    document.body.classList.toggle('night-mode', nightMode === 'enabled');
}

// Initial check for night mode on page load
applyNightMode();

// Event listener for night mode toggle
toggleNightModeButton.addEventListener('click', toggleNightMode);

// Toggle night mode and save to localStorage
function toggleNightMode() {
    const isNightModeEnabled = document.body.classList.toggle('night-mode');
    localStorage.setItem('nightMode', isNightModeEnabled ? 'enabled' : 'disabled');
}
