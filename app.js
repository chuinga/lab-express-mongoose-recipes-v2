const express = require("express");
const logger = require("morgan");
const mongoose = require('mongoose');
const Recipe = require("./models/Recipe.model");

const app = express();

// MIDDLEWARE
app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());


// Iteration 1 - Connect to MongoDB
// DATABASE CONNECTION
const MONGODB_URI = "mongodb://127.0.0.1:27017/express-mongoose-recipes-dev";

mongoose
  .connect(MONGODB_URI)
  .then((x) => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
  .catch((err) => console.error("Error connecting to mongo", err));


// ROUTES
//  GET  / route - This is just an example route
app.get('/', (req, res) => {
    res.send("<h1>LAB | Express Mongoose Recipes</h1>");
});


//  Iteration 3 - Create a Recipe route
//  POST  /recipes route
app.post('/recipes', async (request, response) => {
    const payload = request.body;
    try {
        const newRecipe = await Recipe.create(payload);
        response.status(201).json(newRecipe)
    } catch (error){
        response.status(500).json({ error, message: 'Somethin happened maybe on the server'})
    }
});

//  Iteration 4 - Get All Recipes
//  GET  /recipes route
app.get("/recipes", async (request, response) => {
    try {
      const recipes = await Recipe.find({});
      response.status(200).json(recipes);
    } catch (error) {
        response.status(500).json({ error: "Error on getting all recipes" });
    }
  });

//  Iteration 5 - Get a Single Recipe
//  GET  /recipes/:id route
app.get('/recipes/:id', async (request, response) => {
    try {
        const recipeId = request.params.id;
        const oneRecipe = await Recipe.findById(recipeId);
        if (!oneRecipe) {
            return response.status(404).json({ message: "Recipe not found" });
          }
        response.status(200).json(oneRecipe);
    } catch (error) {
        response.status(500).json( {error, message: 'Error on getting recipe' })
    }
});

//  Iteration 6 - Update a Single Recipe
//  PUT  /recipes/:id route
app.put("/recipes/:id", async (request, response) => {
    const id = request.params.id;
    const payload = request.body;
    try {
      const updatedRecipe = await Recipe.findByIdAndUpdate(id, payload, {
        new: true,
      });
      response.status(200).json(updatedRecipe);
    } catch (error) {
        response.status(500).json({ error: "Error on updating recipe" });
    }
  });

//  Iteration 7 - Delete a Single Recipe
//  DELETE  /recipes/:id route
app.delete('/recipes/:id', async (request, response) => {
    try {
        const recipeId = request.params.id;
        const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
        if (!deletedRecipe) {
            return response.status(404).json({ message: "Recipe not found" });
          }
        response.status(204).send();
    } catch (error) {
        response.status(500).json( {error, message: 'Error on deleting recipe' })
    }
});


// Start the server
app.listen(5005, () => console.log('My first app listening on port 5005!'));



//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;
