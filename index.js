const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authorizeMiddleware = require("./middleware/authmiddleware");
const errorMiddleware = require("./middleware/errormiddleware");
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(errorMiddleware)

//const usersClass = require("./usersClass");
const connection = require("./connection");
// const data = require('./data.json');

// const usersList = data.userInfo || new usersClass([],process.env.currId);

//const usersList = new usersClass([], parseInt(process.env.currId));
const myConnection = new connection("users", process.env.password);

app.get("/users", async (req, res, next) => {
  try {
    const data = await myConnection.listAllUsers();
    if (data) {
      res.status(200).json(data);
    } else {
      const err = new error("No user Found");
      err.status = 404;
      throw err;
    }
  } catch (error) {
    next(error);
  }
});

app.get("/user/:id", async (req, res, next) => {
  try {
    const userId = parseInt(req.params.id);
    const response = await myConnection.readSingleUser(userId);
    if (response) {
      res.status(200).json(response);
    } else {
      const err = new Error("User is not found");
      err.status = 404;
      throw err;
    }
  } catch (error) {
    console.log("i am here");
    next(error);
  }
});

app.post("/users", (req, res, next) => {
  const userDetails = req.body;
  try {
    const data = usersList.createUser(userDetails);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
});

app.patch("/users/:id", (req, res, next) => {
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

app.delete("/users/:id", authorizeMiddleware, (req, res) => {
  try {
    const userId = req.params.id;
    res.status(200).json(usersList.deleteUser(userId));
  } catch (erro) {
    next(error);
  }
});

app.post("/auth/login", async (req, res) => {
  const secretkey = "abc";

  try {
    const { mobile, password } = req.body;
    const hash = crypto.createHash("sha256");
    hash.update(password);
    const hashedPassword = hash.digest("hex");
    const rows = await myConnection.authrizeuser(password, mobile);
    if (rows) {
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
app.get("/auth", authorizeMiddleware, (req, res) => {
  res.status(200).json({ message: "Protedcted route accessed" });
});

app.use(errorMiddleware);
const curr = process.env.id;

app.listen(3000);
