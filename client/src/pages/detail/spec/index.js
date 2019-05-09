import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import classNames from 'classnames'
import moment from 'moment'
import InputNumber from '../../../components/input-number'
import ButtonItem from "../../../components/button"
import {idGen} from '../../../utils/func'
import {insert} from "../../../utils/crud"
import './index.scss'

export default class Spec extends Component {
  static defaultProps = {
    detailSpec:[],
    onClose: () => {}
  }

  constructor(props) {
    super(props)
    this.state = {
      count: 1,
      selectColor: '',
      specList: [],
      colorList: [],
      colorSpec:[],
      specFilter:{}
    }
  }

  componentDidMount() {
    // console.log("Spec this.props",this.props)
    this.handleSpec()
  }

  // specificationStock 规格库存表处理，目前按颜色进行分类，更新默认选择的规格
  handleSpec = () => {
    let {detailSpec} = this.props
    let flag = true, selectFlag = true
    let specObject = {}, i = 0, specList = []
    let colorObject = {}, j = 0, colorList = [], selectColor = ''
    detailSpec.map((item) => {
      let {id,color,size,stock,status} = item
      if(flag && status > 0) {
        selectColor = color
        flag = false
      }
      specObject[color] ? specList[specObject[color] - 1].spec.push({id, size, stock, status}) : specObject[color] = ++i && specList.push({
        color,
        spec: [{id, size, stock, status}],
      })
      if(!colorObject[color]) {
        colorObject[color] = ++j
        colorList.push({
          id,
          color
        })
      }
    })

    specList.map((items)=>{
      let {spec} = items
      spec.map((item)=>{
        item.select = false
        if(selectFlag && item.status > 0) {
          item.select = true
          selectFlag = false
        }
      })
      selectFlag = true
    })

    this.setState({
      selectColor,
      specList,
      colorList
    },()=>{
      this.changeColor(this.state.selectColor)
    })
    // console.log("handleSpec specList",specList)
  }

  // 选择颜色后更新当前规格选择
  changeColor = (val) => {
    // console.log("changeColor val",val)
    let {specList} = this.state
    let colorSpec = specList.filter(item=>item.color === val)[0].spec
    // console.log("changeColor colorSpec",colorSpec)

    this.setState({
      selectColor:val,
      colorSpec
    },()=>{
      this.changeSize()
    })
  }

  // 选择尺寸后更新当前规格选择
  changeSize = () => {
    let {colorSpec} = this.state
    let specFilter = colorSpec.filter(item=> item.select && item.status > 0)[0]
    // console.log("select specFilter",specFilter)

    this.setState({
      specFilter
    })
  }

  // 更新规格选择状态
  changeSelectedStatus=(i)=>{
    this.setState((prevState) => ({
      colorSpec: prevState.colorSpec.map((item,index) => {
        if (index === i){
          item.select=true
        } else {
          item.select=false
        }
        return item
      })
    }),()=>{
      this.changeSize()
    })
  }

  // 选择数量
  changeCount = (count) => {
    // console.log("Spec handleUpdate count",count)
    this.setState({ count })
  }

  // 添加至购物袋
  onCreateUserCart = (user_id) => {
    let id = idGen('cart')
    let {detailInfo} = this.props
    let product_id = detailInfo.id
    let {count, specFilter} = this.state
    let specificationStock_id =  specFilter.id
    let createdAt = moment().format('YYYY-MM-DD HH:mm:ss')

    const cartContent = {
      id,
      user_id,
      product_id,
      specificationStock_id,
      count,
      createdAt,
      updatedAt: ""
    }
    // console.log('cartContent',cartContent)

    this.props.onClose()
    insert({collection:'userCart',condition:cartContent}).then(()=>{
      // console.log('create_userCart data',data)
      let preCartCount = parseInt(Taro.getStorageSync('cartCount')) || 0
      let cartCount = preCartCount + count

      // 购物车数量显示更新
      this.props.onChangeDetailState('cartCount',cartCount)
      Taro.showToast({
        title: '成功添加至购物车',
        icon: 'none'
      })
      Taro.setStorageSync('cartCount',cartCount)
    })
  }

