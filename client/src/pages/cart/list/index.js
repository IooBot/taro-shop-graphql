import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import CheckboxItem from '../../../components/checkbox'
import InputNumber from '../../../components/input-number'
import './index.scss'

export default class List extends Component {
  static defaultProps = {
    list: [],
    onChangeCount: () => {},
    onChangeCheckedStatus: () => {}
  }

  // 选择数量
  changeCount = (index, count) => {
    this.props.onChangeCount(index, count)
  }

  handleUpdateCheck = (index) => {
    this.props.onChangeCheckedStatus(index)
  }

  handleClick = (id) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    })
  }

  render () {
    const { list } = this.props
    // console.log("List list",list)
    return (
      <View className='cart-list'>
        {list.map((item,index) => (
          <View
            key={item.id}
            className='cart-list__item'
          >
            <CheckboxItem
              checked={item.checked}
              onClick={this.handleUpdateCheck.bind(this, index)}
            />
            <Image
              className='cart-list__item-img'
              src={item.product_id.img}
              onClick={this.handleClick.bind(this, item.product_id.id)}
            />
            <View className='cart-list__item-info'>
              <View onClick={this.handleClick.bind(this, item.product_id.id)}>
                <View className='cart-list__item-title'>
                  <Text className='cart-list__item-title-tag'>新人专享价</Text>
                  <Text className='cart-list__item-title-name' numberOfLines={1}>
                    {item.product_id.name}
                  </Text>
                </View>

                <View className='cart-list__item-spec'>
                  <Text className='cart-list__item-spec-txt'>
                    {item.specificationStock_id.color}
                  </Text>
                  <Text className='cart-list__item-spec-txt'>
                    {item.specificationStock_id.size}
                  </Text>
                </View>
              </View>

              <View className='cart-list__item-wrap'>
                <View>
                  <Text className='cart-list__item-price'>
                    ￥{(item.product_id.price*item.product_id.discountRate/100).toFixed(2)}
                  </Text>
                  <Text className='cart-list__item-price-origin'>
                    ￥{(item.product_id.price).toFixed(2)}
                  </Text>
                </View>
                <View className='cart-list__item-num'>
                  <InputNumber
                    num={item.count}
                    onChange={this.changeCount.bind(this, index)}
                  />
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>
    )
  }
}
