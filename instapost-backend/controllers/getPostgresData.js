const pgPool = require('../connectionpg')

const getLocations = async(req,res) =>{
    try {
        const result = await pgPool.query('SELECT * FROM locations');
        // console.log(result);
        res.status(200).json(result.rows); // Send the data as JSON
    } catch (error) {
        console.error('Error fetching locations:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

const getActivities = async(req,res) =>{
    const {locationid} = req.query;
    console.log(locationid)
    try {
        const result = await pgPool.query('SELECT * FROM activities where locationid = $1', [locationid]);
        // console.log(result);
        res.status(200).json(result.rows); // Send the data as JSON
    } catch (error) {
        console.error('Error fetching activities:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
module.exports = {getLocations,getActivities};