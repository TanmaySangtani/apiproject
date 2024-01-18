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
                error.status=403;
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
        const index = this.userInfo.findIndex(user => user.id === userId);
 
        if (index !== -1) {
            this.userInfo.splice(index, 1);
        } 
    }

     listAllUsers(){
            return  this.userInfo
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

    readSingleUser(targetId){
        
         try{
            const finduser=this.userInfo.find(user=>{
                return user.id===targetId
            })  
            if(finduser){
                return finduser
            }
            else {
                const error=new Error("user is not found")
                error.status=404
                return error
            }
         }catch(error){
            throw error
         }
        

    }
}

module.exports = users