const express = require("express");
const app = express();
const connection = require("./connection");
const myConnection = new connection("users", process.env.password);

const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authorizeMiddleware = require("./middleware/authmiddleware");
const errorMiddleware = require("./middleware/errormiddleware");

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/users", authorizeMiddleware, async (req, res, next) => {
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

app.get("/user/:id", authorizeMiddleware, async (req, res, next) => {
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

app.post("/users", async (req, res, next) => {
  const userDetails = req.body;
  try {
    const { name, mobile, password, email } = userDetails;
    if (!name || !mobile) {
      const error = new Error("Name or Mobile not provided");
      error.status = 400;
      throw error;
    }
    if (mobile.length !== 10) {
      const error = new Error("Invalid Mobile Number");
      error.status = 400;
      throw error;
    }
    const reg = /\d+/g;
    const match = mobile.match(reg);
    console.log(match);
    if (match[0].length !== 10) {
      const error = new Error("Invalid Mobile Number");
      error.status = 400;
      throw error;
    }

    const hash = crypto.createHash("sha256");
    hash.update(password);
    const hashedPassword = hash.digest("hex");

    const data = await myConnection.createUser({
      id: this.currId,
      name,
      mobile,
      password: hashedPassword,
      email,
    });
    // console.log(usersList);
    res.status(200).json({ message: "done " });
  } catch (err) {
    res.status(400).json({ message: err.message });
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

app.delete("/users/:id", authorizeMiddleware, async (req, res, next) => {
  const userId = Number(req.params.id);

  if (isNaN(userId)) {
    const error = new Error("Invalid id");
    error.status = 400;
    next(error);
  }

  try {
    const affectedRows = await myConnection.deleteUser(userId);

    if (affectedRows === 0) {
      const error = new Error("No record with given id");
      error.status = 404;
      throw error;
    } else res.status(200).send("Deleted successfully.");
  } catch (error) {
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
app.get("/auth", (req, res) => {
  res.status(200).json({ message: "Protedcted route accessed" });
});

app.use(errorMiddleware);
