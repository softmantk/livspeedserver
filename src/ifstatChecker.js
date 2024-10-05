const { exec } = require('child_process');
const os = require('os');

// Function to check if ifstat is installed
const checkIfstat = () => {
    return new Promise((resolve, reject) => {
        exec('ifstat -v', (error, stdout) => {
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
        console.log('ifstat is not supported on this OS. Please install it manually.');
    }
};

module.exports = { checkIfstat, installInstructions };
