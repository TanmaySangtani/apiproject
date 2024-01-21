const mysql = require("mysql");

class connection {
  constructor(db, table) {
    this.con = mysql.createConnection({
      host: "localhost",
      user: "yourusername",
      password: "yourpassword",
    });

    con.connect(function (err) {
      if (err) throw err;
      console.log("Connected!");
    });
  }
  createUser() {}
  deleteUser(userId) {}

  listAllUsers() {
    console.log("i m here");
  }
  updateUser() {}
}
