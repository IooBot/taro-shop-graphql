import {findMany} from "../src/utils/crud";

getSlideShow = () => {
  findMany({collection:"slideshow",fields:["id","img"]}).then((res)=>{
    // console.log("getSlideShow res",res)
    let swiperList = []
    res.forEach((item,index)=>{
      swiperList.push(item.img)
      if(index === res.length -1){
        this.setState({
          swiperList
        })
      }
    })
  })
}

getGoodsInfo = () => {
  const categoryFilter = {
    "status": "1",
    "limit": 7,
    // "sort_by": {"order": "asc"}
  }

  let category = findMany({collection: "category",condition:categoryFilter,fields:["id", "value:name", "image:img", "status"]})
  let recommend = findMany({collection:"product",condition: {status: '1', recommend: 1},fields:["name", "id", "intro", "price", "img", "stock", "discountRate", "status"]})

  Promise.all([category, recommend]).then((res)=>{
    // console.log('getGoodsInfo data',res)
    this.setState({
      loaded:true,
      category: res[0],
      recommend: res[1]
    })
  })

  // QL.find([["category",categoryFilter, ["id", "value:name", "image:img", "status"]],
  //          ["product",{status: '1', recommend: 1}, ["name", "id", "intro", "price", "img", "stock", "discountRate", "status"]]]).then(
  //            res=>{
  //                  console.log('fetch data',res);
  //                  this.setState({
  //                  loaded:true,
  //                  category: res[0],
  //                  recommend: res[1]
  //                  });
  //          }
  // )
}
