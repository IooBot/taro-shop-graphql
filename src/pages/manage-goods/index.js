import React, {Component} from 'react'
import './index.css'
import {
    Picker,
    NavBar,
    Accordion,
    List,
    InputItem,
    ImagePicker,
    Button,
    ActivityIndicator,
    Stepper,
    Modal
} from 'antd-mobile'
import {Switch, Row, Col, Icon} from 'antd'
import {withRouter} from 'react-router-dom'
import {
    create_product,
    update_product,
    delete_product_by_id,
    category_by_props,
    productbyprops,
    update_category,
    delete_category,
    create_category,
    specificationStock_by_props,
    delete_specificationStock,
    update_specificationStock,
    create_specificationStock
} from "../../../../utils/gql"
import {Query, Mutation} from "react-apollo"
import gql from "graphql-tag"
import {idGen} from "../../../../utils/func"
import moment from 'moment'
import {storeFile} from "../../../../configs/url"
import axios from 'axios'
import classNames from 'classnames'
import {findMany} from "../../utils/crud";

const Item = List.Item
const categoryFilterRefetch = {
    "status": "1",
    "limit": 7,
    "sort_by": {"order": "asc"}
}
const categoryFilter = {
    "sort_by": {"order": "asc"}
}

class Goods extends Component {
    constructor(props) {
        super(props)
        this.state = {
            accordionKey: undefined
        }
    }

    render() {
        let {accordionKey} = this.state

        return (
            <div className='goods-wrap'>
                <NavBar
                    className='navbar'
                    mode="light"
                    icon={<Icon type="left"/>}
                    onLeftClick={() => {
                        this.props.history.go(-2)
                    }}
                >商品管理</NavBar>
                <div className='content-wrap'>
                    <div className='my-list-subtitle' style={{color: 'grey'}}><Icon type="bulb"
                                                                                    style={{marginRight: 10}}/>{accordionKey ? '折叠单项以展开更多分类' : '请选择需要打开的分类'}
                    </div>
                    <Accordion className="my-accordion" onChange={(key) => {
                        this.setState({
                            accordionKey: key[0]
                        })
                    }}>
                        <Accordion.Panel header="全部分类"
                                         className={classNames({'hidden': accordionKey === '1' || accordionKey === '2'})}>
                            <AllCategory/>
                        </Accordion.Panel>
                        <Accordion.Panel header="全部商品"
                                         className={classNames({'hidden': accordionKey === '0' || accordionKey === '2'})}>
                            <AllGoods/>
                        </Accordion.Panel>
                        <Accordion.Panel header="添加商品"
                                         className={classNames({'hidden': accordionKey === '0' || accordionKey === '1'})}>
                            <AddGoods/>
                        </Accordion.Panel>
                    </Accordion>
                </div>
            </div>
        )
    }
}

class AllCategory extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
    componentDidMount() {
      let categoryData = findMany({collection:"category",condition:categoryFilter});//,fields:[]
      categoryData.then(res =>{
        console.log('categoryData',res)
        this.setState({
          loaded: true,
          categoryList: res,
         });
      })
    }
    render() {
        return (
            <div>
                <Query query={gql(category_by_props)} variables={categoryFilter}>
                    {
                        ({loading, error, data}) => {
                            if (loading) {
                                return (
                                    <div className="loading-center">
                                        <ActivityIndicator text="Loading..." size="large"/>
                                    </div>
                                )
                            }
                            if (error) {
                                return 'error!'
                            }
                            let categoryList = data.categorybyprops
                            return (
                                <div>
                                    <List>
                                        {
                                            categoryList.map(category => {
                                                return (
                                                    <Item key={category.id} extra={
                                                        <div className='list-extra'>
                                                            <AllCategorySwitch category={category}/>
                                                            <AllCategoryButton category={category}/>
                                                        </div>
                                                    }>
                                                        {category.text}
                                                    </Item>
                                                )
                                            })
                                        }
                                    </List>
                                    <AllCategoryInput order={categoryList.length + 1}/>
                                </div>
                            )
                        }
                    }
                </Query>
            </div>
        )
    }
}

