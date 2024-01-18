
const express = require('express')
const app = express()
const bodyParser = require('body-parser');
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const usersClass = require('./usersClass')
const usersList = new usersClass([],parseInt(process.env.currId));

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
