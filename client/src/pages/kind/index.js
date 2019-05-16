import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import Loading from '../../components/loading'
import ItemList from '../../components/item-list'
import './index.scss'
import { getWindowHeight } from '../../utils/style'
import {findMany} from "../../utils/crud"

class Kind extends Component {
  config = {
    navigationBarTitleText: "商品分类"
  }

  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      detailInfo:{}
    }
    this.categoryId = String(this.$router.params.categoryId)
  }

  componentDidMount() {
    findMany({collection:"product",condition:{category_id: this.categoryId},fields:["category_id.name", "name", "id", "intro", "price", "img", "stock", "discountRate", "status"]}).then((res)=>{
      // console.log("Kind res",res)
      this.setState({
        loaded:true,
        detailInfo:res,
      })
    })
  }

  render () {
    const { detailInfo } = this.state
    const height = getWindowHeight(false)
    if (!this.state.loaded) {
      return <Loading />
    }

    return (
      <ScrollView
        scrollY
        className='cate-sub__list'
        style={{ height }}
      >
        <ItemList list={detailInfo}>
          <View className='cate-sub__list-title'>
            <Text className='cate-sub__list-title-txt'>
              {detailInfo[0].category_id.name}
            </Text>
          </View>
        </ItemList>
      </ScrollView>
    )
  }
}

export default Kind
