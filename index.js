const express = require("express");
const app = express();
const connection = require("./connection");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authorizeMiddleware = require("./middleware/authmiddleware");
const errorMiddleware = require("./middleware/errormiddleware");
const myConnection = new connection("users", process.env.password);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

function isNumber(str) {
  let regex = /\D/;
  return !regex.test(str);
}
function isMobileNumber(str) {
  return isNumber(str) && str.length === 10;
}

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
    next(error);
  }
});

app.post("/createusers", async (req, res, next) => {
  const userDetails = req.body;
  try {
    const { name, mobile, password, email } = userDetails;
    if (!name || !mobile) {
      const error = new Error("Name or Mobile not provided");
      error.status = 400;
      throw error;
    }

    if (!isMobileNumber(mobile)) {
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

    res.status(200).json({ message: "done " });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.patch("/users/:id", authorizeMiddleware, async (req, res, next) => {
  let updatedDetails = req.body;

  try {
    //Validation of id
    if (!isNumber(req.params.id)) {
      const error = new Error("id is not a number");
      error.status = 400;
      throw error;
    }

    updatedDetails.id = parseInt(req.params.id);

    let areAllFieldsEmpty = true;

    if (updatedDetails.name) {
      areAllFieldsEmpty = false;
    }

    if (updatedDetails.email) {
      areAllFieldsEmpty = false;
    }

    if (updatedDetails.password) {
      areAllFieldsEmpty = false;

      //password hashing
      const hash = crypto.createHash("sha256");
      hash.update(updatedDetails.password);
      const hashedPassword = hash.digest("hex");
      updatedDetails.password = hashedPassword;
    }

    if (updatedDetails.mobile) {
      areAllFieldsEmpty = false;

      //Validation of mobile number
      if (!isMobileNumber(updatedDetails.mobile)) {
        const error = new Error(
          "mobile number should consist of 10 digits only"
        );
        error.status = 400;
        throw error;
      }
    }

    if (areAllFieldsEmpty) {
      const error = new Error("All fields cannot be blank");
      error.status = 400;
      throw error;
    }

    //updating the data in db
    await myConnection.updateUser(updatedDetails);

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    next(err);
  }
});

app.delete("/deleteusers/:id", authorizeMiddleware, async (req, res, next) => {
  const userId = parseInt(req.params.id);

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
    res.status(500).json({ message: "some error occured" });
  }
});

app.get("/auth", (req, res) => {
  res.status(200).json({ message: "Protedcted route accessed" });
});

app.use(errorMiddleware);
app.listen(3000, () => {
  console.log("server is running");
});
