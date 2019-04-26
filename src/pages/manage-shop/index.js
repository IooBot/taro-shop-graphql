import React, {Component} from 'react'
import './index.css'
import {NavBar, Icon} from 'antd-mobile'
import {withRouter} from 'react-router-dom'
import {ActivityIndicator, List, ImagePicker, InputItem, Button} from 'antd-mobile'
import axios from 'axios'
import {Query, Mutation} from "react-apollo"
import gql from "graphql-tag"
import {shop_by_props, create_shop, update_shop} from "../../../../utils/gql"
import {storeFile} from "../../../../configs/url"
import moment from 'moment'
import {findMany} from "../../utils/crud";

const Item = List.Item

class Shop extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }
  componentDidMount() {
    let shopData = findMany({collection:"shop",condition:{limit: 1}});//,fields:[]
    userAddressData.then(res =>{
      console.log('userAddressData',res)
      this.setState({
        loaded: true,
        shop:res,
        shopLength: res.length
      });
    })
  }
    render() {
        return (
            <div className='shop-wrap'>
                <NavBar
                    className='navbar'
                    mode="light"
                    icon={<Icon type="left"/>}
                    onLeftClick={() => {
                        this.props.history.go(-2)
                    }}
                >店铺管理</NavBar>
                <Query query={gql(shop_by_props)} variables={{limit: 1}}>
                    {
                        ({loading, error, data}) => {
                            if (loading) {
                                return (
                                    <div className="loading">
                                        <div className="align">
                                            <ActivityIndicator text="Loading..." size="large"/>
                                        </div>
                                    </div>
                                )
                            }

                            if (error) {
                                return 'error!'
                            }

                            let shop, newShop
                            let shopLength = data.shopbyprops.length
                            if (shopLength === 0) {
                                // console.log('尚未个性化 shop');
                                shop = {}
                                newShop = true
                            } else if (shopLength === 1) {
                                // console.log('存在 shop, update');
                                shop = data.shopbyprops[0]
                                newShop = false
                            } else {
                                console.log('store 数据库出现错误')
                            }

                            let {name, description, address, intro, notice, slideshow, id} = shop
                            let shopID = newShop ? 'default' : id
                            return (
                                <ShopRender
                                    name={name}
                                    description={description}
                                    address={address}
                                    intro={intro}
                                    slideshow={slideshow}
                                    notice={notice}
                                    newShop={newShop}
                                    shopID={shopID}
                                />
                            )
                        }
                    }
                </Query>
            </div>
        )
    }
}

class ShopRender extends Component {
    constructor(props) {
        super(props)
        this.state = {
            files: [],
            imgDatas: [],
            name: props.name,
            intro: props.intro,
            description: props.description,
            address: props.address,
            notice: props.notice,
            slideshow: props.slideshow,
            shopID: props.shopID
        }
    }

