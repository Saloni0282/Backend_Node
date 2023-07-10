const express = require("express");
const { Order } = require("../models/order.model");
const { Restaurant } = require("../models/restaurant.model");
const orderRouter = express.Router();

// Place an order
orderRouter.post('/api/orders', async (req, res) => {
    try {
        const { userId, restaurantId, items: { name, price, quantity, totalPrice, deliveryAddress } } = req.body;
        const user = await Order.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurant not found' });
        }
        // Create a new order
        const order = new Order({
            user: user._id,
            restaurant: restaurant._id,
            items: { name, price, quantity, totalPrice, deliveryAddress },
            totalPrice,
            deliveryAddress,
            status: 'placed',
        });
        await order.save();
        res.status(201).json({ message: 'Order placed successfully' });
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(500).json({ error: 'An error occurred while placing order' });
    }
});

module.exports = {
    orderRouter
}