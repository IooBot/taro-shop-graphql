import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
// import moment from 'moment'
// import {idGen} from "../../utils/func"
// import {getCookie} from "../../utils/cookie"
import './index.scss'
// import {findMany} from "../../utils/crud";
import OrdersAddress from "./address"
import OrdersFooter from "./footer"
import OrdersList from "./list"
import {getWindowHeight} from "../../utils/style"
import OrdersDelivery from "./delivery"

class Orders extends Component {
  config = {
    navigationBarTitleText: '订单确认'
  }

  constructor(props) {
    super(props)
    this.state = {
      totalPrice:  100,
    }
  }

  // componentDidMount() {
  //   let user_id = getCookie('user_id');
  //   let userAddressData = findMany({collection:"userAddress",condition:{user_id: user_id,default:1}});//,fields:[]
  //   userAddressData.then(res =>{
  //     console.log('userAddressData',res)
  //     this.setState({
  //       defaultAddress: res[0]
  //     });
  //   })
  // }

  onChangeDelivery = (val) => {
    this.setState({
      delivery: val,
    })
  }

  // onSubmitOrderAndProduct = (user_id,create_order,create_order_product) => {
  //   let ordersAddress = JSON.parse(Taro.getStorageSync('ordersAddress'))
  //
  //   if(ordersAddress){
  //     let {totalCount, totalPrice, remark, delivery} = this.state
  //     let createdAt = moment().format('YYYY-MM-DD HH:mm:ss')
  //     let {id:userAddress_id, telephone, username, province, city, area, address} = ordersAddress
  //     let addressData = String(province + city + area + address)
  //     let tag = telephone ? telephone.replace(/[^0-9]/ig, "").slice(-4) : Math.random().toString(10).substr(2,4)
  //     const orderId = createdAt.replace(/[^0-9]/ig, "").substr(2) + tag
  //     let orderLogisticsId = idGen('deliver')
  //
  //     const orderContent = {
  //       remark,
  //       updatedAt: "",
  //       orderLogistics_id: orderLogisticsId,
  //       orderTotalPay: totalPrice,
  //       createdAt,
  //       orderStatus: "0",
  //       userAddress_id,
  //       id:orderId,
  //       count: totalCount,
  //       user_id,
  //       productTotalPay: totalPrice,
  //       orderPay_id: "",
  //       deleteId:[]
  //     }
  //
  //     const orderLogistics = {
  //       updatedAt: "",
  //       deliveryTime: "",
  //       serviceStore: "",
  //       expressName:delivery[0],
  //       logisticsFee: 0.0,
  //       expressId: "",
  //       createdAt,
  //       order_id: orderId,
  //       consigneeTel: telephone,
  //       orderLogisticsId,
  //       consignAddress: addressData,
  //       LogisticsStatus: "0",
  //       user_id,
  //       consigneeName: username
  //     }
  //
  //     let type = this.props.history.location.state.dataType
  //     let shopping = JSON.parse(Taro.getStorageSync(type))
  //     if(type === 'cartSelected') orderContent.deleteId = shopping.map(item => item.id)
  //
  //     // console.log('createOrder orderContent',orderContent)
  //
  //     let createOrder = create_order({variables:{...orderContent, ...orderLogistics}})
  //
  //     let createOrderProduct = shopping.map((item,index) => {
  //       let createdAt1 = moment().format('YYYY-MM-DD HH:mm:ss')
  //       let orderProductId =  createdAt1.replace(/[^0-9]/ig, "").substr(2) + tag +index
  //       let {count, product_id:productData, specificationStock_id:specData} = item
  //       let {id:product_id, img, name, price, unit} = productData
  //       let {id:specId, color, size} = specData
  //       // console.log('product',index,item,product_id)
  //
  //       const orderProduct = {
  //         updatedAt: "",
  //         productColor: color,
  //         unit,
  //         product_id,
  //         specificationStock_id:specId,
  //         productSize:size,
  //         orderPay: price,
  //         createdAt:createdAt1,
  //         productImg:img,
  //         productName: name,
  //         order_id: orderId,
  //         productPrice:price,
  //         id:orderProductId,
  //         user_id,
  //         count,
  //         productPay: price,
  //         orderPay_id: "",
  //       }
  //       // console.log(`orderProduct${index}`,orderProduct)
  //
  //       return create_order_product({variables:orderProduct}).then((data)=>{
  //         // console.log('ok data',index,data)
  //         return data.data
  //       })
  //     })
  //
  //     Promise.all([createOrder, createOrderProduct]).then(()=> {
  //       // console.log('onSubmitOrderAndProduct data',data)
  //       sessionStorage.setItem('payOrder',JSON.stringify(orderContent))
  //       if(type === 'cartSelected'){
  //         let cartCount = JSON.parse(localStorage.getItem("cartCount")) - totalCount
  //         localStorage.setItem("cartCount",JSON.stringify(cartCount))
  //         localStorage.removeItem("cartList")
  //       }
  //
  //       this.props.history.push({
  //         pathname:'/cart/pay',
  //         state:{}
  //       })
  //     }).catch((err)=>{
  //       console.log('submit error',err)
  //     })
  //   }else {
  //     console.log('请添加收货地址')
  //   }
  //
  // }

  render() {
    let {totalPrice} = this.state

    return (
      <View className='orders'>
        <ScrollView
          scrollY
          className='orders__wrap'
          style={{ height: getWindowHeight() }}
        >
          <View className='orders-content-wrap content-wrap'>
            <OrdersAddress />
            <OrdersList />
            <OrdersDelivery />
            <View className='orders__price'>
              <View className='orders__price-wrap'>
                <Text className='orders__price-name'>商品金额</Text>
                <Text className='orders__price-item'>¥ {totalPrice}</Text>
              </View>
              <View className='orders__price-wrap'>
                <Text className='orders__price-name'>运费</Text>
                <Text className='orders__price-item'>¥ 0.00</Text>
              </View>
            </View>
          </View>
        </ScrollView>
        <View className='orders__footer'>
          <OrdersFooter />
        </View>
      </View>
    )
  }
}

export default Orders