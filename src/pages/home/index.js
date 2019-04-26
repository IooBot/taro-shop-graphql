import Taro, { Component } from '@tarojs/taro';
import { View, Text, ScrollView } from '@tarojs/components'
import * as QL from 'graph-cache/graphql_cache.core'

import Logo from '../../components/logo'
import Loading from '../../components/loading'
import { getWindowHeight } from '../../utils/style'
import Banner from './banner'
import Recommend from './recommend'
import Category from './category'

import './index.scss'

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
    this.getGoodsInfo();
  }

  getGoodsInfo = () => {
    const categoryFilter = {
      "status": "1",
      "limit": 7,
      // "sort_by": {"order": "asc"}
    };

    // let category = QL.find_many("category",categoryFilter, ["id", "value:name", "image:img", "status"]).then((res)=>{
    //   console.log('category res',res)
    //   return res
    // })
    //
    // let recommend = QL.find_many("product",{status: '1', recommend: 1}, ["name", "id", "intro", "price", "img", "stock", "discountRate", "status"]).then((res)=>{
    //   console.log('recommend res',res)
    //   return res
    // });
    QL.find([["category",categoryFilter, ["id", "value:name", "image:img", "status"]],
             ["product",{status: '1', recommend: 1}, ["name", "id", "intro", "price", "img", "stock", "discountRate", "status"]]]).then(
               res=>{
                     console.log('fetch data',res);
                     this.setState({
                     loaded:true,
                     category: res[0],
                     recommend: res[1]
                     });
             }
    );


    // Promise.all([category, recommend]).then((res)=>{
    //   console.log('promise data',res)
    //   this.setState({
    //     loaded:true,
    //     category: res[0],
    //     recommend: res[1]
    //   });
    // })
  }

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
