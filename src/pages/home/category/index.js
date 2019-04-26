import Taro, { Component } from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
// import { AtGrid } from "taro-ui"
import './index.scss'

export default class Category extends Component {
  static defaultProps = {
    data: {}
  }

  render () {
    const { list } = this.props
    const more = {
      image: 'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/icon/more.png',
      value: '更多',
      id: 'more'
    }
    let categoryList = list.concat(more)
    return (
      <View className='home-category'>
        <View className='home-category__list'>
          {categoryList.map((item, index) => (
            <View key={index} className='home-category__list-item'>
              <Image className='home-category__list-item-img' src={item.image} />
              <Text className='home-category__list-item-name'>{item.value}</Text>
            </View>
          ))}
        </View>
        {/*<AtGrid hasBorder={false} columnNum={4} data={categoryList} />*/}
      </View>
    )
  }
}
