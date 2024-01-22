const crypto = require("crypto");

class users {
  constructor(userInfo, curr) {
    (this.userInfo = userInfo), (this.currId = curr);
  }

  // verify the details and add it to the users and save it in data.json file
  createUser(userDetails) {
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
      if (match[0].length !== 10) {
        const error = new Error("Invalid Mobile Number");
        error.status = 400;
        throw error;
      }

      if (
        this.userInfo.filter((data) => {
          return data.mobile === mobile;
        }).length
      ) {
        const error = new Error("User Already Exists");
        error.status = 403;
        throw error;
      }

      const hash = crypto.createHash("sha256");
      hash.update(password);
      const hashedPassword = hash.digest("hex");

      this.userInfo.push({
        id: this.currId,
        name,
        mobile,
        password: hashedPassword,
        email,
      });
      this.currId += 1;
      return this.userInfo;
    } catch (err) {
      throw err;
    }
  }

  deleteUser(userId) {}

  listAllUsers() {
    return this.userInfo;
  }

  updatecreate() {}

  readSingleUser(targetId) {
    try {
      const finduser = this.userInfo.find((user) => {
        return user.id === targetId;
      });
      if (finduser) {
        return finduser;
      } else {
        const error = new Error("user is not found");
        error.status = 404;
        return error;
      }
    } catch (error) {
      throw error;
    }
  }
}

module.exports = users;
