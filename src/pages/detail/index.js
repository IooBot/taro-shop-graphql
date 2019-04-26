import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { findOne, findMany } from "../../utils/crud"
import Loading from '../../components/loading'
import Popup from '../../components/popup'
import { getWindowHeight } from '../../utils/style'
import Gallery from './gallery'
// import InfoBase from './info-base'
// import InfoParam from './info-param'
// import Detail from './detail'
// import Footer from './footer'
import Spec from './spec'
import './index.scss'


class Details extends Component {
  config = {
    navigationBarTitleText: '商品详情'
  }

  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      selected: {},
      detailInfo:{},
      detailSpec:{}
    }
    this.id = String(this.$router.params.id)
  }

  componentDidMount() {
    console.log("this.id",this.id,typeof this.id)
    let detail = findOne({collection:"product",condition:{id: this.id},fields:["name", "id", "intro", "price", "img", "stock", "discountRate", "status"]})
    let detailSpec = findMany({collection:"specificationStock",condition:{product_id: this.id},fields:["id", "color", "size", "slideImg", "detailImg", "stock", "status"]})

    Promise.all([detail, detailSpec]).then((res)=>{
      console.log('promise data',res)
      this.setState({
        loaded:true,
        detailInfo: res[0],
        detailSpec: res[1]
      });
    })
    this.setState({ loaded: true })
  }

  handleSelect = (selected) => {
    this.setState({ selected })
  }

  // handleAdd = () => {
  //   // 添加购物车是先从 skuSpecValueList 中选择规格，再去 skuMap 中找 skuId，多个规格时用 ; 组合
  //   const { itemInfo } = this.props
  //   const { skuSpecList = [] } = itemInfo
  //   const { visible, selected } = this.state
  //   const isSelected = visible && !!selected.id && itemInfo.skuMap[selected.id]
  //   const isSingleSpec = skuSpecList.every(spec => spec.skuSpecValueList.length === 1)
  //
  //   if (isSelected || isSingleSpec) {
  //     const selectedItem = isSelected ? selected : {
  //       id: skuSpecList.map(spec => spec.skuSpecValueList[0].id).join(';'),
  //       cnt: 1
  //     }
  //     const skuItem = itemInfo.skuMap[selectedItem.id] || {}
  //     const payload = {
  //       skuId: skuItem.id,
  //       cnt: selectedItem.cnt
  //     }
  //     this.props.dispatchAdd(payload).then(() => {
  //       Taro.showToast({
  //         title: '加入购物车成功',
  //         icon: 'none'
  //       })
  //     })
  //     if (isSelected) {
  //       this.toggleVisible()
  //     }
  //     return
  //   }
  //
  //   if (!visible) {
  //     this.setState({ visible: true })
  //   } else {
  //     // XXX 加购物车逻辑不一定准确
  //     Taro.showToast({
  //       title: '请选择规格（或换个商品测试）',
  //       icon: 'none'
  //     })
  //   }
  // }

  toggleVisible = () => {
    this.setState({
      visible: !this.state.visible,
      selected: {}
    })
  }

  render () {
    const { detailInfo, detailSpec} = this.state
    console.log("detailInfo",detailInfo)
    console.log("detailSpec",detailSpec)
    let sliderImg = detailInfo.img
    let gallery = [detailInfo.img]
    gallery.push(sliderImg)

    console.log("gallery",gallery)
    const height = getWindowHeight(false)
    // XXX RN 的 transform 写法不同，这块可以统一放到 @utils/style 的 postcss() 中处理
    const popupStyle = process.env.TARO_ENV === 'rn' ?
      { transform: [{ translateY: Taro.pxTransform(-100) }] } :
      { transform: `translateY(${Taro.pxTransform(-100)})` }

    if (!this.state.loaded) {
      return <Loading />
    }

    return (
      <View className='item'>
        <ScrollView
          scrollY
          className='item__wrap'
          style={{ height }}
        >
          <Gallery list={gallery} />
          {/*<InfoBase data={itemInfo} />*/}
          {/*<InfoParam list={itemInfo.attrList} />*/}
          {/*<Detail html={itemDetail.detailHtml} />*/}
        </ScrollView>

        {/* NOTE Popup 一般的实现是 fixed 定位，但 RN 不支持，只能用 absolute，要注意引入位置 */}
        <Popup
          visible={this.state.visible}
          onClose={this.toggleVisible}
          compStyle={popupStyle}
        >
          {/*<Spec*/}
            {/*data={detailInfo}*/}
            {/*selected={this.state.selected}*/}
            {/*onSelect={this.handleSelect}*/}
          {/*/>*/}
        </Popup>

        {/*<View className='item__footer'>*/}
          {/*<Footer onAdd={this.handleAdd} />*/}
        {/*</View>*/}
      </View>
    )
  }
}

export default Details
