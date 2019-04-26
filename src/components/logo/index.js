import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class Logo extends Component {
    render() {
        return (
            <View className='logo_wrap'>
                <Text className='logo_wrap-txt'>IooBot 提供技术支持</Text>
            </View>
        )
    }
}