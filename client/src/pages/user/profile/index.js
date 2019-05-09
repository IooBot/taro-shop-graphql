import React, {Component} from 'react'
import './index.css'
import {NavBar, Icon, InputItem, List, Button, ActivityIndicator} from 'antd-mobile'
import {withRouter} from 'react-router-dom'
import {Mutation} from "react-apollo"
import {update_user, user_by_id} from "../../../utils/gql"
import gql from "graphql-tag"
import {getCookie} from "../../../utils/cookie"

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: ''
        }
    }

    render() {
        let {username} = this.state
        let user_id = getCookie('user_id')
        return (
            <div>
                <div className='profile-navbar-wrap'>
                    <NavBar
                        className='profile-navbar'
                        mode="light"
                        icon={<Icon type="left"/>}
                        onLeftClick={() => {
                            this.props.history.push({
                                pathname: '/my'
                            })
                        }}
                    >我的信息</NavBar>
                </div>

                <Mutation
                    mutation={gql(update_user)}
                    refetchQueries={[{query: gql(user_by_id), variables: {id: user_id}}]}
                >
                    {(update_user, {loading, error}) => {
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
                            <div>
                                <List renderHeader={() => '修改个人信息'} className="my-list">
                                    <InputItem onChange={(e) => {
                                        this.setState({username: e})
                                    }} value={username} placeholder="请输入昵称">昵称</InputItem>
                                </List>
                                <Button onClick={() => {
                                    console.log(username)
                                    console.log(user_id)
                                    update_user({variables: {id: user_id, username}})
                                }}>确认</Button>
                            </div>
                        )
                    }}
                </Mutation>
            </div>
        )
    }
}

export default withRouter(Profile)