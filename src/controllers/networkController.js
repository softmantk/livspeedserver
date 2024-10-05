const networkService = require('../services/networkService');

// Controller function for the /network-usage endpoint
const getNetworkUsage = async (req, res) => {
    try {
        const networkUsage = await networkService.fetchNetworkUsage();
        res.json(networkUsage);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching network usage');
    }
};

module.exports = { getNetworkUsage };