class AllCategorySwitch extends Component {
    constructor(props) {
        super(props)
        this.state = {
            checked: props.category.status === '1'
        }
    }

    render() {
        let {category} = this.props
        let {checked} = this.state
        return (
            <Mutation mutation={gql(update_category)} refetchQueries={[
                {query: gql(category_by_props), variables: categoryFilter},
                {query: gql(category_by_props), variables: categoryFilterRefetch}
            ]}>
                {(updatecategory, {loading, error}) => {
                    if (loading)
                        return (
                            <div className="loading">
                                <div className="align">
                                    <ActivityIndicator text="Loading..." size="large"/>
                                </div>
                            </div>
                        )
                    if (error)
                        return 'error'
                    let obj = {
                        id: category.id,
                        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
                    }
                    return (
                        <Switch checked={checked} onChange={(bool) => {
                            this.setState({checked: bool})
                            updatecategory({variables: {...obj, status: bool ? '1' : '0'}})
                        }}/>
                    )
                }}
            </Mutation>
        )
    }
}

class AllCategoryButton extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        let {category} = this.props

        return (
            <Mutation mutation={gql(delete_category)} refetchQueries={[
                {query: gql(category_by_props), variables: categoryFilter},
                {query: gql(category_by_props), variables: categoryFilterRefetch}
            ]}>
                {(deletecategory, {loading, error}) => {
                    if (loading)
                        return (
                            <div className="loading">
                                <div className="align">
                                    <ActivityIndicator text="Loading..." size="large"/>
                                </div>
                            </div>
                        )
                    if (error)
                        return 'error'
                    return (
                        <Button type='warning' inline size="small" onClick={() => {
                            deletecategory({variables: {id: category.id}})
                        }}>删除</Button>
                    )
                }}
            </Mutation>
        )
    }
}

class AllCategoryInput extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newCategory: ''
        }
    }

    render() {
        let {order} = this.props
        let {newCategory} = this.state
        return (
            <Mutation mutation={gql(create_category)} refetchQueries={[
                {query: gql(category_by_props), variables: categoryFilter},
                {query: gql(category_by_props), variables: categoryFilterRefetch}
            ]}>
                {(createcategory, {loading, error}) => {
                    if (loading)
                        return (
                            <div className="loading">
                                <div className="align">
                                    <ActivityIndicator text="Loading..." size="large"/>
                                </div>
                            </div>
                        )
                    if (error)
                        return 'error'
                    let obj = {
                        id: idGen('category'),
                        name: newCategory,
                        img: '',
                        order,
                        status: '1',
                        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                        updatedAt: ''
                    }
                    return (
                        <InputItem
                            onChange={(e) => {
                                this.setState({newCategory: e})
                            }}
                            value={newCategory}
                            placeholder="请输入分类名称"
                            extra={
                                <Button type='primary' inline size="small"
                                        onClick={() => {
                                            createcategory({variables: obj})
                                        }}>添加</Button>
                            }>
                            新的分类
                        </InputItem>
                    )
                }}
            </Mutation>
        )
    }

}

