require('dotenv').config();
const express = require('express');
const connectDB = require('./connection');
const hashtagRoutes = require('./routes/hashtagDataRoutes');
const postRoutes = require('./routes/postsDataRoute');
const gptRoutes  = require('./routes/ChatgptRoutes')
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');

app.use(cors());
// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
    res.send('Backend is running');
});
app.use('/api', hashtagRoutes);
app.use('/api', postRoutes);
app.use('/api', gptRoutes);
// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
