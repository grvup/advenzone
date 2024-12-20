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

const getPastItineraries = async (req, res) => {
    // const client = await pool.connect();

    try {
        const query = `
            SELECT *
            FROM gpt_itineraries
            WHERE username = $1
            ORDER BY created_at DESC;
        `;

        const result = await pgPool.query(query, ['gaurav']);
        // console.log(result)
        res.json({
            itineraries: result.rows,
            success: true
        });

    } catch (error) {
        console.error('Error retrieving past itineraries:', error);
        res.status(500).json({
            error: 'Failed to retrieve past itineraries',
            details: error.message,
            success: false
        });
    } 
};

module.exports = {getLocations,getActivities , getPastItineraries};