class AllGoods extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modal: false,
            product: {}
        }
    }

    controlModal = (bool) => () => {
        this.setState({
            modal: bool
        })
        if (!bool) {
            this.setState({
                product: {}
            })
        }
    }
  componentDidMount() {
    let productData = findMany({collection:"product"});//,condition:{user_id: user_id},fields:[]
    productData.then(res =>{
      console.log('productData',res)
      this.setState({
        loaded: true,
        products: res,
      });
    })
  }
    render() {
        let {modal, product} = this.state
        return (
            <Query query={gql(productbyprops)} variables={{}}>
                {
                    ({loading, error, data}) => {
                        if (loading) {
                            return (
                                <div className="loading-center">
                                    <ActivityIndicator text="Loading..." size="large"/>
                                </div>
                            )
                        }
                        if (error) {
                            return 'error!'
                        }
                        let products = data.productbyprops
                        return (
                            <div>
                                <div className='all-goods'>
                                    {
                                        products.map(product => {
                                            return (
                                                <Row className='good-block' key={product.id}>
                                                    <Col span={6}>
                                                        <div className='good-image'
                                                             style={{backgroundImage: `url(${product.img})`}}/>
                                                    </Col>
                                                    <Col span={11} offset={1}>{product.name}</Col>
                                                    <Col span={5}
                                                         style={{display: 'flex', justifyContent: 'space-around'}}>
                                                        <Mutation mutation={gql(update_product)} refetchQueries={[
                                                            {query: gql(productbyprops), variables: {}},
                                                            {
                                                                query: gql(productbyprops),
                                                                variables: {status: '1', recommend: 1}
                                                            }
                                                        ]}>
                                                            {(updateproduct, {loading, error}) => {
                                                                if (loading)
                                                                    return (
                                                                        <div className="loading">
                                                                            <div className="align">
                                                                                <ActivityIndicator text="Loading..."
                                                                                                   size="large"/>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                if (error)
                                                                    return 'error'
                                                                let {id, recommend} = product
                                                                let variables = {
                                                                    id,
                                                                    recommend: Number(!recommend),
                                                                    updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
                                                                }
                                                                return (
                                                                    <Icon type="like"
                                                                          className={classNames('not-like', {'like': recommend === 1})}
                                                                          onClick={() => {
                                                                              updateproduct({variables})
                                                                          }}/>
                                                                )
                                                            }}
                                                        </Mutation>
                                                        <Icon type="form" onClick={() => {
                                                            this.setState({modal: true, product})
                                                        }}/>
                                                    </Col>
                                                </Row>
                                            )
                                        })
                                    }
                                </div>
                                <Modal
                                    popup
                                    visible={modal}
                                    onClose={this.controlModal(false)}
                                    animationType="slide-up"
                                    className='modify-goods-modal'
                                >
                                    <div className='close-popup' onClick={this.controlModal(false)}>X</div>
                                    <div style={{paddingTop: 52}}>
                                        <AddGoods good={product}/>
                                    </div>
                                </Modal>
                            </div>
                        )
                    }
                }
            </Query>
        )
    }
}

class AddGoods extends Component {
    constructor(props) {
        super(props)
        let state = {
            files: [],
            imgDatas: [],
            modal: false
        }
        if (props.good === undefined) {
            this.state = {
                ...state,
                name: '',
                price: 0,
                intro: '',
                stock: 20,
                category: '',
                category_id: '',
                newGood: true
            }
        } else {
            // console.log(props.good)
            let {name, price, intro, stock, id} = props.good
            this.state = {
                ...state,
                id,
                name,
                price,
                intro,
                stock,
                category: props.good.category_id.name,
                category_id: [props.good.category_id.id],
                newGood: false
            }
        }
    }
  componentDidMount() {
    let specificationStockData = findMany({collection:"specificationStock",condition:{product_id: this.state.id}});//,fields:[]
    specificationStockData.then(res =>{
      console.log('specificationStockData',res)
      this.setState({
        loaded: true,
        products: res,
      });
    })
  }
    onChange = (id) => (files, operationType) => {
        let imgDatas = []

        files.forEach((file, index) => {
            let base64Cont = files[index].url.split(',')[1]
            let imgType = files[index].file.type.split('/')[1]
            let imgNewName = `good_id_${id}.${imgType}`

            const imgData = {
                'file-name': `e-commerce/images/${imgNewName}`,
                'bucket': 'case',
                'cont': base64Cont,
                'public': true,
                'format': 'base64'
            }
            imgDatas.push(imgData)
        })

        this.setState({
            imgDatas,
            files
        })
    }

    uploadImg = () => {
        let {imgDatas} = this.state

        return imgDatas.map((imgData) => (
            axios({
                url: storeFile,
                method: 'post',
                data: imgData
            })
        ))
    }

    controlModal = (bool) => () => {
        this.setState({
            modal: bool
        })
    }

