import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import classNames from 'classnames'
import CheckboxItem from '../../../components/checkbox'
import './index.scss'

export default class Footer extends Component {
  static defaultProps = {
    onCheckedAll: () => {},
    onSettleAccounts: () => {},
    onDelete: () => {},
  }

  changeSelectChecked = () => {
    this.props.onCheckedAll()
  }

  handleConfirm = () => {
    let {selectedCount, pageType} = this.props
    console.log("footer handleConfirm pageType",pageType)
    if(selectedCount){
      pageType === 'detail' ? this.props.onSettleAccounts() : this.props.onDelete()
    }else {
      Taro.showToast({
        title: '请选择商品！',
        icon: 'none'
      })
    }
  }

  render () {
    let {isSelectAll, totalPrice, selectedCount, pageType} = this.props

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
          {
            pageType === 'detail' ?
              <View className={classNames({
                'jiesuan-total': true,
                'jiesuan-disabled': !selectedCount
              })}
              >
                <Text>合计：</Text>
                <Text className='jiesuan-total_price'>¥ {parseFloat(totalPrice).toFixed(2)}
                </Text>
              </View>
              :
              <View className='jiesuan-total' />
          }
          <Button
            className={classNames({
              'jiesuan-button': true,
              'jiesuan-disabled': !selectedCount
            })}
            onClick={this.handleConfirm}
          >
            <Text>{pageType === 'detail' ? '下单' : '删除' }({selectedCount})</Text>
          </Button>
        </View>
      </View>
    )
  }
}
