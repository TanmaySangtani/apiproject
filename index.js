const { default: axios } = require("axios");
const crypto = require('crypto');
const fs = require('fs')
const express = require('express')
const app = express()
app.use(express.json());

const curr = process.env.id;

class users {
    constructor(curr){
        this.userInfo = []
        this.currId = curr
    }

    // verify the details and add it to the users and save it in data.json file
    createUser(){
        app.post('/users', (req,res) => {

        })
    }

    deleteUser(){
        app.delete('/:id', (req,res) => {

        })
    }

    listAllUsers(){
        app.get('/users', (req,res) => {

        })
    }

    updateUser(){
        app.patch('/users/:id', () => {

        })
    }

    readSingleUser(){
        app.get('/users/:id', (req,res) => {

        })
    }
}



app.listen(3000)
