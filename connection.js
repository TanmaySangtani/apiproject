const mysql = require("mysql");
const util = require("util");

class connection {
  constructor(db, table) {
    this.db = "users";
    this.table = "userDetails";
    this.con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "password",
      database: db,
    });

    this.con.connect(function (err) {
      if (err) throw err;
      console.log("Connected!");
    });
  }
  async createUser(data) {
    const findUser = `select mobile from ${this.table} where mobile=${data.mobile}`;
    const insert = `insert into ${this.table}  values (NULL,?,?,?,? )`;

    const queryAsync = util.promisify(this.con.query).bind(this.con);

    try {
      const result = await queryAsync(findUser, []);
      if (result.length !== 0) {
        const error = new Error("User already exists");
        error.status = 401;
        throw error;
      }

      const val = [data.name, data.email, data.password, data.mobile];
      await queryAsync(insert, val);
    } catch (err) {
      throw err;
    }
  }

  async authenticate(data) {
    const findUser = `seletc mobile from ${this.table} where mobile=${data.mobile} and password = ${data.password}`;
    const queryAsync = util.promisify(this.con.query).bind(this.con);

    try {
      const result = await queryAsync(findUser, []);
      return result;
    } catch (err) {
      throw err;
    }
  }

  deleteUser(userId) {}

  listAllUsers() {
    console.log("i m here");
  }
  updateUser() {}
}

module.exports = connection;