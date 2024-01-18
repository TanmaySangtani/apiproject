const fs = require('fs')


class users {
    constructor(userInfo,curr){
        this.userInfo = userInfo,
        this.currId = curr
    }

    // verify the details and add it to the users and save it in data.json file
    createUser(userDetails){

    }

    deleteUser(userId){
        
        const index = this.userInfo.findIndex(user => user.id === userId);
 
        if (index !== -1) {
            this.userInfo.splice(index, 1);
        } 

    }

    listAllUsers(){

    }

    updateUser(userId){
 
    }

    readSingleUser(userId){
        
    }
}

module.exports = users