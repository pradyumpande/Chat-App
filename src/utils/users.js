let users = [

{
    
}

]



const addUser = (id,username,room )=>{
    //clean data
         
        //validate the data
        if(!username || !room){
                return {
                    error: 'Username and room required'
                }
        }
       
        //Check for existing user
        const existingUser = users.find((user)=>{
            return user.room == room && user.username == username
        })
        if(existingUser){
            return{
                error:'Username is in use!'
            }
        }

       var user = {id,username,room}
        users.push(user);
        return {user}
    }
    
    

const removeUser =(id)=>{
        const index = users.findIndex((users)=>{
                return users.id === id
        })
        if(index !== -1){
            return users.splice(index,1)[0]
        }
}

const getUser =(id)=>{ 
    //    users.find((user)=>{
    //      if(user.id == id){

    //         return user.id

    //      }
    // })
  return users.find((user) => user.id === id)
   
}

const getUsersInRoom = (room)=>{
   
    const allUser = users.filter((user)=>{
                return user.room == room
    })
    return allUser
}



module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}