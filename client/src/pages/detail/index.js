import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import Loading from '../../components/loading'
import Popup from '../../components/popup'
// import { findOne, findMany } from "../../utils/crud"
import { getWindowHeight } from '../../utils/style'
import Gallery from './gallery'
import InfoBase from './info-base'
import DetailImg from './detail-img'
import Footer from './footer'
import Spec from './spec'
import './index.scss'
import {getGlobalData} from "../../utils/global_data"

@connect(({ productList, specificationStockList, userCartList, loading }) => ({
  specificationStockList,
  productList,
  userCartList,
  ...loading,
}))
class Detail extends Component {
  config = {
    navigationBarTitleText: '商品详情'
  }

  constructor(props) {
    super(props)
    this.state = {
      // loaded: false,
      selected: {},
      // detailInfo:{},
      // detailSpec:[],
      buttonType: 'add',
      cartCount: Taro.getStorageSync('cartCount')
    }
    this.id = String(this.$router.params.id)
  }

  componentDidMount() {
    let productId = this.id;
    console.log('productId',productId);
    this.props.dispatch({
      type: 'productList/fetchOne',
      payload: {id: productId}
    });
    this.props.dispatch({
      type: 'specificationStockList/fetch',
      payload: {product_id: productId}
    });
    let user_id = getGlobalData("user_id");
    this.props.dispatch({
      type: 'userCartList/fetch',
      payload: { user_id }
    });
  }

  // 获取购物车数量更新
  getCartCount = (res) => {
      let cartCount=0;
      if(res.length){
        res.forEach((item,index)=>{
          cartCount+=item.count
          if(index === res.length -1){
            Taro.setStorage({key: 'cartCount', data: cartCount})
          }
        })
      }else {
        Taro.setStorage({key: 'cartCount', data: cartCount})
      }
  };

  handleSelect = (selected) => {
    this.setState({ selected })
  };

  changeDetailState = (state,val) => {
    this.setState({
      [state]:val
    })
  };

  toggleVisible = () => {
    this.setState({
      visible: !this.state.visible,
      selected: {}
    })
  }

  changeAddOrBuy = (val) => {
    this.setState({
      buttonType:val
    })
    this.toggleVisible()
  };

  render () {
    const {buttonType, cartCount} = this.state; //loaded, detailInfo, detailSpec,
    const { specificationStockList, productList, userCartList, effects }  = this.props;

    console.log(effects['productList/fetchOne'] , effects['userCartList/fetch'], effects['specificationStockList/fetch']);
    console.log(effects['productList/fetchOne'] || effects['userCartList/fetch']);

    if (effects['productList/fetchOne'] || effects['userCartList/fetch']) {
      return <Loading />
    }

    console.log('userCart:', userCartList.list);
    console.log('productList:', productList.currentProduct);
    console.log('spec:', specificationStockList.list);
   // this.getCartCount(userCartList.list);
    const detailInfo = productList.currentProduct;
    const detailSpec = specificationStockList.list;

    let user_id = getGlobalData("user_id")
    let {img, price} = detailInfo;
    let sliderImg = detailInfo.img;
    let gallery = [detailInfo.img];
    gallery.push(sliderImg)
    const height = getWindowHeight(false)

    return (
      <View className='detail'>
        <ScrollView
          scrollY
          className='detail__wrap'
          style={{ height }}
        >
          <Gallery list={gallery} />
          <InfoBase data={detailInfo} />
          <DetailImg imgList={gallery} />
        </ScrollView>

        {/* NOTE Popup 一般的实现是 fixed 定位，但 RN 不支持，只能用 absolute，要注意引入位置 */}
        <Popup
          visible={this.state.visible}
          onClose={this.toggleVisible}
        >
          <Spec
            user_id={user_id}
            price={price}
            img={img}
            buttonType={buttonType}
            detailInfo={detailInfo}
            detailSpec={detailSpec}
            selected={this.state.selected}
            onSelect={this.handleSelect}
            onClose={this.toggleVisible}
            onChangeDetailState={this.changeDetailState}
          />
        </Popup>
        <View className='detail__footer'>
          <Footer
            cartCount={cartCount}
            onChangeAddOrBuy={this.changeAddOrBuy}
          />
        </View>
      </View>
    )
  }
}

export default Detail
