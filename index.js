const express = require('express')
const app = express()

const Connection = require('./connection');  
const myConnection = new Connection("users", "userDetails");  

myConnection.con.connect(function (err) {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }else{
    app.listen(3000)
    console.log('Database connection established')
    console.log('Server is running on port 3000')
    
  }
});


const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authorizeMiddleware = require("./middleware/authmiddleware");
const errorMiddleware = require("./middleware/errormiddleware");

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const usersClass = require("./usersClass");
const usersList = new usersClass([], 1);

app.get("/getallusers", (req, res, next) => {
  try {
    res.status(200).json(usersList.listAllUsers());
  } catch (error) {
    next(error);
  }
});

app.get("/user/:id", (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    console.log(userId);
    const response = usersList.readSingleUser(userId);
    res.status(200).json(response);
  } catch (error) {
    console.log("i am here");
    next(error);
  }
});

app.post("/users",(req, res, next) => {
  const userDetails = req.body;
  try {
    const data = usersList.createUser(userDetails);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

app.patch("/users/:id", authorizeMiddleware, (req, res, next) => {
  const updatedDetails = req.body;

  try {
    if (parseInt(req.params.id)) {
      updatedDetails.id = parseInt(req.params.id);
    } else {
      const error = new Error("id is not a number");
      error.status = 400;
      throw error;
    }

    usersList.updateUser(updatedDetails);

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    // res.status(err.status).json({message: err.message})
    next(err);
  }
});

app.delete("/users/:id", async (req, res, next) => {
  const userId = Number(req.params.id);

  if (isNaN(userId)) {
    const error = new Error("Invalid id");
    error.status = 400;
    next(error)
  }

  try {
    const affectedRows = await myConnection.deleteUser(userId);

    if (affectedRows === 0){
      const error = new Error("No record with given id");
      error.status = 404;
      throw error;
    }
      
    else
      res.status(200).send('Deleted successfully.');

  } catch (error) {
    next(error)
  }
});



app.post("/auth/login", (req, res) => {
  const secretkey = "abc";

  try {
    const { mobile, password } = req.body;
    const hash = crypto.createHash("sha256");
    hash.update(password);
    const hashedPassword = hash.digest("hex");
    const user = usersList.userInfo.find((user) => {
      return user.password === hashedPassword && user.mobile === mobile;
    });
    if (user) {
      const token = jwt.sign({ mobile, password }, "abc", {
        expiresIn: "1h",
      });
      res.status(200).json({ token });
    } else {
      const error = new Error("Invalid user authtication failed");
      error.status = 404;
      throw error;
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "some error occured" });
  }
});
app.get("/auth", (req, res) => {
  res.status(200).json({ message: "Protedcted route accessed" });
});

app.use(errorMiddleware);
