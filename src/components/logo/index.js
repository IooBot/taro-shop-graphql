import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.scss'

export default class Logo extends Component {
    render() {
        return (
            <View className='footer-logo'>
                <Text>IooBot 提供技术支持</Text>
            </View>
        )
    }
}