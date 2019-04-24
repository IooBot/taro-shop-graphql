import React, {Component} from 'react'
import Display from './display'
import Detail from "./detail"
import {withRouter, Route, Switch} from 'react-router-dom'

class Order extends Component {
    constructor(props) {
        super(props)
        this.state = {}
    }

    componentWillMount() {
        let {location} = this.props
        if (location && location.state) {
            if(['pay', 'ship', 'unbox', 'judge'].indexOf(location.state.kind)>-1) {
                this.props.history.replace({
                    pathname: '/my/order/display',
                    state: {
                        kind: location.state.kind
                    }
                })
            } else {
                this.props.history.push({
                    pathname: '/my/order/detail',
                    state: {}
                })
            }
        }
    }

    render() {
        return (
            <div className='order-wrap'>
                <Switch>
                    <Route path="/my/order/display" component={Display}/>
                    <Route path="/my/order/detail" component={Detail}/>
                    <Route path="/my/order/*" component={Display}/>
                </Switch>
            </div>
        )
    }
}

export default withRouter(Order)