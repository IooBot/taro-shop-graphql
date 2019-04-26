import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import defaultAvatar from '../../../assets/default-avatar.png'
import Tag from '../../../components/tag'
import './index.scss'

export default class Recommend extends Component {
  static defaultProps = {
    list: []
  }

  handleClick = (id) => {
    Taro.navigateTo({
      url: `/pages/detail/index?id=${id}`
    })
  }

  render () {
    const { list } = this.props
    return (
      <View className='home-recommend'>
        <View className='home-recommend__title'>
          <Text className='home-recommend__title-txt'>-为你推荐-</Text>
        </View>
        <View className='home-recommend__list'>
          {list.filter(item => item.status === "1").map((item) => {
            const { id, name, intro, price, discountRate, img, limitedTag="", simpleDescClose=false, comments=[]} = item
            let activityPrice = (price * discountRate / 100).toFixed(2)
            return (
              <View
                key={id}
                className='home-recommend__list-item'
                onClick={this.handleClick.bind(this, id)}
              >
                <Image className='home-recommend__list-item-img' src={img} />
                {!!intro && !simpleDescClose &&
                  <Text className='home-recommend__list-item-desc' numberOfLines={1}>
                    {intro}
                  </Text>
                }
                <View className='home-recommend__list-item-info'>
                  {!!limitedTag &&
                    <Tag text={limitedTag} />
                  }

                  <Text className='home-recommend__list-item-name' numberOfLines={1}>
                    {name}
                  </Text>

                  <View className='home-recommend__list-item-price-wrap'>
                    <Text className='home-recommend__list-item-price'>
                      ¥{activityPrice || price}
                    </Text>
                    {!!activityPrice &&
                      <Text className='home-recommend__list-item-price--origin'>
                        ¥{price}
                      </Text>
                    }
                  </View>

                  {!!(comments && comments[0] && comments[0].content) &&
                  <View className='home-recommend__list-item-commend'>
                    <Image
                      className='home-recommend__list-item-commend-img'
                      src={comments[0].frontUserAvatar || defaultAvatar}
                    />
                    <Text className='home-recommend__list-item-commend-txt' numberOfLines={2}>
                      {comments[0].content}
                    </Text>
                  </View>
                  }
                </View>
              </View>
            )
          })}
        </View>
      </View>
    )
  }
}
