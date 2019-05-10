import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import moment from 'moment'
import {getWindowHeight} from "../../utils/style"
import {findMany, insert, remove} from "../../utils/crud"
import {idGen} from "../../utils/func"
import OrdersAddress from "./address"
import OrdersList from "./list"
import OrdersDelivery from "./delivery"
import OrdersFooter from "./footer"
import './index.scss'

class Orders extends Component {
  config = {
    navigationBarTitleText: '订单确认'
  }

  constructor(props) {
    super(props)
    this.state = {
      totalPrice: parseFloat(Taro.getStorageSync('totalPrice')),
      totalCount: parseInt(Taro.getStorageSync('totalCount')),
      delivery: ["快递配送"],
      selectAddress: {},
      ordersList:[],
      remark: '',
      dataType: this.$router.params.dataType
    }
  }

  componentWillMount() {
    let {dataType} = this.state
    let ordersList = Taro.getStorageSync(dataType)
    this.setState({
      ordersList
    })
  }

  componentDidMount() {
    this.getUserAddressData()
  }

  // 获取用户收货地址，缓存无则重新获取
  getUserAddressData = () => {
    let selectAddress = Taro.getStorageSync('ordersAddress')
    if(selectAddress){
      this.setState({
        selectAddress
      })
    }else {
      let user_id = 'ioobot'
      let fields = ["id", "default", "username", "telephone", "province", "area", "city", "address"]
      findMany({collection:"userAddress",condition:{user_id: user_id,default:1},fields}).then(res =>{
        // console.log('userAddressData',res)
        this.setState({
          selectAddress: res[0]
        })
        Taro.setStorage({ key: 'ordersAddress', data: res[0] })
      })
    }
  }

  changeOrdersState = (state,val) => {
    this.setState({
      [state]: val,
    })
  }

  onSubmitOrderAndProduct = () => {
    let user_id = 'ioobot'
    let ordersAddress = Taro.getStorageSync('ordersAddress')

    if(ordersAddress){
      let {totalCount, totalPrice, remark, delivery, dataType} = this.state
      let createdAt = moment().format('YYYY-MM-DD HH:mm:ss')
      let {id:userAddress_id, telephone, username, province, city, area, address} = ordersAddress
      let addressData = String(province + city + area + address)
      let tag = telephone ? telephone.replace(/[^0-9]/ig, "").slice(-4) : Math.random().toString(10).substr(2,4)
      const orderId = createdAt.replace(/[^0-9]/ig, "").substr(2) + tag
      let orderLogisticsId = idGen('deliver')

      const orderContent = {
        remark,
        updatedAt: "",
        orderLogistics_id: orderLogisticsId,
        orderTotalPay: totalPrice,
        createdAt,
        orderStatus: "0",
        userAddress_id,
        id:orderId,
        count: totalCount,
        user_id,
        productTotalPay: totalPrice,
        orderPay_id: ""
      }

      const orderLogistics = {
        updatedAt: "",
        deliveryTime: "",
        serviceStore: "",
        expressName:delivery[0],
        logisticsFee: 0.0,
        expressId: "",
        createdAt,
        order_id: orderId,
        consigneeTel: telephone,
        id:orderLogisticsId,
        consignAddress: addressData,
        LogisticsStatus: "0",
        user_id,
        consigneeName: username
      }

      let deleteIdList = []
      let shopping = Taro.getStorageSync(dataType)
      if(dataType === 'cartSelected') deleteIdList = shopping.map(item => item.id)

      console.log('createOrder orderContent',orderContent)

      let createOrder = insert({collection:'order',condition:orderContent})
      let createOrderLogistics = insert({collection:'orderLogistics',condition:orderLogistics})
      let deleteUserCart = remove({collection:"userCart",condition:{where:{id: {_in: deleteIdList}}}})

      let createOrderProduct = shopping.map((item,index) => {
        let createdAt1 = moment().format('YYYY-MM-DD HH:mm:ss')
        let orderProductId =  createdAt1.replace(/[^0-9]/ig, "").substr(2) + tag +index
        let {count, product_id:productData, specificationStock_id:specData} = item
        let {id:product_id, img, name, price, unit} = productData
        let {id:specId, color, size} = specData
        // console.log('product',index,item,product_id)

        const orderProduct = {
          updatedAt: "",
          productColor: color,
          unit,
          product_id,
          specificationStock_id:specId,
          productSize:size,
          orderPay: price,
          createdAt:createdAt1,
          productImg:img,
          productName: name,
          order_id: orderId,
          productPrice:price,
          id:orderProductId,
          user_id,
          count,
          productPay: price,
          orderPay_id: "",
        }
        console.log(`orderProduct${index}`,orderProduct)

        return insert({collection:'orderProduct',condition:orderProduct}).then((data)=>{
          console.log('ok data',index,data)
          return data.data
        })
      })

      Promise.all([createOrder, createOrderLogistics, deleteUserCart, createOrderProduct]).then(()=> {
        // console.log('onSubmitOrderAndProduct data',data)
        Taro.setStorageSync('payOrder',orderContent)
        if(dataType === 'cartSelected'){
          let cartCount = parseInt(Taro.getStorageSync('cartCount')) - totalCount
          Taro.setStorageSync('cartCount',cartCount)
          Taro.removeStorageSync('cartList')
        }
        Taro.navigateTo({
          url: `/pages/pay/index`
        })
      }).catch((err)=>{
        console.log('submit order error',err)
      })
    }else {
      Taro.showToast({
        title:'请先添加收货地址',
        icon: 'none'
      })
    }
  }

  render() {
    let {dataType, selectAddress, totalPrice, ordersList} = this.state

    return (
      <View className='orders'>
        <ScrollView
          scrollY
          className='orders__wrap'
          style={{ height: getWindowHeight() }}
        >
          <View className='orders-content-wrap content-wrap'>
            <OrdersAddress
              dataType={dataType}
              selectAddress={selectAddress}
            />
            <OrdersList ordersList={ordersList} />
            <OrdersDelivery onChangeOrdersState={this.changeOrdersState} />
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
          <OrdersFooter
            totalPrice={totalPrice}
            onSubmitOrderAndProduct={this.onSubmitOrderAndProduct}
          />
        </View>
      </View>
    )
  }
}

export default Orders