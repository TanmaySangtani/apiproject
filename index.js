const { default: axios } = require("axios");
const crypto = require('crypto');
const fs = require('fs')
const express = require('express')
const app = express()
app.use(express.json());

const usersClass = require('./usersClass')
// const data = require('./data.json');

// const usersList = data.userInfo || new usersClass([],process.env.currId);
const usersList = new usersClass([{id:1, name: "tanvi"},{id:2, name: "jasmine"} ,{id:3, name:"kritika"}],process.env.currId);

app.get('/users', (req,res) => {
    
    usersList.listAllUsers()
})

app.get('/users/:id', (req,res) => {
    const userId = req.params.id;
    usersList.readSingleUser(userId);

})

app.post('/users', (req,res) => {
    
        const userDetails = req.body;
        usersList.createUser(userDetails);
})

app.patch('/users/:id', (req,res) => {
    const updatedDetails = req.body;
    usersList.createUser(updatedDetails)
})

app.delete('/users/:id', (req, res) => {
    const userId = Number(req.params.id);

    if (isNaN(userId) || userId <= 0) {
        return res.status(400).json({ message: 'Invalid user ID' });
    }
    const userIndex = usersList.userInfo.findIndex(user => user.id === userId);

    if (userIndex !== -1) {
        usersList.deleteUser(userId);
        res.status(200).json({ message: 'User deleted successfully'});
    } else {
        res.status(404).json({ message: 'User not found' });
    }
});


const curr = process.env.id;

app.listen(3000)
