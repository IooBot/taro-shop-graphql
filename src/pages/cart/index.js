import React, {Component} from 'react'
import {NavBar, ActivityIndicator} from 'antd-mobile'
import {Query} from "react-apollo"
import gql from "graphql-tag"

import CartDetail from "./detail"
import CartEdit from "./edit"
import Empty from "./empty"
import {cart_by_userid} from "../../../utils/gql"
import {getCookie} from "../../../utils/cookie"
import './index.css'

class All extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 'detail',
            updateData:false
        }
    }

    componentWillMount() {
        // console.log('cartAll componentWillMount',this.props,this.state)
        this.getHash()
    }

    componentDidMount() {
        // console.log('cartAll componentDidMount',this.props,this.state)
        let state = this.props.history.location.state
        let updateData = state ? state.updateData : false

        if(updateData){
            this.setState({
                updateData
            })
        }
    }

    getHash = () => {
        // console.log('location', window.location.hash)
        let hash = window.location.hash || '#tab=cart&page=detail'
        let page = 'detail'
        if (window.location.hash && hash.indexOf("&") > 0) {
            let pageHash = hash.split("&")[1]
            page = pageHash.substr(pageHash.indexOf("=") + 1)
        }
        this.setState({
            page
        })
    }

    changeCartPage = () => {
        this.setState((preState) => ({
            page: preState.page === 'detail' ? 'edit' : 'detail'
        }))
    }

    renderPage = (data, refetch) => {
        let {page,updateData} = this.state

        switch (page) {
            case 'detail':
                return <CartDetail cartList={data.cartList} refetch={refetch} updateData={updateData}/>
            case 'edit':
                return <CartEdit cartList={data.cartList} refetch={refetch}/>
            default:
                return <div>test</div>
        }
    }

    render() {
        let {page} = this.state
        let user_id = getCookie('user_id')
        // console.log('render',page,this.props)

        return (
            <Query query={gql(cart_by_userid)} variables={{user_id}}>
                {
                    ({loading, error, data, refetch}) => {
                        if (loading) {
                            return (
                                <div className="loading-center">
                                    <ActivityIndicator size="large"/>
                                    <span>加载中...</span>
                                </div>
                            )
                        }
                        if (error) {
                            return 'error!'
                        }
                        // console.log('cart all data',data)

                        return (
                            <div className='cart-wrap'>
                                <div className='cart-navbar-wrap navbar'>
                                    <NavBar
                                        mode="light"
                                        rightContent={[
                                            data.cartList.length ?
                                                <span className='navbar-button' key={"cart-navbar"} onClick={this.changeCartPage}>
                                                {page === 'detail' ? "编辑" : "完成"}
                                            </span> : ''
                                        ]}
                                    >购物袋
                                    </NavBar>
                                </div>
                                {data.cartList.length ?
                                    this.renderPage(data, refetch) : <Empty/>
                                }
                            </div>
                        )
                    }
                }
            </Query>
        )
    }
}

export default All