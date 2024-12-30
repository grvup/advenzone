require('dotenv').config();
const express = require('express');
// const connectDB = require('./connection');
const pgPool = require('./connectionpg');
const hashtagRoutes = require('./routes/hashtagDataRoutes');
const postRoutes = require('./routes/postsDataRoute');
const gptRoutes  = require('./routes/ChatgptRoutes')
const locationRoutes = require('./routes/getPostgresRoutes')
const rateLimit = require("express-rate-limit");
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors());
// Connect to MongoDB
// connectDB();
// pgPool.query();


// Middleware
app.use(express.json());

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: "Too many requests, please try again later.",
  });

// app.post("/searchItinerary", apiLimiter, async (req, res) => {
//     const { question } = req.body;
//     console.log(question);
//     // Modify the prompt to include Advenzone activities
//     const prompt = `
//     A user is asking: "${question}"
//     Incorporate activities from Advenzone (an adventure aggregator) where relevant. please provide the links to the all the recommendations and activities. If there are no matching activities, provide the best itinerary with common adventure options. Generate a list of activities and their links. If suggesting other activities other than advenzone, provide relevant links such as restaurants, beaches, parks, places to see etc. Format time sections to Morning, Afternoon, Evening.      
//     `;
// });
// Routes
app.get('/', (req, res) => {
    res.send('Backend is running');
});
app.use('/api', hashtagRoutes);
app.use('/api', postRoutes);
app.use('/api', gptRoutes);
app.use('/api', locationRoutes);
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
