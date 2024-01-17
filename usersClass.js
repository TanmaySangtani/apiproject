
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
            return res.send(userInfo)
    }

    updateUser(userId){
 
    }

    readSingleUser(targetId){
        const finduser=userInfo.find(user=>{
            user.id===targetid
        })  
        if(finduser)return res.send(finduser)
        else res.send({"message":"user not found"})
    }
}

module.exports = users