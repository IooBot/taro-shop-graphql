import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import CheckboxItem from '../../../components/checkbox'
import InputNumber from '../../../components/input-number'
import './index.scss'

export default class List extends Component {
  static defaultProps = {
    list: [],
    onUpdate: () => {},
    onUpdateCheck: () => {}
  }

  getBaseItem = (item) => ({
    skuId: item.skuId,
    type: item.type,
    extId: item.extId,
    cnt: item.cnt,
    checked: item.checked,
    canCheck: true,
    promId: this.props.promId,
    promType: this.props.promType
  })

  handleUpdate = (item, cnt) => {
    const payload = {
      skuList: [{ ...this.getBaseItem(item), cnt }]
    }
    this.props.onUpdate(payload)
  }

  handleUpdateCheck = (item) => {
    const payload = {
      skuList: [{ ...this.getBaseItem(item), checked: !item.checked }]
    }
    this.props.onUpdateCheck(payload)
  }

  handleRemove = () => {
    // XXX 暂未实现左滑删除
  }

  handleClick = (id) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    })
  }

  render () {
    const { list } = this.props
    console.log("List list",list)
    return (
      <View className='cart-list'>
        {list.map(item => (
          <View
            key={item.id}
            className='cart-list__item'
          >
            <CheckboxItem
              checked={item.checked}
              onClick={this.handleUpdateCheck.bind(this, item)}
            />
            <Image
              className='cart-list__item-img'
              src={item.product_id.img}
              onClick={this.handleClick.bind(this, item.product_id.id)}
            />
            <View className='cart-list__item-info'>
              <View onClick={this.handleClick.bind(this, item.product_id.id)}>
                <View className='cart-list__item-title'>
                  {/*{!!item.prefix &&*/}
                  <Text className='cart-list__item-title-tag'>新人专享价</Text>
                  {/*}*/}
                  <Text className='cart-list__item-title-name' numberOfLines={1}>
                    {item.product_id.name}
                  </Text>
                </View>

                <View className='cart-list__item-spec'>
                  <Text className='cart-list__item-spec-txt'>
                    {item.specificationStock_id.color}
                  </Text>
                </View>
              </View>

              <View className='cart-list__item-wrap'>
                <Text className='cart-list__item-price'>
                  ¥{item.product_id.price}
                </Text>
                <View className='cart-list__item-num' onClick={this.handleClick.bind(this, item.product_id.id)}>
                  <InputNumber
                    num={item.count}
                    onChange={this.handleUpdate.bind(this, item)}
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
