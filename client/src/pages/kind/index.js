import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import {connect} from "@tarojs/redux";
import Loading from '../../components/loading'
import ItemList from '../../components/item-list'
import './index.scss'
import { getWindowHeight } from '../../utils/style'
//import {findMany} from "../../utils/crud"

@connect(({  productList, loading }) => ({
  productList,
  ...loading,
}))
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
    this.props.dispatch({
      type: 'productList/fetch',
      payload: {category_id: this.categoryId}
    });
  }

  render () {
    // const { detailInfo } = this.state
    const { productList,  effects } = this.props;
    console.log('load:',effects['productList/fetch']);
    if (effects['productList/fetch'] ) {
      return <Loading />
    }
    console.log('product:',productList);

    const height = getWindowHeight(false)
    const detailInfo =  productList.list;
    return (
      <ScrollView
        scrollY
        className='cate-sub__list'
        style={{ height }}
      >
        <ItemList list={ detailInfo }>
          <View className='cate-sub__list-title'>
            <Text className='cate-sub__list-title-txt'>
              {detailInfo[0]? detailInfo[0].category.name : ''}
            </Text>
          </View>
        </ItemList>
      </ScrollView>
    )
  }
}

export default Kind