    render() {
        let {files, imgDatas, name, intro, stock, price, category_id, newGood, modal} = this.state
        let id = newGood ? idGen('goods') : this.state.id
        return (
            <Query query={gql(specificationStock_by_props)} variables={{product_id: id}}>
                {
                    ({loading, error, data}) => {
                        if (loading) {
                            return (
                                <div className="loading-center">
                                    <ActivityIndicator text="Loading..." size="large"/>
                                </div>
                            )
                        }
                        if (error) {
                            return 'error!'
                        }

                        let specs = data.specificationStockbyprops

                        return (
                            <div>
                                <List className="my-add-goods-list">
                                    <InputItem onChange={(e) => {
                                        this.setState({name: e})
                                    }} value={name} placeholder="请输入名称">名称</InputItem>
                                    <Query query={gql(category_by_props)} variables={categoryFilter}>
                                        {
                                            ({loading, error, data}) => {
                                                if (loading) {
                                                    return (
                                                        <div className="loading-center">
                                                            <ActivityIndicator text="Loading..." size="large"/>
                                                        </div>
                                                    )
                                                }
                                                if (error) {
                                                    return 'error!'
                                                }

                                                let categoryList = data.categorybyprops.map(category => {
                                                    category.value = category.id
                                                    category.label = category.text
                                                    return category
                                                })

                                                return (
                                                    <Picker data={categoryList}
                                                            cols={1}
                                                            value={this.state.category_id}
                                                            onChange={v => {
                                                                this.setState({category_id: v})
                                                            }}
                                                    >
                                                        <List.Item arrow="horizontal">选择种类</List.Item>
                                                    </Picker>
                                                )
                                            }
                                        }
                                    </Query>
                                    <InputItem onChange={(e) => {
                                        this.setState({intro: e})
                                    }} value={intro} placeholder="请输入简介">简介</InputItem>
                                    <InputItem onChange={(e) => {
                                        this.setState({price: e})
                                    }} value={price} placeholder="请输入价格">价格</InputItem>
                                    <Item extra={<Stepper onChange={(e) => {
                                        this.setState({stock: e})
                                    }} value={stock} style={{width: '100%', minWidth: '100px'}} showNumber
                                                          size="small"/>}>库存</Item>
                                    <Item arrow="horizontal"
                                          onClick={this.controlModal(true)}>{newGood ? '点击添加规格' : '点击修改规格'}</Item>
                                    <div className='list-others'>
                                        <div className='list-others-subtitle'>商品图片</div>
                                        <ImagePicker
                                            files={files}
                                            onChange={this.onChange(id)}
                                            onImageClick={(index, fs) => console.log(index, fs)}
                                            selectable={true}
                                            multiple={false}
                                        />
                                        {
                                            newGood ?
                                                <Mutation mutation={gql(create_product)} refetchQueries={[
                                                    {query: gql(productbyprops), variables: {}},
                                                    {query: gql(productbyprops), variables: {status: '1', recommend: 1}}
                                                ]}>
                                                    {(createproduct, {loading, error}) => {
                                                        if (loading)
                                                            return (
                                                                <div className="loading">
                                                                    <div className="align">
                                                                        <ActivityIndicator text="Loading..."
                                                                                           size="large"/>
                                                                    </div>
                                                                </div>
                                                            )
                                                        if (error)
                                                            return 'error'
                                                        let varObj = {
                                                            id,
                                                            unit: '1件',
                                                            status: '1',
                                                            recommend: 0,
                                                            category_id: category_id[0],
                                                            name,
                                                            stock,
                                                            intro,
                                                            price,
                                                            discountRate: 100,
                                                            createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                                                            updatedAt: ''
                                                        }
                                                        return (
                                                            <Button type="primary" size="small" inline onClick={() => {
                                                                Promise.all(this.uploadImg()).then(res => {
                                                                    let prefix = 'https://case-1254337200.cos.ap-beijing.myqcloud.com/'
                                                                    let img = imgDatas.length === 1 ? prefix + imgDatas[0]['file-name'] : imgDatas.map((imgData, index) => (
                                                                        prefix + imgDatas[index]['file-name']
                                                                    ))
                                                                    let variables = {...varObj}
                                                                    if (imgDatas.length !== 0) {
                                                                        variables.img = img
                                                                    }
                                                                    createproduct({variables})
                                                                })
                                                            }}>创建</Button>
                                                        )
                                                    }}
                                                </Mutation>
                                                :
                                                <div>
                                                    <Mutation mutation={gql(update_product)} refetchQueries={[
                                                        {query: gql(productbyprops), variables: {}},
                                                        {
                                                            query: gql(productbyprops),
                                                            variables: {status: '1', recommend: 1}
                                                        }
                                                    ]}>
                                                        {(updateproduct, {loading, error}) => {
                                                            if (loading)
                                                                return (
                                                                    <div className="loading">
                                                                        <div className="align">
                                                                            <ActivityIndicator text="Loading..."
                                                                                               size="large"/>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            if (error)
                                                                return 'error'
                                                            let varObj = {
                                                                id,
                                                                unit: '1件',
                                                                status: '1',
                                                                recommend: 0,
                                                                category_id: category_id[0],
                                                                name,
                                                                stock,
                                                                intro,
                                                                price,
                                                                updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
                                                            }
                                                            return (
                                                                <Button type="primary" size="small" inline
                                                                        onClick={() => {
                                                                            Promise.all(this.uploadImg()).then(res => {
                                                                                let prefix = 'https://case-1254337200.cos.ap-beijing.myqcloud.com/'
                                                                                let img = imgDatas.length === 1 ? prefix + imgDatas[0]['file-name'] : imgDatas.map((imgData, index) => (
                                                                                    prefix + imgDatas[index]['file-name']
                                                                                ))
                                                                                let variables = {...varObj}
                                                                                if (imgDatas.length !== 0) {
                                                                                    variables.img = img
                                                                                }
                                                                                updateproduct({variables})
                                                                            })
                                                                        }}>更新</Button>
                                                            )
                                                        }}
                                                    </Mutation>
                                                    <Mutation mutation={gql(delete_product_by_id)} refetchQueries={[
                                                        {query: gql(productbyprops), variables: {}},
                                                        {
                                                            query: gql(productbyprops),
                                                            variables: {status: '1', recommend: 1}
                                                        }
                                                    ]}>
                                                        {(deleteproduct, {loading, error}) => {
                                                            if (loading)
                                                                return (
                                                                    <div className="loading">
                                                                        <div className="align">
                                                                            <ActivityIndicator text="Loading..."
                                                                                               size="large"/>
                                                                        </div>
                                                                    </div>
                                                                )
                                                            if (error)
                                                                return 'error'
                                                            return (
                                                                <Button type="warning" size="small" inline
                                                                        style={{marginLeft: 10}} onClick={() => {
                                                                    deleteproduct({variables: {id}})
                                                                }}>删除</Button>
                                                            )
                                                        }}
                                                    </Mutation>
                                                </div>
                                        }
                                    </div>
                                </List>
                                <Modal
                                    popup
                                    visible={modal}
                                    onClose={this.controlModal(false)}
                                    animationType="slide-up"
                                    className='modify-goods-modal'
                                >
                                    <div className='close-popup' onClick={this.controlModal(false)}>X</div>
                                    <div style={{paddingTop: 52}}>
                                        <AddSpecStock specs={specs} productID={id}/>
                                    </div>
                                </Modal>
                            </div>
                        )
                    }
                }
            </Query>
        )
    }
}

class AddSpecStock extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: true,
            size: '',
            color: '',
            stock: 0,
            id: ''
        }
    }

    controlList = (bool, index) => () => {
        let {specs} = this.props
        this.setState({
            list: bool,
            index
        })
        if (index !== -1) {
            let {size, color, stock, id} = specs[index]
            this.setState({
                size,
                color,
                stock,
                id
            })
        } else {
            this.setState({
                size: '',
                color: '',
                stock: 20,
                id: idGen('spec')
            })
        }
    }

    render() {
        let {specs, productID} = this.props
        let {list, size, color, stock, id, index} = this.state
        return (
            <div>
                {
                    list ?
                        <List renderHeader={() => '规格设置'}>
                            {
                                specs.map((spec, index) => (
                                    <Item key={spec.id} arrow="horizontal"
                                          onClick={this.controlList(false, index)}>{spec.color} &nbsp; {spec.size}</Item>
                                ))
                            }
                            <Item arrow="horizontal" onClick={this.controlList(false, -1)}>新增规格</Item>
                        </List>
                        :
                        <List renderHeader={() => <div onClick={this.controlList(true, -1)}><Icon
                            type="left"/>&nbsp;点击返回规格列表</div>}>
                            <InputItem onChange={(e) => {
                                this.setState({size: e})
                            }} value={size} placeholder="请输入尺寸">尺寸</InputItem>
                            <InputItem onChange={(e) => {
                                this.setState({color: e})
                            }} value={color} placeholder="请输入颜色">颜色</InputItem>
                            <Item extra={<Stepper onChange={(e) => {
                                this.setState({stock: e})
                            }} value={stock} style={{width: '100%', minWidth: '100px'}} showNumber
                                                  size="small"/>}>库存</Item>
                            <div className='list-others'>
                                <div className='spec-button-group'>
                                    {
                                        index === -1?
                                            <Mutation mutation={gql(create_specificationStock)} refetchQueries={[
                                                {query: gql(specificationStock_by_props), variables: {product_id: productID}}
                                            ]}>
                                                {(createspecificationStock, {loading, error}) => {
                                                    if (loading)
                                                        return (
                                                            <div className="loading">
                                                                <div className="align">
                                                                    <ActivityIndicator text="Loading..." size="large"/>
                                                                </div>
                                                            </div>
                                                        )
                                                    if (error)
                                                        return 'error'
                                                    let varObj = {
                                                        id,
                                                        product_id: productID,
                                                        color,
                                                        size,
                                                        stock,
                                                        slideImg: [],
                                                        detailImg: [],
                                                        status: '1',
                                                        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                                                        updatedAt: ''
                                                    }
                                                    return (
                                                        <Button type="primary" size="small" inline
                                                                onClick={() => {
                                                                    createspecificationStock({variables: varObj})
                                                                }}>添加</Button>
                                                    )
                                                }}
                                            </Mutation>
                                            :
                                            <div>
                                                <Mutation mutation={gql(update_specificationStock)} refetchQueries={[
                                                    {query: gql(specificationStock_by_props), variables: {product_id: productID}}
                                                ]}>
                                                    {(updatespecificationStock, {loading, error}) => {
                                                        if (loading)
                                                            return (
                                                                <div className="loading">
                                                                    <div className="align">
                                                                        <ActivityIndicator text="Loading..."
                                                                                           size="large"/>
                                                                    </div>
                                                                </div>
                                                            )
                                                        if (error)
                                                            return 'error'
                                                        let varObj = {
                                                            id,
                                                            color,
                                                            size,
                                                            stock,
                                                            updatedAt: moment().format('YYYY-MM-DD HH:mm:ss')
                                                        }
                                                        return (
                                                            <Button type="primary" size="small" inline
                                                                    onClick={() => {
                                                                        updatespecificationStock({variables: varObj})
                                                                    }}>更新</Button>
                                                        )
                                                    }}
                                                </Mutation>
                                                <Mutation mutation={gql(delete_specificationStock)} refetchQueries={[
                                                    {query: gql(specificationStock_by_props), variables: {product_id: productID}},
                                                ]}>
                                                    {(deletespecificationStock, {loading, error}) => {
                                                        if (loading)
                                                            return (
                                                                <div className="loading">
                                                                    <div className="align">
                                                                        <ActivityIndicator text="Loading..." size="large"/>
                                                                    </div>
                                                                </div>
                                                            )
                                                        if (error)
                                                            return 'error'
                                                        return (
                                                            <Button type="warning" size="small" inline
                                                                    style={{marginLeft: 10}} onClick={() => {
                                                                deletespecificationStock({variables: {id}})
                                                            }}>删除</Button>
                                                        )
                                                    }}
                                                </Mutation>
                                            </div>
                                    }
                                </div>
                            </div>
                        </List>
                }
            </div>
        )
    }
}

export default withRouter(Goods)