  // 立即购买
  buyNow = () => {
    let {count, selectColor, specFilter} = this.state
    let createdAt = moment().format('YYYY-MM-DD HH:mm:ss')
    let id = idGen('cart')
    let {detailInfo} = this.props
    let {id:product_id, img, intro, name, price, status, stock, unit} = detailInfo
    let {id:specificationStock_id, size, stock:specStock, status:specStatus} =  specFilter
    let totalPrice = price * count

    let buyNowContent = [{
      count,
      createdAt,
      id,
      product_id:{
        id:product_id,
        img,
        intro,
        name,
        price,
        status,
        stock,
        unit
      },
      specificationStock_id:{
        id:specificationStock_id,
        color:selectColor,
        size,
        stock:specStock,
        status:specStatus
      }
    }]
    // console.log('buyNowContent',buyNowContent)

    Taro.setStorageSync('buyNowContent',buyNowContent)
    Taro.setStorageSync('totalPrice',totalPrice)
    Taro.setStorageSync('totalCount',count)
    this.props.onClose()
    Taro.navigateTo({
      url: `/pages/orders/index?dataType=buyNowContent`
    })
  }

  // 选择确认
  handleConfirm = () => {
    let user_id = 'ioobot'
    let {buttonType} = this.props

    if(buttonType === 'add'){
      this.onCreateUserCart(user_id)
    }else if(buttonType === 'buy'){
      this.buyNow()
    }
  }

  render() {
    let {price, img} = this.props
    let {count, selectColor, colorList, colorSpec, specFilter} = this.state
    let specStock =  specFilter.stock || 0
    let selectSize =  specFilter.size

    return(
      <View className='popup-box' >
        <View className='main-goods-box'>
          <View className='goods-box'>
            <View className='goods-info'>
              <View className='left'>
                <Image src={img || 'https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png'} alt='商品图片' />
              </View>
              <View className='mid'>
                <View className='goods_price'> ￥ {price}</View>
                <View className='selected-type'>已选择： {selectColor} / {selectSize}</View>
              </View>
              <View className='right'>库存
                {specStock}
              </View>
            </View>
            <View className='scroll-body'>
              <View className='goods_type'>
                <View className='ul'>
                  <View className='li'>
                    <View className='type-title'>颜色</View>
                    <View className='dl'>
                      {
                        colorList.map((spec1)=>(
                          <View
                            className={classNames({
                              'dd':true,
                              'spec-red': spec1.color === selectColor
                            })}
                            key={'color'+spec1.id}
                            onClick={this.changeColor.bind(this,spec1.color)}
                          >
                            {spec1.color}
                          </View>
                        ))
                      }
                    </View>
                  </View>
                  <View className='li'>
                    <View className='type-title'>规格</View>
                    <View className='dl'>
                      {
                        colorSpec.map((item,index)=>(
                          <View
                            className={classNames({
                              'dd':true,
                              'spec-gray': item.status < 1,
                              'spec-red': item.status > 0 && item.select
                            })}
                            key={'spec'+item.id}
                            onClick={()=>{
                              if(item.status > 0)  this.changeSelectedStatus(index)
                            }}
                          >
                            {item.size}
                          </View>
                        ))
                      }
                    </View>
                  </View>
                </View>
              </View>
              <View className='edit-product'>
                <View className='edit-product-text'>购买数量</View>
                <View className='edit-product-count'>
                  <InputNumber
                    num={count}
                    onChange={this.changeCount}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className='confirm-footer'>
          <ButtonItem
            type='primary'
            text='确认'
            onClick={this.handleConfirm}
          />
        </View>
      </View>
    )
  }
}
