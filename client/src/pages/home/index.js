import Taro, { Component } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components'
import * as QL from 'graphql-sync-multi-platform/graphql_cache.core'
import Logo from '../../components/logo'
import Loading from '../../components/loading'
import { getWindowHeight } from '../../utils/style'
import {setGlobalData} from "../../utils/global_data"
import {findMany} from "../../utils/crud"
import {graphqlEndpoint, authUrl} from "../../config";
import Banner from './banner'
import Recommend from './recommend'
import Category from './category'
import './index.scss'

// graphql
QL.init(graphqlEndpoint, Taro.request);

class Home extends Component {
  config = {
    navigationBarTitleText: '服装商城'
  }

  constructor(props) {
    super(props)
    this.state = {
      swiperList: [],
      loaded: false,
      category:[],
      recommend:[],
      hasMore: false,
    }
  }

  componentDidMount() {
    this.getSlideShow()
    this.getGoodsInfo()
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
          console.log("auth code",res)
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
              console.log('auth res',res1)
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

  getSlideShow = () => {
    findMany({collection:"slideshow",fields:["id","img"]}).then((res)=>{
      // console.log("getSlideShow res",res)
      let swiperList = []
      res.forEach((item,index)=>{
         swiperList.push(item.img)
        if(index === res.length -1){
          this.setState({
            swiperList
          })
        }
      })
    })
  }

  getGoodsInfo = () => {
    const categoryFilter = {
      "status": "1",
      "limit": 7,
      // "sort_by": {"order": "asc"}
    }

    let category = findMany({collection: "category",condition:categoryFilter,fields:["id", "value:name", "image:img", "status"]})
    let recommend = findMany({collection:"product",condition: {status: '1', recommend: 1},fields:["name", "id", "intro", "price", "img", "stock", "discountRate", "status"]})

    Promise.all([category, recommend]).then((res)=>{
      console.log('getGoodsInfo data',res)
      this.setState({
        loaded:true,
        category: res[0],
        recommend: res[1]
      })
    })

    // QL.find([["category",categoryFilter, ["id", "value:name", "image:img", "status"]],
    //          ["product",{status: '1', recommend: 1}, ["name", "id", "intro", "price", "img", "stock", "discountRate", "status"]]]).then(
    //            res=>{
    //                  console.log('fetch data',res);
    //                  this.setState({
    //                  loaded:true,
    //                  category: res[0],
    //                  recommend: res[1]
    //                  });
    //          }
    // )
  }

  render() {
    if (!this.state.loaded) {
      return <Loading />
    }
    const { swiperList, category, recommend } = this.state

    return (
      <View className='home'>
        <ScrollView
          scrollY
          className='home__wrap'
          onScrollToLower={this.loadRecommend}
          style={{ height: getWindowHeight() }}
        >
          <View onClick={this.handlePrevent}>
            <Banner list={swiperList} />
          </View>

          <Category list={category} />

          {/* 为你推荐 */}
          <Recommend list={recommend} />

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
