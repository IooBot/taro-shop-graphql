import {findMany} from "../src/utils/crud";
import Loading from "../src/components/loading";

findMany({collection:"product",condition:{category_id: this.categoryId},fields:["category_id.name", "name", "id", "intro", "price", "img", "stock", "discountRate", "status"]}).then((res)=>{
  // console.log("Kind res",res)
  this.setState({
    loaded:true,
    detailInfo:res,
  })
})

if (!this.state.loaded) {
  return <Loading />
}
