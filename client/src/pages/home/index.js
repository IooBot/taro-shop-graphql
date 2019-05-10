import Taro, { Component } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components'
import * as QL from 'graphql-sync-multi-platform/graphql_cache.core'
import moment from 'moment'
import Logo from '../../components/logo'
import Loading from '../../components/loading'
import { getWindowHeight } from '../../utils/style'
import {setGlobalData} from "../../utils/global_data"
import Banner from './banner'
import Recommend from './recommend'
import Category from './category'

import './index.scss'
import {graphqlEndpoint, authUrl} from "../../config";
import {findMany, insert} from "../../utils/crud"
import {idGen} from "../../utils/func"
// graphql
QL.init(graphqlEndpoint, Taro.request);

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      swiperList: [
        'https://ece-img-1254337200.cos.ap-chengdu.myqcloud.com/ecslider1.jpg',
        'https://zos.alipayobjects.com/rmsportal/AiyWuByWklrrUDlFignR.png',
        'https://zos.alipayobjects.com/rmsportal/TekJlZRVCjLFexlOCuWn.png',
        // 'https://green-1258802564.cos.ap-beijing.myqcloud.com/shop.jpg',
        'https://zos.alipayobjects.com/rmsportal/IJOtIlfsYdTyaDTRVrLI.png'
      ],
      loaded: false,
      // category:[],
      recommend:[],
      hasMore: false
    }
  }

  config = {
    navigationBarTitleText: '服装商城'
  }

  componentDidMount() {
    // this.setState({
    //   loaded:true,
    // });
    this.getGoodsInfo()
    this.auth()
    this.getLogin()
  }

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
    let _this = this
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
              let openid = res1.data.openid
              _this.createWxUser(openid)
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

  createWxUser = (openid) => {
    findMany({collection:'user',condition:{openid},fields:['id']})
      .then(data => {
        console.log('find user data', data)
        if (data.length) {
          setGlobalData('user_id', data)
        } else {
          let createdAt = moment().format('YYYY-MM-DD HH:mm:ss')
          let id = idGen('user')
          const userContent = {
            email: "",
            updatedAt: "",
            password: "",
            telephone: "",
            username: "",
            createdAt,
            openid,
            id,
            userData_id: ""
          }
          insert({collection: 'user',condition: userContent}).then((res)=>{
            console.log("createWxUser res",res)
            setGlobalData('user_id', data)
          })
        }
      })
  }

  getGoodsInfo = () => {
    const categoryFilter = {
      "status": "1",
      "limit": 7,
      // "sort_by": {"order": "asc"}
    };

    let category = QL.find_many("category",categoryFilter, ["id", "value:name", "image:img", "status"]).then((res)=>{
      console.log('category res',res)
      return res
    })

    let recommend = QL.find_many("product",{status: '1', recommend: 1}, ["name", "id", "intro", "price", "img", "stock", "discountRate", "status"]).then((res)=>{
      console.log('recommend res',res)
      return res
    });
    Promise.all([category, recommend]).then((res)=>{
      console.log('promise data',res)
      this.setState({
        loaded:true,
        category: res[0],
        recommend: res[1]
      });
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
    // );

  };

  render() {
    if (!this.state.loaded) {
      return <Loading />
    }
    const { swiperList, category, recommend } = this.state
    console.log('recommend',recommend)
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
