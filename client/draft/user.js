import {findOne} from "../src/utils/crud";

userInfo = (user_id) => {
  let userData = findOne({collection:"user",condition:{id: user_id},fields:["id", "email", "telephone", "username", "openid"]});//,fields:[]
  userData.then(res =>{
    // console.log('user data',res)
    this.setState({
      loaded:true,
    });
  })
}
