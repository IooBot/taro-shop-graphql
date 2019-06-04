import {getGlobalData} from "../src/utils/global_data";
import {findMany} from "../src/utils/crud";

getAddressData = () => {
  let user_id = getGlobalData("user_id")
  let fields = ["address", "telephone", "default", "city", "username", "id", "area", "province"]
  findMany({collection:"userAddress",condition:{user_id: user_id},fields}).then(res =>{
    // console.log('address userAddressData',res)
    this.setState({
      loaded: true,
      shoppingAddress: res
    });
  })
}
