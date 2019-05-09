import Taro, { Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import './index.scss';

class Order extends Component {
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

  config = {
    navigationBarTitleText: '我的订单',
  };

  componentWillMount = () => {
    this.setState({
      activeTypeIndex: this.$router.params.type,
    });
  };

  toggleActiveType = e => {
    this.setState({
      activeTypeIndex: e.currentTarget.dataset.type,
    });
  };

  render() {
    const { orderType, activeTypeIndex } = this.state;
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
        <View className='empty' />
      </View>
    );
  }
}

export default Order;
