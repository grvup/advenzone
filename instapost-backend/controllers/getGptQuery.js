const express = require('express');
const cors = require('cors');
const { OpenAI } = require('openai');
const dotenv = require('dotenv');
const axios = require('axios');
const { Pool } = require('pg');
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
const pgPool = require('../connectionpg')
// const pool = new Pool(dbConfig);
// Itinerary Search Endpoint
// const searchItinerary = async (req, res) => {
//     try {
//         // Destructure question from request body
//         const { question } = req.body;
//         console.log(question)
//         // Validate input
//         if (!question) {
//             return res.status(400).json({ error: 'Question is required' });
//         }

//         // Construct prompt
//         const prompt = `
//             A user is asking: "${question}"
//             Incorporate activities from Advenzone (an adventure aggregator) where relevant. please provide the links to the all the recommendations and activities. If there are no matching activities, provide the best itinerary with common adventure options. Generate a list of activities and their links. If suggesting other activities other than advenzone, provide relevant links such as restaurants, beaches, parks, places to see etc. Format time sections to Morning, Afternoon, Evening.      
//         `;
//         // const prompt = `
//         // A user is asking: "${question}"
//         // Incorporate activities from Advenzone (an adventure aggregator) where relevant. Please provide links to all recommendations and activities. 
//         // If no matching activities exist, provide the best itinerary with common adventure options. 
//         // Generate a list of activities and their links. 
//         // If suggesting other activities beyond Advenzone, provide relevant links for restaurants, beaches, parks, places to see, etc. 
//         // Format time sections as Morning, Afternoon, Evening.      
//         // `;

//         // Call OpenAI API
        // const response = await openai.chat.completions.create({
        //     model: "gpt-4-turbo", // Updated model name
        //     messages: [
        //         { role: "system", content: "You are a helpful travel assistant." },
        //         { role: "user", content: prompt }
        //     ],
        //     max_tokens: 500, // Limit token usage
        // });

//         // Extract and process result
//         const resultText = response.choices[0].message.content;
//         console.log(resultText)
//         // Send response
//         res.json({ 
//             result: resultText,
//             success: true 
//         });

//     } catch (error) {
//         console.error('Error in search itinerary:', error);
//         res.status(500).json({ 
//             error: 'Failed to generate itinerary',
//             details: error.message,
//             success: false 
//         });
//     }
// };

const getAdvenzoneLinks = async () => {
    const query = `
        SELECT
            activities.id AS activity_id,
            activities.addressline1 AS activity_name,
            activities.category AS activity_category,
            locations.id AS location_id,
            locations.locationname AS location_name
        FROM activities
        JOIN locations ON activities.locationid = locations.id;
    `;

    try {
        const result = await pgPool.query(query);
        const activities = result.rows;

        // Generate links based on database records
        const links = activities.map(activity => {
            const { activity_id, activity_name,activity_category, location_id, location_name } = activity;

            // Format activity name and location name to URL-safe slugs
            const activitySlug = activity_name.toLowerCase().replace(/\s+/g, '-');
            const locationSlug = location_name.toLowerCase().replace(/\s+/g, '-');

            return {
                activity: activity_name,
                location: location_name,
                url: `https://staging.advenzone.in/location/${location_id}/${activity_category}-details/${activity_id}/${locationSlug}/${activitySlug}`
            };
        });

        return links;
    } catch (error) {
        console.error('Error querying database:', error);
        throw new Error('Failed to fetch activities from database');
    }
};


// const searchItinerary = async (req, res) => {
//     try {
//         const { question } = req.body;
//         console.log('User question:', question);

//         // Validate input
//         if (!question) {
//             return res.status(400).json({ error: 'Question is required' });
//         }

//         // Fetch Advenzone links from the database
//         const advenzoneLinks = await getAdvenzoneLinks();

//         // Construct system and user prompts for GPT model
//         const systemMessage = "You are an advanced travel assistant capable of creating comprehensive itineraries by incorporating data from both specific and general sources.";
//         const userPrompt = `A user is asking: "${question}"

// Here are activities available on Advenzone with their links:
// ${advenzoneLinks.map(link => `- ${link.activity} at ${link.location}: ${link.url}`).join('\n')}

// Incorporate the above activities where relevant. If there are no matching activities, create the best itinerary with general adventure options. Include links for restaurants, beaches, parks, and other points of interest where appropriate. Format the itinerary into sections: Morning, Afternoon, and Evening.`;

//         // Call OpenAI API
//         const openaiResponse = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo", // Use GPT-4 Turbo if available
//             messages: [
//                 { role: "system", content: systemMessage },
//                 { role: "user", content: userPrompt }
//             ],
//             max_tokens: 500,
//             temperature: 0.7,
//         });

//         // Extract result from the API response
//         const resultText = openaiResponse.choices[0]?.message?.content;

//         if (!resultText) {
//             return res.status(500).json({ error: 'No response from OpenAI API', success: false });
//         }

//         console.log('Generated Itinerary:', resultText);

