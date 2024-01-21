const mysql = require("mysql2");

class connection {
  constructor(db, password) {
    this.password = password;
    this.con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: password,
      database: "users",
    });

    this.con.connect(function (err) {
      if (err) {
        console.log("eror");
        throw err;
      }
      console.log("Connected!");
    });
  }
  createUser(userDetail) {
    const { name, address, country } = req.bod;
  }
  deleteUser(userId) {}

  async listAllUsers() {
    const q = "select * from userDetails";
    const response = await this.con.promise().query(q);
    return response[0];
  }
  async readSingleUser(targetId) {
    const q = "select * from userdetails where id=?";
    const response = await this.con.promise().query(q, [targetId]);
    console.log(response);
    return response[0][0];
  }
  updateUser() {}

  async authrizeuser(password, mobile) {
    const q = "select * from userdetails where mobile=? and password=?";
    const response = await this.con.promise().query(q, [mobile, password]);
    return response[0][0];
  }
}

module.exports = connection;
