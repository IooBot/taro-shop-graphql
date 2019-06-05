import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import {connect} from "@tarojs/redux";
import OrderList from "./list"
import './index.scss'
// import {getGlobalData} from "../../utils/global_data"
import {getWindowHeight} from "../../utils/style"

@connect(({ common }) => ({
  user_id: common.user_id
}))
class Order extends Component {
  config = {
    navigationBarTitleText: '我的订单',
  }

  constructor(props) {
    super(props);
    this.state = {
      orderType: [
        {
          type: 0,
          name: '待付款',
        },
        {
          type: 1,
          name: '待发货',
        },
        {
          type: 2,
          name: '待收货',
        },
        {
          type: 3,
          name: '待评价',
        }
      ],
      activeTypeIndex: 0,
    };
  }

  componentWillMount() {
    // console.log("Order this.$router.params.type",this.$router.params.type)
    this.setState({
      activeTypeIndex: this.$router.params.type,
    })
  }

  toggleActiveType = e => {
    // console.log("toggleActiveType e",e)
    this.setState({
      activeTypeIndex: e.currentTarget.dataset.type,
    })
  }

  render() {
    const { orderType, activeTypeIndex } = this.state
    const { user_id } = this.props; // getGlobalData("user_id")

    return (
      <View className='order-page'>
        <View className='toggleType'>
          {orderType.map((item, index) => (
            <View
              key={index}
              className={activeTypeIndex == index ? 'active item' : 'item'}
              data-type={item.type}
              onClick={this.toggleActiveType}
            >
              {item.name}
            </View>
          ))}
        </View>
        <ScrollView
          scrollY
          className='cart__wrap'
          style={{ height: getWindowHeight() }}
        >
          <OrderList typeIndex={activeTypeIndex} user_id={user_id} />
        </ScrollView>
      </View>
    )
  }
}

export default Order;