//         // Send the response back to the client
//         res.json({
//             result: resultText,
//             success: true
//         });

//     } catch (error) {
//         console.error('Error in searchItinerary:', error);
//         res.status(500).json({
//             error: 'Failed to generate itinerary',
//             details: error.message,
//             success: false
//         });
//     }
// };
const searchItinerary = async (req, res) => {
    try {
        const { question } = req.body;
        console.log('User question:', question);

        // Validate input
        if (!question) {
            return res.status(400).json({ error: 'Question is required' });
        }

        // Fetch Advenzone links from the database
        const advenzoneLinks = await getAdvenzoneLinks();

        // Construct system and user prompts for GPT model
        const systemMessage = "You are an advanced travel assistant capable of creating comprehensive itineraries by incorporating data from both specific and general sources.";

        const userPrompt = `A user is asking: "${question}"

Here are activities available on Advenzone with their links:
${advenzoneLinks.map(link => `- ${link.activity} at ${link.location}: ${link.url}`).join('\n')}

Use the following format for your response:
[
    {
        day: <number>, 
        title: <string>, 
        backgroundImage: <string>, // use searchgpt for getting URL of the background image for the partiucalar day with respect to city
        activities: {
            morning: [
                {
                    name: <string>, 
                    link: <string>
                },
            ],
            afternoon: [
                {
                    name: <string>,
                    link: <string>
                },
            ],
            evening: [
                {
                    name: <string>, 
                    link: <string> 
                },
            ]
        }
    },
];

Generate a multi-day itinerary specific to the destination mentioned in the question in the above format. Only include activities, restaurants, and points of interest relevant to the mentioned city. If data for a specific activity is missing, use SearchGPT to fetch real links from the web related to the destination. Format the itinerary into sections: Morning, Afternoon, and Evening. Do not include activities from unrelated destinations.`;

        // Call OpenAI API
        const openaiResponse = await openai.chat.completions.create({
            model: "gpt-4-turbo", // Use GPT-4 Turbo if available
            messages: [
                { role: "system", content: systemMessage },
                { role: "user", content: userPrompt }
            ],
            max_tokens: 2000, // Increase token limit to handle longer responses
            temperature: 0.7,
        });

        // Extract result from the API response
        const resultText = openaiResponse.choices[0]?.message?.content;

        if (!resultText) {
            return res.status(500).json({ error: 'No response from OpenAI API', success: false });
        }
        const query = `
            INSERT INTO gpt_itineraries (username, query, output)
            VALUES ($1, $2, $3)
            RETURNING id, created_at;
        `;

        const values = ['gaurav', question, resultText];
        const dbResult = await pgPool.query(query, values);

        console.log('Generated Itinerary:', resultText);
        console.log('Saved to database with ID:', dbResult.rows[0].id);

        // console.log('Generated Itinerary:', resultText);
        // console.log('Generated Itinerary:', resultText.itineraryData);

        // Send the response back to the client
        res.json({
            result: resultText,
            saved_id: dbResult.rows[0].id,
            created_at: dbResult.rows[0].created_at,
            success: true
        });

    } catch (error) {
        console.error('Error in searchItinerary:', error);
        res.status(500).json({
            error: 'Failed to generate itinerary',
            details: error.message,
            success: false
        });
    }
};


// const searchItinerary = async (req, res) => {
//     try {
//         // Extract question from request body
//         const { question } = req.body;
//         console.log(question);

//         // Validate input
//         if (!question) {
//             return res.status(400).json({ error: 'Question is required' });
//         }

//         // Construct system and user prompts for GPT model
//         const systemMessage = "You are an advanced travel assistant capable of creating comprehensive itineraries by incorporating data from both specific and general sources.";
//         const userPrompt = `A user is asking: "${question}"

// Incorporate activities from Advenzone (an adventure aggregator) where relevant. Provide links to all recommendations and activities. If there are no Advenzone activities, create the best itinerary with general adventure options. Include links for restaurants, beaches, parks, and other points of interest where appropriate. Format the itinerary into sections: Morning, Afternoon, and Evening.`;

//         // Call OpenAI API
//         const openaiResponse = await openai.chat.completions.create({
//             model: "gpt-3.5-turbo", // Use GPT-4 Turbo for optimal performance
//             messages: [
//                 { role: "system", content: systemMessage },
//                 { role: "user", content: userPrompt }
//             ],
//             max_tokens: 500, // Adjust token limit based on expected response size
//             temperature: 0.7, // Control response creativity
//         });

//         // Extract result from the API response
//         const resultText = openaiResponse.choices[0]?.message?.content;

//         if (!resultText) {
//             return res.status(500).json({ error: 'No response from OpenAI API', success: false });
//         }

//         console.log(resultText);

//         // Send the response back to the client
//         res.json({ 
//             result: resultText,
//             success: true 
//         });

//     } catch (error) {
//         console.error('Error in searchItinerary:', error);
//         res.status(500).json({ 
//             error: 'Failed to generate itinerary',
//             details: error.message,
//             success: false 
//         });
//     }
// };

module.exports={ searchItinerary };