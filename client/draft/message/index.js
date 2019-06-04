import {Component} from "react"
import React from "react"
import {NavBar, Icon} from 'antd-mobile'

class Message extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <div>
                <div className='navbar'>
                    <NavBar
                        mode="light"
                        icon={<Icon type="left"/>}
                        onLeftClick={() => {
                            this.props.history.go(-2)
                        }}
                    >系统消息</NavBar>
                </div>
            </div>
        )
    }
}

export default Message