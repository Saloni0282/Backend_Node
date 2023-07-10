const express = require("express");
const { User } = require("../models/user.model");
const bcrypt  = require('bcrypt') ;
const jwt  = require('jsonwebtoken') ;
const userRouter = express.Router();

userRouter.post('/api/register', async (req, res) => {
    try {
        const { name, email, password, address: {street,city,state,country,zip}} = req.body;
        const hashedPassword =bcrypt.hashSync(password, 8);
        const user = new User({ name, email, password: hashedPassword, address: { street, city, state, country, zip } });
        await user.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({msg: "Something went wrong"})
    }
});
userRouter.get('/api/user', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.error('getting:', error);
        res.status(500).json({ error: 'An error occurred while getting restaurants' });
    }
});

// User login
userRouter.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const passwordMatch =bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }
        const token = jwt.sign({ userId: user._id }, 'TokenKey');
        res.status(201).json({ message: 'Login successful', Token: token });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'An error occurred while logging in' });
    }
});

//Update user password
userRouter.put('/api/user/:id/reset', async (req, res) => {
    try {
        const { id } = req.params;
        const { currPass, resetPass } = req.body;

        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const isPasswordValid = bcrypt.compareSync(currPass, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid current password' });
        }
        const hashedPassword = await bcrypt.hash(resetPass, 8);
        user.password = hashedPassword;
        await user.save();
        res.sendStatus(204);
    } catch (error) {

        res.status(500).json({ error: 'Error' });
    }
})



module.exports = {
    userRouter
};

