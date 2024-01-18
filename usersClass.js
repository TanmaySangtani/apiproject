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

            const foundUser = this.userInfo.find(obj => obj.id === userDetails.id)

            if (foundUser) {
                
                if (userDetails.mobile.length !== 0) {
                    
                    //mobile validation
                    function isItAValidNumber(number) {
                        //if the length of string is not 10 or it has characters other than digits then return true
                        let regex = /\D/
                        return (!regex.test(number) && number.length === 10)
                    }
                    if (!isItAValidNumber(userDetails.mobile)) {
                        const error = new Error('mobile number should consist of 10 digits only')
                        error.status = 400
                        throw error
                    }

                    //checking if the mobile number already exists
                    const foundMobile = this.userInfo.find(obj=> obj.mobile === userDetails.mobile)
                    if (foundMobile) {
                        const error = new Error('mobile number already exists')
                        error.status = 400
                        throw error                    
                    }

                    //updating the number
                    foundUser.mobile=userDetails.mobile
                }
                if (userDetails.name.length !== 0) {
                    //updating the name
                    foundUser.name=userDetails.name
                } 
                if (userDetails.email.length !== 0) {
                    //updating the email
                    foundUser.email=userDetails.email
                } 
                if (userDetails.password.length !== 0) {
                    //password hashing
                    const hash = crypto.createHash('sha256')
                    hash.update(userDetails.password)
                    const hashedPassword = hash.digest('hex')

                    //updating the password
                    foundUser.password=(hashedPassword)
                }   
                
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