import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import Loading from '../../components/loading'
import ItemList from '../../components/item-list'
import './index.scss'
import { getWindowHeight } from '../../utils/style'
import {findMany} from "../../utils/crud"

class Kind extends Component {
  config = {
    navigationBarTitleText: ''
  }

  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
      loading: {},
      detailInfo:{}
    }
    this.categoryId = String(this.$router.params.categoryId)
  }

  componentDidMount() {
    let detailInfo = findMany({collection:"product",condition:{category_id: this.categoryId},fields:["name", "id", "intro", "price", "img", "stock", "discountRate", "status"]})

    this.setState({
      loaded:true,
      detailInfo,
    });
    // const payload = { categoryId: this.categoryId }
    // this.props.dispatchSubMenu(payload).then((res) => {
    //   this.setState({ loaded: true })
    //
    //   const { category: { name, subCategoryList } } = res
    //   Taro.setNavigationBarTitle({ title: name })
    //   setTimeout(() => {
    //     const index = subCategoryList.findIndex(item => item.id === this.subId)
    //     this.handleMenu(index)
    //   }, 0)
    // })
  }

  loadList = (id) => {
    const { loading } = this.state
    if (loading[id]) {
      return
    }

    this.setState({ loading: { ...loading, [id]: true } })
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
              {detailInfo.name}
            </Text>
          </View>
        </ItemList>
        <View className='cate-sub__list-tip'>
          <Text className='cate-sub__list-tip-txt'>横向滑动切换其他分类</Text>
        </View>
      </ScrollView>
    )
  }
}

export default Kind
