const mysql = require("mysql2");

class connection {
  constructor(db, password) {
    this.password = password;
    this.con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: password,
      database: db,
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

  deleteUser(userId) {
    return new Promise((resolve, reject) => {
      const deleteQuery = "DELETE FROM USERDETAILS WHERE id = ?";

      this.con.query(deleteQuery, [userId], async (error, results) => {
        if (error) {
          reject(error);
          return;
        }

        const affectedRows = results.affectedRows;
        resolve(affectedRows);
      });
    });
  }

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