    onChange = (files, operationType) => {
        console.log("files", files, "operationType", operationType)

        let imgDatas = []
        let {shopID} = this.state

        files.forEach((file, index) => {
            let base64Cont = files[index].url.split(',')[1]
            let imgType = files[index].file.type.split('/')[1]
            let imgNewName = `slideshow_${index}_shopID_${shopID}.${imgType}`

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

        console.log(imgDatas, 'imgDatas')
    }

    onReset = () => {
        this.setState({
            files: [],
            imgDatas: [],
            name: '',
            intro: '',
            description: '',
            address: '',
            notice: '',
            slideshow: []
        })
    }

    render() {
        let {files, name, intro, description, address, notice, slideshow, imgDatas} = this.state
        let {newShop, shopID} = this.props
        return (
            <div className='shop-wrapper content-wrap'>
                <List renderHeader={() => '店铺个性化管理'} className="my-list">
                    <InputItem onChange={(e) => {
                        this.setState({name: e})
                    }} value={name} placeholder="请输入名称">名称</InputItem>
                    <InputItem onChange={(e) => {
                        this.setState({intro: e})
                    }} value={intro} placeholder="请输入简介">简介</InputItem>
                    <InputItem onChange={(e) => {
                        this.setState({description: e})
                    }} value={description} placeholder="请输入描述">描述</InputItem>
                    <InputItem onChange={(e) => {
                        this.setState({address: e})
                    }} value={address} placeholder="请输入地址">地址</InputItem>
                    <InputItem onChange={(e) => {
                        this.setState({notice: e})
                    }} value={notice} placeholder="不输入或留空则不显示">通告</InputItem>
                    <div className='my-list-subtitle'>首页轮播图</div>
                    <ImagePicker
                        files={files}
                        onChange={this.onChange}
                        onImageClick={(index, fs) => console.log(index, fs)}
                        selectable={true}
                        multiple={true}
                    />
                    <Item>
                        {
                            newShop ?
                                <CreateShopButton
                                    shopID={shopID}
                                    imgDatas={imgDatas}
                                    name={name}
                                    description={description}
                                    address={address}
                                    alert={alert}
                                    slideshow={slideshow}
                                    notice={notice}
                                    intro={intro}
                                />
                                :
                                <UpdateShopButton
                                    shopID={shopID}
                                    imgDatas={imgDatas}
                                    name={name}
                                    description={description}
                                    address={address}
                                    alert={alert}
                                    slideshow={slideshow}
                                    notice={notice}
                                    intro={intro}
                                />
                        }
                        <Button size="small" inline style={{marginLeft: '2.5px'}} onClick={this.onReset}>重置</Button>
                    </Item>
                </List>
            </div>
        )
    }
}

class UpdateShopButton extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    uploadImg = () => {
        let {imgDatas} = this.props

        return imgDatas.map((imgData) => (
            axios({
                url: storeFile,
                method: 'post',
                data: imgData
            })
        ))
    }

    render() {
        let {name, description, address, intro, notice, imgDatas, shopID} = this.props
        return (
            <Mutation
                mutation={gql(update_shop)}
                refetchQueries={[{query: gql(shop_by_props), variables: {}}]}
            >
                {(updatestore, {loading, error}) => {
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
                        id: shopID,
                        name,
                        description,
                        address,
                        intro,
                        notice,
                        updatedAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                    }
                    return (
                        <Button type="primary" size="small" inline onClick={() => {
                            if (imgDatas.length !== 0) {
                                Promise.all(this.uploadImg()).then(res => {
                                    let prefix = 'https://case-1254337200.cos.ap-beijing.myqcloud.com/'
                                    let slideshow = imgDatas.length === 1 ? prefix + imgDatas[0]['file-name'] : imgDatas.map((imgData, index) => (
                                        prefix + imgDatas[index]['file-name']
                                    ))
                                    updatestore({variables: {...varObj, slideshow}})
                                })
                            } else {
                                updatestore({variables: varObj})
                            }
                        }}>更新</Button>
                    )
                }}
            </Mutation>
        )
    }
}

class CreateShopButton extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    uploadImg = () => {
        let {imgDatas} = this.props

        return imgDatas.map((imgData) => (
            axios({
                url: storeFile,
                method: 'post',
                data: imgData
            })
        ))
    }

    render() {
        let {name, description, address, intro, notice, imgDatas, shopID} = this.props
        return (
            <Mutation
                mutation={gql(create_shop)}
                refetchQueries={[{query: gql(shop_by_props), variables: {}}]}
            >
                {(createstore, {loading, error}) => {
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
                        id: shopID,
                        name: name ? name : '',
                        description: description ? description : '',
                        address: address ? address : '',
                        intro: intro ? intro : '',
                        notice: notice ? notice : '',
                        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
                        updatedAt: ''
                    }
                    return (
                        <Button type="primary" size="small" inline onClick={() => {
                            Promise.all(this.uploadImg()).then(res => {
                                let prefix = 'https://case-1254337200.cos.ap-beijing.myqcloud.com/'
                                let slideshow = imgDatas.length === 1 ? prefix + imgDatas[0]['file-name'] : imgDatas.map((imgData, index) => (
                                    prefix + imgDatas[index]['file-name']
                                ))
                                createstore({variables: {...varObj, slideshow}})
                            })
                        }}>创建</Button>
                    )
                }}
            </Mutation>
        )
    }
}

export default withRouter(Shop)
