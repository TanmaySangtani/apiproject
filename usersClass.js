const crypto = require('crypto');

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

            if(this.userInfo.filter((data)=>{
                return data.mobile === mobile;
            }).length ){
                const error = new Error("User Already Exists");
                error.status(403);
                throw err;
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

    updateUser(userDetails){
        try {
            const foundUser = this.userInfo.find(obj=> obj.id === userDetails.id)

            if (foundUser) {
                //name
                if (userDetails.name === "") {
                    const error = new Error('Name is required')
                    error.status = 400
                    throw error
                }
                foundUser.name=userDetails.name

                //mobile
                if (userDetails.mobile.length === 10 && parseInt(userDetails.mobile)) {
                    //if the length of string is 10 and it consists of digits only then
                    foundUser.mobile=userDetails.mobile
                }
                else {
                    const error = new Error('mobile number should consist of 10 digits only')
                    error.status = 400
                    throw error
                }

                //email
                foundUser.email=userDetails.email

                //password
                const hash = crypto.createHash('sha256')
                hash.update(userDetails.password)
                const hashedPassword = hash.digest('hex')
                foundUser.password=(hashedPassword)
            } 
            else {
                const error = new Error(`No user found with value of id as ${userDetails.id}`)
                error.status = 404
                throw error
            }
        }
        catch (err) {
            throw err
        }
    }

    readSingleUser(userId) {

    }
}

module.exports = users