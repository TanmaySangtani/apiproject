const crypto = require('crypto');

class users {
    constructor(userInfo,curr){
        this.userInfo = userInfo,
        this.currId = curr
    }

    // verify the details and add it to the users and save it in data.json file
    createUser(userDetails){

    }

    deleteUser(userId){

    }

    listAllUsers(){

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

    readSingleUser(userId){
        
    }
}

module.exports = users