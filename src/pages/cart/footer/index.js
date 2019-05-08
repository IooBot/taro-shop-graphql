import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import classNames from 'classnames'
import CheckboxItem from '../../../components/checkbox'
import './index.scss'

export default class Footer extends Component {
  static defaultProps = {
  }

  changeSelectChecked = () => {
    this.props.onCheckedAll()
  }

  handleConfirm = () => {
    let {selectedCount} = this.props
    if(selectedCount){
      this.props.onSettleAccounts()
    }else {
      Taro.showToast({
        title: '请选择商品！',
        icon: 'none'
      })
    }
  }

  render () {
    let {isSelectAll, totalPrice, selectedCount} = this.props

    return (
      <View className='footer'>
        <View className='jiesuan'>
          <View className='cart-footer__select' onClick={this.changeSelectChecked}>
            <CheckboxItem
              checked={isSelectAll}
            >
              <Text className='cart-footer__select-txt'>全选</Text>
            </CheckboxItem>
          </View>
          <View className={classNames({
            'jiesuan-total': true,
            'jiesuan-disabled': !selectedCount
          })}
          >
            <Text>合计：</Text>
            <Text className='jiesuan-total_price'>¥ {parseFloat(totalPrice).toFixed(2)}
            </Text>
          </View>
          <Button
            className={classNames({
              'jiesuan-button': true,
              'jiesuan-disabled': !selectedCount
            })}
            onClick={this.handleConfirm}
          >
            <Text>下单({selectedCount})</Text>
          </Button>
        </View>
      </View>
    )
  }
}
