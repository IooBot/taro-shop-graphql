import {findMany, findOne} from "../src/utils/crud";

let detail = findOne({collection:"product",condition:{id: productId},fields:["name", "id", "intro", "price", "img", "stock", "discountRate", "status"]})
let detailSpec = findMany({collection:"specificationStock",condition:{product_id: productId},fields:["id", "color", "size", "slideImg", "detailImg", "stock", "status"]})

Promise.all([detail, detailSpec]).then((res)=>{
  // console.log('detail spec data',res)
  this.setState({
    loaded:true,
    detailInfo: res[0],
    detailSpec: res[1]
  });
})
