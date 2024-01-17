const { default: axios } = require("axios");
const crypto = require('crypto');
const fs = require('fs')
const express = require('express')
const app = express()
app.use(express.json());


const usersClass = require('./usersClass')
// const data = require('./data.json');

// const usersList = data.userInfo || new usersClass([],process.env.currId);
const usersList = new usersClass([],process.env.currId);

app.get('/users', (req,res) => {
    
    usersList.listAllUsers()
})

app.get('/users/:id', (req,res) => {
    const userId = req.params.id;
    usersList.readSingleUser(userId);
})

app.post('/users', (req,res) => {
    const userDetails = req.body;
    usersList.createUser(userDetails)
})

app.patch('/users/:id', (req,res) => {
    const updatedDetails = req.body;


    try {
        if (parseInt(req.params.id)) {
            updatedDetails.id = parseInt(req.params.id) 
        }
        else { 
            const error = new Error('id is not a number')
            error.status = 400
            throw error
        }

        usersList.updateUser(updatedDetails)

        res.status(200).json({message: "User updated successfully"})
    }
    catch (err) {
        res.status(err.status).json({message: err.message})
    }
})

app.delete('/users/:id' , (req,res) => {
    const userId = req.params.id;
    usersList.deleteUser(userId)
})

const curr = process.env.id;

app.listen(3000)
