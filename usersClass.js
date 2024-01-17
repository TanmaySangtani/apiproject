const crypto = require('crypto')
class users {
    constructor(userInfo, curr) {
        this.userInfo = userInfo,
            this.currId = curr
    }

    // verify the details and add it to the users and save it in data.json file
    createUser(userDetails) {
        try {
            const { name, mobile, password, email } = userDetails;
            if (!name || !mobile){

                const error = new Error('Name or Mobile not provided');
                error.status = 400;
                throw error;
            }
            if (mobile.length !== 10) {

                const error = new Error('Invalid Mobile Number');
                error.status = 400;
                throw error;
            }
            const reg = /\d+/g;
            const match = mobile.match(reg);
            console.log(match);
            if (match[0].length !== 10) {

                const error = new Error('Invalid Mobile Number');
                error.status = 400;
                throw error;
            }

            const hash = crypto.createHash('sha256');
            hash.update(password);
            const hashedPassword = hash.digest('hex');

            this.userInfo.push(
                {
                    id: this.currId,
                    name,
                    mobile, 
                    password: hashedPassword,
                    email,
                }
            );
            this.currId += 1;
            return this.userInfo;

        }
        catch (err) {
            
            throw err;
        }
    }

    deleteUser(userId) {

    }

    listAllUsers() {

    }

    updateUser(userId) {

    }

    readSingleUser(userId) {

    }
}

module.exports = users