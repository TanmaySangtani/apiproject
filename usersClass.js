var fs = require('fs');




class users {
    constructor(userInfo,curr){
        this.userInfo = userInfo,
        this.currId = curr
    }

    // verify the details and add it to the users and save it in data.json file
    createUser(userDetails){

    }

    deleteUser(userId){
        this.userInfo=(this.userInfo).filter((curr)=>{
            return curr.Id!=userId;
        })

        return ;

    }

    listAllUsers(){

    }

    updateUser(userId){
 
    }

    readSingleUser(userId){
        
    }
}

var temp=new users();
temp.deleteUser(123);

module.exports = users