import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import './index.scss'

export default class DetailImg extends Component {
  static defaultProps = {
    html: ''
  }

  render () {
    const { imgList } = this.props

    return (
      <View className='item-detail'>
        {imgList.map((item, index) => (
          <Image
            key={index}
            className='item-detail__img'
            src={item}
            mode='widthFix'
          />
        ))}
      </View>
    )
  }
}
