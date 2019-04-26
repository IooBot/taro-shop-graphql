import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import Tag from '../tag'
import './index.scss'

export default class ItemList extends Component {
  static defaultProps = {
    list: []
  }

  handleClick = id => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    });
  };

  render () {
    const { list } = this.props

    return (
      <View className='comp-item-list'>
        <View className='comp-item-list__title'>
          {this.props.children}
        </View>
        <View className='comp-item-list__wrap'>
          {list.map(item => {
            const { id, name, price, discountRate, img, limitedTag = "" } = item;
            let activityPrice = (price * discountRate / 100).toFixed(2);
            return (
              <View
                key={id}
                className='comp-item-list__item'
                onClick={this.handleClick.bind(this, id)}
              >
                <Image className='comp-item-list__item-img' src={img} />
                <View className='comp-item-list__item-info'>
                  {!!limitedTag &&
                  <Tag text={limitedTag} />
                  }
                  <Text className='comp-item-list__item-name' numberOfLines={1}>
                    {name}
                  </Text>

                  <View className='comp-item-list__item-price-wrap'>
                    <Text className='comp-item-list__item-price'>
                      ¥{activityPrice || price}
                    </Text>
                    {!!activityPrice &&
                    <Text className='comp-item-list__item-price--origin'>
                      ¥{price}
                    </Text>
                    }
                  </View>
                </View>
              </View>
            )}
          )}
        </View>
      </View>
    )
  }
}
