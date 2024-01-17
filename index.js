const { default: axios } = require("axios");
const crypto = require('crypto');
const fs = require('fs')
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const usersClass = require('./usersClass')
// const data = require('./data.json');

// const usersList = data.userInfo || new usersClass([],process.env.currId);
const usersList = new usersClass([],parseInt(process.env.currId));

app.get('/users', (req,res) => {
    
    usersList.listAllUsers()
})

app.get('/users/:id', (req,res) => {
    const userId = req.params.id;
    usersList.readSingleUser(userId);
})

app.post('/users', (req,res, next) => {
    const userDetails = req.body;
    try{

        const data = usersList.createUser(userDetails);
        console.log(usersList);
        res.status(200).json(data);
    }
    catch(err){
        
        res.status(400).json({message: err.message});
    }
    
})

app.patch('/users/:id', (req,res) => {
    const updatedDetails = req.body;
    usersList.createUser(updatedDetails)
})

app.delete('/users/:id' , (req,res) => {
    const userId = req.params.id;
    usersList.deleteUser(userId)
})

const curr = process.env.id;

app.listen(3000)
