import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {Query} from "react-apollo"
import gql from "graphql-tag"
// import {Input} from 'antd'
import {NavBar, Icon, ActivityIndicator, Grid} from 'antd-mobile'

import {productbyprops} from "../../../utils/gql"
import './index.css'

// const Search = Input.Search

class Kind extends Component {
    constructor(props) {
        super(props)
        this.state = {
            id: '',
            category:'商品列表'
        }
    }

    componentWillMount() {
        let {location} = this.props
        if(location && location.state) {
            let {id, category} = location.state
            this.setState({
                id,
                category
            })
        }
    }

    render() {
        let {id, category} = this.state
        let contentHeight = window.innerHeight - 45
        return (
            <div className='kind-wrap'  style={{height: contentHeight}}>
                <div className='kind-navbar-wrap'>
                    <NavBar
                        className='kind-navbar'
                        mode="light"
                        icon={<Icon type="left"/>}
                        onLeftClick={() => {this.props.history.go(-1)}}
                    >{category}</NavBar>
                </div>
                {/*<div className='kind-search-wrap'>*/}
                    {/*<Search*/}
                        {/*className='kind-search'*/}
                        {/*placeholder="请输入搜索内容"*/}
                        {/*onSearch={value => console.log(value)}*/}
                    {/*/>*/}
                {/*</div>*/}
                <Query query={gql(productbyprops)} variables={{category_id: id}}>
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
                            return (
                                <KindRender
                                    data={data.productbyprops}
                                    history={this.props.history}
                                />
                            )
                        }
                    }
                </Query>
            </div>
        )
    }
}

export default withRouter(Kind)

class KindRender extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        let {data} = this.props

        return (
            <div className='kind-wrapper'>
                {
                    data.length === 0?
                        <div className="kind-empty">
                            <div>即将上新</div>
                            <div>
                                <button className="empty-button"
                                        style={{width:130, padding:'5px 10px'}}
                                        onClick={() => {
                                            this.props.history.push({
                                                pathname: `/`
                                            })
                                        }}>
                                    先逛逛其他商品
                                </button>
                            </div>
                        </div>
                        :
                        <Grid data={data}
                              columnNum={2}
                              hasLine={false}
                              onClick={(product) => {
                                  this.props.history.push({
                                      pathname: '/home/detail',
                                      state: {
                                          id: product.id
                                      }
                                  })
                              }}
                              renderItem={dataItem => (
                                  <div key={dataItem.id} className='product-item'>
                                      <div className='product-item-img'
                                           style={{backgroundImage: "url('" + dataItem.img + "')"}}/>
                                      <div className='product-item-description'>
                                          <div className='product-item-name'>{dataItem.name}</div>
                                          <div className='product-item-price'>
                                              <span>￥{dataItem.price}</span>&nbsp;
                                              <span>￥{dataItem.price}</span>
                                          </div>
                                      </div>
                                  </div>
                              )}
                        />
                }
            </div>
        )
    }
}