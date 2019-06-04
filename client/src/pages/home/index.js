import Taro, { Component } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components'
import { connect } from '@tarojs/redux';
import * as QL from 'shortql/graphql_cache.core'
import Logo from '../../components/logo'
import Loading from '../../components/loading'
import { getWindowHeight } from '../../utils/style'
import {setGlobalData} from "../../utils/global_data"
// import {findMany} from "../../utils/crud"
import { graphqlEndpoint, authUrl } from "../../config";
import Banner from './banner'
import Recommend from './recommend'
import Category from './category'
import './index.scss'
import {findMany} from "../../utils/crud";

QL.init(graphqlEndpoint, Taro.request, {enable_log : true});

@connect(({ slideshowList, productList, categoryList, loading }) => ({
  slideshowList,
  productList,
  categoryList,
  ...loading,
}))
class Home extends Component {
  config = {
    navigationBarTitleText: '服装商城'
  }

  constructor(props) {
    super(props)
    this.state = {
      // swiperList: [],
      // loaded: false,
      // category:[],
      // recommend:[],
      hasMore: false,
    }
  }

  componentDidMount() {
    // this.getSlideShow()
    //this.getGoodsInfo()
    this.props.dispatch({
      type: 'slideshowList/fetch',
    });
    this.props.dispatch({
      type: 'categoryList/fetch',
      payload: { status: "1", limit: 7}
    });
    this.props.dispatch({
      type: 'productList/fetch',
      payload: {status: '1', recommend: 1}
    });
    this.auth()
    // this.getLogin()
  }
  // 小程序云开发云函数获取openid
  getLogin = () => {
    Taro.cloud
      .callFunction({
        name: "login",
        data: {}
      })
      .then(res => {
        console.log("getLogin res",res)
        let openid = res.result.openid
        setGlobalData('openid', openid)
        Taro.getSetting().then((res1)=>{
          console.log("getSetting res",res1)
        })
      })
  }

  auth =() =>{
    Taro.login({
      success(res) {
        if (res.code) {
          // 发起网络请求
          // console.log("auth code",res)
          Taro.request({
              url: authUrl,
              method:"POST",
              data: {
                code:res.code
              },
              header: {
                'content-type': 'application/json'
              }
            })
            .then((res1) => {
              // console.log('auth res',res1)
              let {openid, user_id} = res1.data
              setGlobalData('openid', openid)
              setGlobalData('user_id', user_id)
            })
            .catch((error) => {
              console.log('auth error', error)
            })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  }

  render() {
    const { slideshowList, productList, categoryList, effects } = this.props;
    // console.log('pro-effect:',effects['productList/fetch']);
    // console.log('cat-effect:',effects['categoryList/fetch']);
    // console.log('slide1',slideshowList.list);
    if (effects['productList/fetch']) {  // this.state.loaded
        return <Loading />
     }
    // const { swiperList , category, recommend} = this.state; //
    // console.log('slide',swiperList);

    return (
      <View className='home'>
        <ScrollView
          scrollY
          className='home__wrap'
          // onScrollToLower={this.loadRecommend}
          style={{ height: getWindowHeight() }}
        >
          <View onClick={this.handlePrevent}>
            <Banner list={slideshowList.list} />
          </View>

          <Category list={categoryList.list} />

          {/* 为你推荐 */}
          <Recommend list={productList.list} />

          {this.state.loading &&
          <View className='home__loading'>
            <Text className='home__loading-txt'>正在加载中...</Text>
          </View>
          }
          {!this.state.hasMore &&
          <View className='home__loading home__loading--not-more'>
            <Text className='home__loading-txt'>更多内容，敬请期待</Text>
          </View>
          }
          <Logo />
        </ScrollView>
      </View>
    )
  }
}

export default Home
