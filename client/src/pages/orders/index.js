import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import { AtToast } from "taro-ui"
import moment from 'moment'
import {connect} from "@tarojs/redux";
import {getWindowHeight} from "../../utils/style"
// import {findMany, insert, remove} from "../../utils/crud"
import {idGen} from "../../utils/func"
// import {getGlobalData, setGlobalData} from "../../utils/global_data"
import OrdersAddress from "./address"
import OrdersList from "./list"
import OrdersDelivery from "./delivery"
import OrdersFooter from "./footer"
import './index.scss'


@connect(({ userAddressList, orderMutate, orderProductMutate, orderLogisticMutate, userCartMutate, common, loading }) => ({
  orderCreateResult: orderMutate.createResult,
  orderProductCreateResult: orderProductMutate.createResult,
  orderLogisticCreateResult: orderLogisticMutate.createResult,
  userCartDeleteResult: userCartMutate.deleteResult,
  user_id: common.user_id,
  userAddressList,
  ...loading,
}))
class Orders extends Component {
  config = {
    navigationBarTitleText: '订单确认'
  };

  constructor(props) {
    super(props)
    this.state = {
      totalPrice: parseFloat(Taro.getStorageSync('totalPrice')),
      totalCount: parseInt(Taro.getStorageSync('totalCount')),
      delivery: ["快递配送"],
      // selectAddress: {},
      orderContent:{},
      ordersList:[],
      remark: '',
      dataType: this.$router.params.dataType,
      createOrderStatus: false
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
    // this.getUserAddressData()
    const { user_id, dispatch } = this.props;
    dispatch({
      type: 'userAddressList/fetchCurrent',
      payload:{user_id},
    });
  }

  changeOrdersState = (state,val) => {
    this.setState({
      [state]: val,
    })
  };

  onSubmitOrderAndProduct = () => {
    this.changeOrdersState('createOrderStatus', true)
    const { user_id, dispatch } = this.props;
    let ordersAddress = Taro.getStorageSync('ordersAddress')
    // console.log("onSubmitOrderAndProduct ordersAddress",ordersAddress)

    if(ordersAddress){
      let {totalCount, totalPrice, remark, delivery, dataType} = this.state;
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
      };

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
      };
      this.setState({orderContent});
      let deleteIdList = [];
      let shopping = Taro.getStorageSync(dataType)
      if(dataType === 'cartSelected') deleteIdList = shopping.map(item => item.id);

      // console.log('createOrder orderContent',orderContent)
      dispatch({
        type: 'orderMutate/create',
        payload: orderContent,
      });
      dispatch({
        type: 'orderLogisticsMutate/create',
        payload: orderLogistics,
      });
      dispatch({
        type: 'userCartMutate/delete',
        payload: {where:{id: {_in: deleteIdList}}},
      });

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
        };
        // console.log(`orderProduct${index}`,orderProduct)
        dispatch({
          type: 'orderProductMutate/create',
          payload: orderProduct,
        });
      });
    }else {
      Taro.showToast({
        title:'请先添加收货地址',
        icon: 'none'
      })
    }
  };

  onCreateOrderSucess = () => {
    let { totalCount, dataType, orderContent } = this.state;
    if(dataType === 'cartSelected'){
      let cartCount = parseInt(Taro.getStorageSync('cartCount')) - totalCount;
      Taro.setStorageSync('cartCount',cartCount);
      Taro.removeStorageSync('cartList')
    }

    // setGlobalData('payOrder',orderContent);
    const { dispatch } = this.props;
    dispatch({
      type: 'common/save',
      payload: {orderContent}});

    this.changeOrdersState('createOrderStatus', false)
    Taro.navigateTo({
      url: `/pages/pay/index`
    });
  };

  onCreateOrderFailed = (err) => {
    this.changeOrdersState('createOrderStatus', false);
    console.log('submit order error',err);
    Taro.showToast({
      title:'订单创建失败，请稍后重试',
      icon: 'none'
    })
  };

  render() {
    let {dataType,  totalPrice, ordersList, createOrderStatus} = this.state;
    const { userAddressList, orderCreateResult, orderProductCreateResult,
      orderLogisticCreateResult, userCartDeleteResult, dispatch } = this.props;
    let selectAddress = userAddressList.currentUseraddress;
    if(orderCreateResult){
      if(orderCreateResult.result =='ok'){
        this.onCreateOrderSucess();
      }else{
        this.onCreateOrderFailed(orderCreateResult.result);
      }
      dispatch({
        type: 'orderMutate/saveCreateResult',
        payload: ''
      });
    }
    if(orderProductCreateResult){
      console.log('orderProduct create:',orderProductCreateResult.result);
      dispatch({
        type: 'orderProductMutate/saveCreateResult',
        payload: ''
      });
    }
    if(orderLogisticCreateResult){
      console.log('orderLogisticCreate:',orderLogisticCreateResult.result);
      dispatch({
        type: 'orderLogisticMutate/saveCreateResult',
        payload: ''
      });
    }
    if(userCartDeleteResult){
      console.log('userCart remove:',userCartDeleteResult);
      dispatch({
        type: 'userCartMutate/saveDeleteResult',
        payload: ''
      });
    }
    return (
      <View className='orders'>
        {
          createOrderStatus ?
            <AtToast isOpened text='创建订单中...' status='loading' />:''
        }
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
            createOrderStatus={createOrderStatus}
            onSubmitOrderAndProduct={this.onSubmitOrderAndProduct}
          />
        </View>
      </View>
    )
  }
}

export default Orders
