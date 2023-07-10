const express = require("express");
const { Restaurant } = require("../models/restaurant.model");
const restaurantRouter = express.Router();

// Get all restaurants
restaurantRouter.get('/api/restaurants', async (req, res) => {
  try {
    const restaurants = await Restaurant.find();
    res.status(200).json(restaurants);
  } catch (error) {
    console.error('Error getting restaurants:', error);
    res.status(500).json({ error: 'An error occurred while getting restaurants' });
  }
});

// Get a specific restaurant by ID
restaurantRouter.get('/api/restaurants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    res.status(200).json(restaurant);
  } catch (error) {
    console.error('Error getting restaurant:', error);
    res.status(500).json({ error: 'An error occurred while getting restaurant' });
  }
});

// Get the menu of a specific restaurant by ID
restaurantRouter.get('/api/restaurants/:id/menu', async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }
    const menu = restaurant.menu;
    res.status(200).json(menu);
  } catch (error) {
    console.error('Error getting restaurant menu:', error);
    res.status(500).json({ error: 'An error occurred while getting restaurant menu' });
  }
});

// Add a new item to a specific restaurant's menu
restaurantRouter.post('/api/restaurants', async (req, res) => {
    try {
        const restaurant = new Restaurant(req.body);
        await restaurant.save();
        res.status(201).json(restaurant);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

restaurantRouter.post('/api/restaurants/:id/menu', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, image } = req.body;

        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }

        restaurant.menu.push({ name, description, price, image });
        await restaurant.save();


        res.status(201).json(restaurant);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Delete a menu item from a specific restaurant
restaurantRouter.delete('/api/restaurants/:id/menu/:itemId', async (req, res) => {
    try {
        const { id, itemId } = req.params;
        const restaurant = await Restaurant.findById(id);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }
        const menuInd = restaurant.menu.findIndex(item => item._id.toString() === itemId);

        if (menuInd === -1) {
            return res.status(404).json({ error: 'Menu item not found' });
        }
        restaurant.menu.splice(menuInd, 1);
        await restaurant.save();

        res.status(202).json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'error' });
    }
});

module.exports = {
    restaurantRouter
};