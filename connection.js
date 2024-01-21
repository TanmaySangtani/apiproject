const mysql = require("mysql2");

class connection {
  constructor(db, table) {
    this.con = mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "Tanvishar*05",
      database: db

    });
  }


  createUser() {

  }

  deleteUser(userId) {
    return new Promise((resolve, reject) => {
      const deleteQuery = 'DELETE FROM USERDETAILS WHERE id = ?';

      this.con.query(deleteQuery, [userId], async (error, results) => {

        if(error){
          reject(error)
          return;
        }
        
        const affectedRows = results.affectedRows;
        resolve(affectedRows);
      });
    });
  }

  listAllUsers() {
    console.log("i m here");
  }
  updateUser() {}
}


module.exports = connection;