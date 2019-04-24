import React, {Component} from 'react'
import {withRouter} from 'react-router-dom'
import {message} from 'antd'
import {Checkbox, WhiteSpace, Modal} from 'antd-mobile'
import classNames from 'classnames'
import {Mutation} from "react-apollo"
import gql from "graphql-tag"
import moment from 'moment'
import debounce from 'lodash.debounce'

import '../index.css'
import {delete_userCart_by_id, update_userCart} from "../../../../utils/gql"
const alert = Modal.alert

message.config({
    top: '45%',
    duration: 2,
    maxCount: 2,
})

class CartEdit extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isSelectAll:false,
            selectedCount:0
        }
        this.updateCartProductCount = debounce(this.updateCartProductCount, 5000)
    }

    //获取数据
    componentWillMount(){
        this.setState({
            cartList:this.props.cartList
        },()=>{
            this.checkedAll('',false)
        })

    }

    // 判断数量update类型
    handleChangedCount = (e,type,i,updateCount) => {
        e.persist()
        let result
        switch (type) {
            case 'augment':
                result = this.augment(e,i)
                break
            case  'input':
                result = this.getInputValue(e,i)
                break
            case 'reduce':
                result = this.reduce(e,i)
                break
            default:
                console.log('handleChangedCount type error')
                break
        }

        if(result.id) {
            let {id, count} = result
            this.updateCartProductCount(id, count, updateCount)
        }
    }

    // 使用函数防抖5s后请求更新数量
    updateCartProductCount = (id,count,updateCount) => {
        // console.log('updateCartProductCount id count',id,count)
        let updatedAt = moment().format('YYYY-MM-DD HH:mm:ss')
        const update = {
            id,
            count,
            updatedAt
        }
        updateCount({variables:update})
    }

    //获取输入框的值
    getInputValue = (e,i) =>{
        let id = '', count = 0
        this.setState({
            cartList:this.state.cartList.map((item,index)=>{
                if(index===i){
                    item.count = e.target.value
                    id = item.id
                    count = item.count
                    return item
                }else {
                    return item
                }
            })
        })
        this.sumCount()
        return {
            id, count
        }
    }

    // 增加
    augment = (e,i) =>{
        let id = '', count = 0
        this.setState({
            cartList:this.state.cartList.map((item,index)=>{
                if(index===i){
                    item.count = item.count*1 + 1
                    id = item.id
                    count = item.count
                    return item
                }else {
                    return item
                }
            })
        })
        this.sumCount()
        return {
            id, count
        }
    }

    // 减少
    reduce = (e,i) => {
        let id = '', count = 0
        this.setState({
            cartList:this.state.cartList.map((item,index)=>{
                if(index===i){
                    item.count = item.count*1 - 1
                    id = item.id
                    count = item.count
                    return item
                }else {
                    return item
                }
            })
        })
        this.sumCount()
        return {
            id, count
        }
    }

    // 删除
    delete=(delete_userCart_by_id)=>{
        let {cartList, selectedCount} = this.state

        alert('', `确定要删除这${selectedCount}种商品吗？`, [
            { text: '取消', onPress: () => console.log('cancel') },
            {
                text: '确定',
                onPress: () => {
                    let deleteList = cartList.filter((item)=> item.checked === true)
                    let cartList1 = cartList.filter((item)=> item.checked === false)

                    let deleteIdList = deleteList.map(item => item.id)
                    // console.log('delete list',deleteIdList)

                    delete_userCart_by_id({variables:{id:deleteIdList}}).then((data)=>{
                        // console.log('delete data',data)
                        let num = data.data.delete_userCart.replace(/[^0-9]/ig,"")
                        if(num){
                            message.success('删除成功')
                            let cartCount = JSON.parse(localStorage.getItem("cartCount")) - num
                            localStorage.setItem("cartCount",JSON.stringify(cartCount))

                            this.setState({
                                cartList:cartList1,
                                selectedCount:0
                            })
                        }
                    })
                }
            }
        ])
    }

    //删除单个备用
    del=(e,i)=> {
        this.setState({
            cartList:this.state.cartList.filter((item,index)=>{
                if(index!==i){
                    return true
                }else {
                    return false
                }
            })
        })
        setTimeout(()=>{
            this.sumCount()
        },1)
    }

    // 改变选择
    changeCheckedStatus=(e,i)=>{
        this.setState({
            cartList:this.state.cartList.map((item,index)=>{
                if(index===i){
                     item.checked=! item.checked
                }
                return  item
            })
        })

        let flag = this.state.cartList.every((item,index)=>{
            if( item.checked===false) {
                return false
            }else {
                return true
            }
        })

        if(flag===true){
            this.setState({isSelectAll:true})
        }else {
            this.setState({isSelectAll:false})
        }
        this.sumCount()
    }

    //全选或全不选,判断全选状态
    checkedAll=(e,check)=>{
        let checked = e.target ? e.target.checked : check

        if(checked===true){
            this.setState({
                cartList:this.state.cartList.map(( item,index)=>{
                     item.checked=true
                    return  item
                }),
                isSelectAll:true
            })
        }else  if(checked===false){
            this.setState({
                cartList:this.state.cartList.map((item,index)=>{
                     item.checked=false
                    return item
                }),
                isSelectAll:false
            })
        }
        this.sumCount()
    }

    //计算总合计
    sumCount=()=>{
        let {cartList} = this.state
        let selectedCount=0, cartCount=0
        let cartListLength = cartList.length

        cartList.forEach((item,index)=>{
            cartCount+=item.count
            if(item.checked===true){
                selectedCount+=item.count
            }
            if(index === cartListLength - 1){
                localStorage.setItem("cartCount",JSON.stringify(cartCount))
                this.setState({
                    selectedCount
                })
            }
        })
    }

    skipToProductDetail = (e,productId) => {
        e.preventDefault()
        this.props.history.push({
            pathname: '/home/detail',
            state: {
                id:productId
            }
        })
    }

    render() {
        let {cartList, isSelectAll, selectedCount} = this.state
        let listLength = cartList.length

        return (
            <Mutation mutation={gql(delete_userCart_by_id)}
                      onCompleted={()=>{this.props.refetch()}}
                      onError={error=>console.log('error',error)}
            >
                {(delete_userCart_by_id,{ loading, error }) => (
                    <div className="cart-content-wrap">
                        <div className='cart-content'>
                            {
                                cartList.map((item,index)=>{
                                    return(
                                        <div key={item.id+'edit'}>
                                            <div className="cart-list">
                                                <div className="cart-list-checkbox">
                                                    <Checkbox
                                                        style={{marginLeft:15}}
                                                        checked={item.checked}
                                                        onChange={(e)=>{this.changeCheckedStatus(e,index)}}
                                                    />
                                                </div>
                                                <div className="cart-list-image" onClick={(e)=>this.skipToProductDetail(e,item.product_id.id)}>
                                                    <img src={item.product_id.img || "https://gw.alipayobjects.com/zos/rmsportal/nywPmnTAvTmLusPxHPSu.png"} alt=""/>
                                                </div>
                                                <div className="cart-list-intro" onClick={(e)=>this.skipToProductDetail(e,item.product_id.id)}>
                                                    <div>{item.product_id.name}</div>
                                                    <div>{item.specificationStock_id.color}  {item.specificationStock_id.size}</div>
                                                    <div className='product-item-price'>
                                                        <span>￥{(item.product_id.price*item.product_id.discountRate/100).toFixed(2)}</span>&nbsp;
                                                        <span>￥{(item.product_id.price).toFixed(2)}</span>
                                                    </div>
                                                </div>
                                                <div className="cart-list-count">
                                                    <Mutation mutation={gql(update_userCart)}
                                                              onError={error=>console.log('error',error)}
                                                    >
                                                        {(update_userCart,{ loading, error }) => (
                                                            <div className="selected">
                                                                <button
                                                                    className={classNames({
                                                                        'selected_button-white': true,
                                                                        'selected_button-disabled': item.count <= 1
                                                                    })}
                                                                    // disabled={item.count <= 1}
                                                                    onClick={(e)=>{
                                                                        if(item.count > 1){
                                                                            this.handleChangedCount(e,'reduce',index,update_userCart)
                                                                        }else {
                                                                            message.warning('数量不能小于1个')
                                                                        }
                                                                    }}
                                                                >-</button>
                                                                <input className="selected_input" type="text"
                                                                       min={1} step={1} max={item.specificationStock_id.stock}
                                                                       value={item.count}
                                                                       onChange={(e)=>{this.handleChangedCount(e,'input',index,update_userCart)}}
                                                                />
                                                                <button className="selected_button-white" onClick={(e)=>{this.handleChangedCount(e,'augment',index,update_userCart)}}>+</button>
                                                            </div>
                                                        )}
                                                    </Mutation>
                                                </div>
                                            </div>
                                            <WhiteSpace size="md" />
                                        </div>
                                    )
                                })
                            }
                        </div>
                        {
                            listLength ?
                                <div className="footer">
                                    <div className="jiesuan">
                                        <div className="jiesuan-checkbox">
                                            <Checkbox
                                                checked={isSelectAll}
                                                onChange={(e)=>{this.checkedAll(e,'')}}
                                                style={{marginLeft:15}}
                                            />
                                            <span className="jiesuan-checkbox_label">全选</span>
                                        </div>
                                        <div className="jiesuan-total">
                                        </div>
                                        <button
                                            className={classNames({
                                                'jiesuan-button': true,
                                                'jiesuan-disabled': !selectedCount
                                            })}
                                            onClick={()=>{
                                                if(selectedCount){
                                                    this.delete(delete_userCart_by_id)
                                                }else {
                                                    message.warning('请选择商品！')
                                                }
                                            }}
                                        >
                                            <span>删除({selectedCount})</span>
                                        </button>
                                    </div>
                                </div>:''
                        }
                    </div>
                )}
            </Mutation>
        )
    }
}

export default withRouter(CartEdit)