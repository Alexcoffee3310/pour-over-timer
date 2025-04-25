const express = require('express');
const cors = require('cors');
const app = express();
const port = 8000;

// Enable CORS
app.use(cors({
    origin: 'http://localhost:5500', // or whatever port your frontend is running on
    credentials: true
}));

app.use(express.json());

// Simple in-memory storage
let recipes = [];

// GET all recipes
app.get('/api/recipes', (req, res) => {
    res.json(recipes);
});

// POST new recipe
app.post('/api/recipes', (req, res) => {
    const recipe = {
        id: Date.now().toString(),
        ...req.body
    };
    recipes.push(recipe);
    res.status(201).json(recipe);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});