
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const usersClass = require('./usersClass')
// const data = require('./data.json');

// const usersList = data.userInfo || new usersClass([],process.env.currId);
const usersList = new usersClass([],Number(process.env.currId));

app.get('/getallusers', (req,res) => {
    
    res.status(200).json (usersList.listAllUsers())
    
})

app.get('/user/:id', (req,res) => {
    const userId = parseInt(req.params.id);
    console.log(userId)
    res.status(200).json(usersList.readSingleUser(userId));
})

app.post('/users', (req,res, next) => {
    const userDetails = req.body;
    try{

        const data = usersList.createUser(userDetails);
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
