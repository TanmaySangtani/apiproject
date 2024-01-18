
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
const errorMiddleware=require('./errormiddleware')
app.use(express.json());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(errorMiddleware)

const usersClass = require('./usersClass');
// const data = require('./data.json');

// const usersList = data.userInfo || new usersClass([],process.env.currId);


const usersList = new usersClass([],parseInt(process.env.currId));

app.get('/getallusers', (req,res, next) => {

    try{

        res.status(200).json (usersList.listAllUsers())
    }
    catch(error){
        next(error);
    }
    
    
})

app.get('/user/:id', (req,res, next) => {
    try{

        const userId = parseInt(req.params.id);
        console.log(userId)
        const response=usersList.readSingleUser(userId)
        res.status(200).json(response);
    }
    catch(error){
        console.log('i am here');
        next(error);
    }
});

app.post('/users', (req,res, next) => {
    const userDetails = req.body;
    try{

        const data = usersList.createUser(userDetails);
        res.status(200).json(data);
    }
    catch(err){
        
        next(err)
    }
    
})

app.patch('/users/:id', (req,res, next) => {
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
        // res.status(err.status).json({message: err.message})
        next(err)
    }
})

app.delete('/delete/:id' , (req,res, next) => {
    try{

        const userId = req.params.id;
        res.status(200).json(usersList.deleteUser(userId))
    }
    catch(error){
        next(error);
    }
})

app.use(errorMiddleware);
const curr = process.env.id;

app.listen(3000)
