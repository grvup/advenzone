const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// const app = express();
// const port = process.env.PORT || 5000;

// Middleware
// app.use(cors()); // Enable CORS for all routes
// app.use(express.json()); // Parse JSON bodies

// Initialize OpenAI with environment variable
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Itinerary Search Endpoint
const searchItinerary = async (req, res) => {
    try {
        // Destructure question from request body
        const { question } = req.body;
        console.log(question)
        // Validate input
        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        // Construct prompt
        const prompt = `
        A user is asking: "${question}"
        Incorporate activities from Advenzone (an adventure aggregator) where relevant. Please provide links to all recommendations and activities. 
        If no matching activities exist, provide the best itinerary with common adventure options. 
        Generate a list of activities and their links. 
        If suggesting other activities beyond Advenzone, provide relevant links for restaurants, beaches, parks, places to see, etc. 
        Format time sections as Morning, Afternoon, Evening.      
        `;

        // Call OpenAI API
        const response = await openai.chat.completions.create({
            model: "gpt-4-turbo", // Updated model name
            messages: [
                { role: "system", content: "You are a helpful travel assistant." },
                { role: "user", content: prompt }
            ],
            max_tokens: 500, // Limit token usage
        });

        // Extract and process result
        const resultText = response.choices[0].message.content;
        console.log(resultText)
        // Send response
        res.json({ 
            result: resultText,
            success: true 
        });

    } catch (error) {
        console.error('Error in search itinerary:', error);
        res.status(500).json({ 
            error: 'Failed to generate itinerary',
            details: error.message,
            success: false 
        });
    }
};

module.exports={ searchItinerary };