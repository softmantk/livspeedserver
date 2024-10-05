#!/usr/bin/env node
const express = require('express');
const path = require('path');
const { checkIfstat, installInstructions } = require('./ifstatChecker');
const networkController = require('./controllers/networkController');

const app = express();
const PORT = process.argv.includes('-p') ?
    parseInt(process.argv[process.argv.indexOf('-p') + 1]) || 8010 : 8010;

// Check for ifstat before starting the server
checkIfstat()
.then(() => {
    console.log('ifstat is installed. Starting the server...');

    app.use(express.static(path.join(__dirname, 'public')));

    // Define the /network-usage endpoint
    app.get('/network-usage', networkController.getNetworkUsage);

    // Start the Express server
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
})
.catch((error) => {
    console.error('ifstat is not installed. Please install it to use this application.', error);
    installInstructions();
});
