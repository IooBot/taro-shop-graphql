import * as QL from 'shortql/graphql_cache.core';

function deleteEmptyProperty(object){
  for (var i in object) {
    var value = object[i];
    // console.log('typeof object[' + i + ']', (typeof value));
    if (!value) {
      delete object[i];
    }
    if(typeof value === 'string') {
      if(value == '') {
        delete object[i];
      }
    }
  }
  return object;
}

export async function queryCategory (params) {
  return QL.find_many('category', deleteEmptyProperty(params), [  "value:name", "image:img",  'id',   'order',  'status',  'createdAt',  'updatedAt']);
}
export async function queryOneCategory (params) {
  return QL.find_one('category', params, [  'name',  'id',  'img',  'order',  'status',  'createdAt',  'updatedAt',  'product.recommend',  'product.updatedAt',  'product.unit',  'product.name',  'product.createdAt',  'product.status',  'product.id',  'product.intro',  'product.discountRate',  'product.price',  'product.img',  'product.stock',  ]);
}
export async function createCategory (params) {
  return QL.insert('category', deleteEmptyProperty(params), ['result']);
}
export async function updateCategory ({ condition, data}) {
  return QL.update('category', condition, deleteEmptyProperty(data) , ['result']);
}
export async function deleteCategory (params) {
  return QL.remove('category', params, ['result']);
}
export async function queryUsercart (params) {
  return QL.find_many('userCart', deleteEmptyProperty(params), [  'count',  'id',  'createdAt',  'updatedAt', "product{id, img, intro, name, price, status, stock, unit, discountRate}", "specificationStock_id{id, color, size, stock, status}" ]);
}
export async function queryOneUsercart (params) {
  return QL.find_one('userCart', params, [  'count',  'id',  'createdAt',  'updatedAt']);
}
export async function createUsercart (params) {
  return QL.insert('userCart', deleteEmptyProperty(params), ['result']);
}
export async function updateUsercart ({ condition, data}) {
  return QL.update('userCart', condition, deleteEmptyProperty(data) , ['result']);
}
export async function deleteUsercart (params) {
  return QL.remove('userCart', params, ['result']);
}
export async function queryOrderproduct (params) {
  return QL.find_many('orderProduct', deleteEmptyProperty(params), [  'orderPay_id',  'productPay',  'count',  'id',  'productPrice',  'updatedAt',  'productColor',  'unit',  'productSize',  'orderPay',  'createdAt',  'productImg',  'productName', 'product{id, unit, img, intro, name, price, status, stock, unit, discountRate}']);
}
export async function queryOneOrderproduct (params) {
  return QL.find_one('orderProduct', params, [  'orderPay_id',  'productPay',  'count',  'id',  'productPrice',  'updatedAt',  'productColor',  'unit',  'productSize',  'orderPay',  'createdAt',  'productImg',  'productName',  'specificationStock_id.updatedAt',  'specificationStock_id.color',  'specificationStock_id.createdAt',  'specificationStock_id.size',  'specificationStock_id.slideImg',  'specificationStock_id.status',  'specificationStock_id.id',  'specificationStock_id.detailImg',  'specificationStock_id.stock',  'product.recommend',  'product.updatedAt',  'product.unit',  'product.name',  'product.createdAt',  'product.status',  'product.id',  'product.intro',  'product.discountRate',  'product.price',  'product.img',  'product.stock',  'order.remark',  'order.updatedAt',  'order.orderLogistics_id',  'order.orderTotalPay',  'order.createdAt',  'order.orderStatus',  'order.id',  'order.count',  'order.productTotalPay',  'order.orderPay_id',  'user.email',  'user.updatedAt',  'user.password',  'user.telephone',  'user.username',  'user.createdAt',  'user.id',  'user.userData_id',  ]);
}
export async function createOrderproduct (params) {
  return QL.insert('orderProduct', deleteEmptyProperty(params), ['result']);
}
export async function updateOrderproduct ({ condition, data}) {
  return QL.update('orderProduct', condition, deleteEmptyProperty(data) , ['result']);
}
export async function deleteOrderproduct (params) {
  return QL.remove('orderProduct', params, ['result']);
}
export async function queryShop (params) {
  return QL.find_many('shop', deleteEmptyProperty(params), [  'description',  'address',  'updatedAt',  'telephone',  'name',  'createdAt',  'status',  'id',  'slideshow',  'notice',  'intro',  'img',  ]);
}
export async function queryOneShop (params) {
  return QL.find_one('shop', params, [  'description',  'address',  'updatedAt',  'telephone',  'name',  'createdAt',  'status',  'id',  'slideshow',  'notice',  'intro',  'img',  ]);
}
export async function createShop (params) {
  return QL.insert('shop', deleteEmptyProperty(params), ['result']);
}
export async function updateShop ({ condition, data}) {
  return QL.update('shop', condition, deleteEmptyProperty(data) , ['result']);
}
export async function deleteShop (params) {
  return QL.remove('shop', params, ['result']);
}
export async function queryPayrecord (params) {
  return QL.find_many('payRecord', deleteEmptyProperty(params), [  'cash_fee',  'openid',  'total_fee',  'time',  'trade_no',  'transaction_id',  'user.email',  'user.updatedAt',  'user.password',  'user.telephone',  'user.username',  'user.createdAt',  'user.id',  'user.userData_id',  ]);
}
export async function queryOnePayrecord (params) {
  return QL.find_one('payRecord', params, [  'cash_fee',  'openid',  'total_fee',  'time',  'trade_no',  'transaction_id',  'user.email',  'user.updatedAt',  'user.password',  'user.telephone',  'user.username',  'user.createdAt',  'user.id',  'user.userData_id',  ]);
}
export async function createPayrecord (params) {
  return QL.insert('payRecord', deleteEmptyProperty(params), ['result']);
}
export async function updatePayrecord ({ condition, data}) {
  return QL.update('payRecord', condition, deleteEmptyProperty(data) , ['result']);
}
export async function deletePayrecord (params) {
  return QL.remove('payRecord', params, ['result']);
}
export async function queryOrderlogistic (params) {
  return QL.find_many('orderLogistic', deleteEmptyProperty(params), [  'consigneeName',  'deliveryTime',  'serviceStore',  'updatedAt',  'logisticsFee',  'expressId',  'createdAt',  'consigneeTel',  'id',  'expressName',  'consignAddress',  'LogisticsStatus',  'order.remark',  'order.updatedAt',  'order.orderLogistics_id',  'order.orderTotalPay',  'order.createdAt',  'order.orderStatus',  'order.id',  'order.count',  'order.productTotalPay',  'order.orderPay_id',  'user.email',  'user.updatedAt',  'user.password',  'user.telephone',  'user.username',  'user.createdAt',  'user.id',  'user.userData_id',  ]);
}
export async function queryOneOrderlogistic (params) {
  return QL.find_one('orderLogistic', params, [  'consigneeName',  'deliveryTime',  'serviceStore',  'updatedAt',  'logisticsFee',  'expressId',  'createdAt',  'consigneeTel',  'id',  'expressName',  'consignAddress',  'LogisticsStatus',  'order.remark',  'order.updatedAt',  'order.orderLogistics_id',  'order.orderTotalPay',  'order.createdAt',  'order.orderStatus',  'order.id',  'order.count',  'order.productTotalPay',  'order.orderPay_id',  'user.email',  'user.updatedAt',  'user.password',  'user.telephone',  'user.username',  'user.createdAt',  'user.id',  'user.userData_id',  ]);
}
export async function createOrderlogistic (params) {
  return QL.insert('orderLogistic', deleteEmptyProperty(params), ['result']);
}
export async function updateOrderlogistic ({ condition, data}) {
  return QL.update('orderLogistic', condition, deleteEmptyProperty(data) , ['result']);
}
export async function deleteOrderlogistic (params) {
  return QL.remove('orderLogistic', params, ['result']);
}
export async function queryProduct (params) {
  return QL.find_many('product', deleteEmptyProperty(params), [  'stock',  'img',  'price',  'discountRate',  'intro',  'id',  'status',  'createdAt',  'name',  'unit',  'updatedAt',  'recommend' , "category.name"]);
}
export async function queryOneProduct (params) {
  return QL.find_one('product', params, [  'stock',  'img',  'price',  'discountRate',  'intro',  'id',  'status',  'createdAt',  'name',  'unit',  'updatedAt',  'recommend'  ]);
}
export async function createProduct (params) {
  return QL.insert('product', deleteEmptyProperty(params), ['result']);
}
export async function updateProduct ({ condition, data}) {
  return QL.update('product', condition, deleteEmptyProperty(data) , ['result']);
}
export async function deleteProduct (params) {
  return QL.remove('product', params, ['result']);
}
export async function querySlideshow (params) {
  return QL.find_many('slideshow', deleteEmptyProperty(params), [  'updatedAt',  'createdAt',  'status',  'img',  'id',  'name',  ]);
}
export async function queryOneSlideshow (params) {
  return QL.find_one('slideshow', params, [  'updatedAt',  'createdAt',  'status',  'img',  'id',  'name',  ]);
}
export async function createSlideshow (params) {
  return QL.insert('slideshow', deleteEmptyProperty(params), ['result']);
}
export async function updateSlideshow ({ condition, data}) {
  return QL.update('slideshow', condition, deleteEmptyProperty(data) , ['result']);
}
export async function deleteSlideshow (params) {
  return QL.remove('slideshow', params, ['result']);
}
export async function queryOrder (params) {
  return QL.find_many('order', deleteEmptyProperty(params), [  'orderPay_id',  'productTotalPay',  'count',  'id',  'orderStatus',  'createdAt',  'orderTotalPay',  'orderLogistics_id',  'updatedAt',  'remark',  'user_id.id']);
}
export async function queryOneOrder (params) {
  return QL.find_one('order', params, [  'orderPay_id',  'productTotalPay',  'count',  'id',  'orderStatus',  'createdAt',  'orderTotalPay',  'orderLogistics_id',  'updatedAt',  'remark',  'orderlogistic.deliveryTime',  'orderlogistic.serviceStore',  'orderlogistic.updatedAt',  'orderlogistic.logisticsFee',  'orderlogistic.expressId',  'orderlogistic.createdAt',  'orderlogistic.consigneeTel',  'orderlogistic.id',  'orderlogistic.expressName',  'orderlogistic.consignAddress',  'orderlogistic.LogisticsStatus',  'orderlogistic.consigneeName',  'orderproduct.updatedAt',  'orderproduct.productColor',  'orderproduct.unit',  'orderproduct.productSize',  'orderproduct.orderPay',  'orderproduct.createdAt',  'orderproduct.productImg',  'orderproduct.productName',  'orderproduct.productPrice',  'orderproduct.id',  'orderproduct.count',  'orderproduct.productPay',  'orderproduct.orderPay_id',  'userAddress_id.address',  'userAddress_id.updatedAt',  'userAddress_id.telephone',  'userAddress_id.default',  'userAddress_id.city',  'userAddress_id.username',  'userAddress_id.postcode',  'userAddress_id.createdAt',  'userAddress_id.deletedAt',  'userAddress_id.id',  'userAddress_id.area',  'userAddress_id.province',  'user.email',  'user.updatedAt',  'user.password',  'user.telephone',  'user.username',  'user.createdAt',  'user.id',  'user.userData_id',  ]);
}
export async function createOrder (params) {
  return QL.insert('order', deleteEmptyProperty(params), ['result']);
}
export async function updateOrder ({ condition, data}) {
  return QL.update('order', condition, deleteEmptyProperty(data) , ['result']);
}
export async function deleteOrder (params) {
  return QL.remove('order', params, ['result']);
}
export async function queryUseraddress (params) {
  return QL.find_many('userAddress', deleteEmptyProperty(params), [  'province',  'area',  'address',  'updatedAt',  'telephone',  'default',  'city',  'username',  'postcode',  'createdAt',  'deletedAt',  'id']);
}
export async function queryOneUseraddress (params) {
  return QL.find_one('userAddress', params, [  'province',  'area',  'address',  'updatedAt',  'telephone',  'default',  'city',  'username',  'postcode',  'createdAt',  'deletedAt',  'id']);
}
export async function createUseraddress (params) {
  return QL.insert('userAddress', deleteEmptyProperty(params), ['result']);
}
export async function updateUseraddress ({ condition, data}) {
  return QL.update('userAddress', condition, deleteEmptyProperty(data) , ['result']);
}
export async function deleteUseraddress (params) {
  return QL.remove('userAddress', params, ['result']);
}
export async function queryUser (params) {
  return QL.find_many('user', deleteEmptyProperty(params), [  'userData_id',  'id',  'createdAt',  'username',  'telephone',  'password',  'updatedAt',  'email',  'orderlogistic.deliveryTime',  'orderlogistic.serviceStore',  'orderlogistic.updatedAt',  'orderlogistic.logisticsFee',  'orderlogistic.expressId',  'orderlogistic.createdAt',  'orderlogistic.consigneeTel',  'orderlogistic.id',  'orderlogistic.expressName',  'orderlogistic.consignAddress',  'orderlogistic.LogisticsStatus',  'orderlogistic.consigneeName',  'orderproduct.updatedAt',  'orderproduct.productColor',  'orderproduct.unit',  'orderproduct.productSize',  'orderproduct.orderPay',  'orderproduct.createdAt',  'orderproduct.productImg',  'orderproduct.productName',  'orderproduct.productPrice',  'orderproduct.id',  'orderproduct.count',  'orderproduct.productPay',  'orderproduct.orderPay_id',  'openid.transaction_id',  'openid.trade_no',  'openid.time',  'openid.total_fee',  'openid.openid',  'openid.cash_fee',  'order.remark',  'order.updatedAt',  'order.orderLogistics_id',  'order.orderTotalPay',  'order.createdAt',  'order.orderStatus',  'order.id',  'order.count',  'order.productTotalPay',  'order.orderPay_id',  'useraddress.address',  'useraddress.updatedAt',  'useraddress.telephone',  'useraddress.default',  'useraddress.city',  'useraddress.username',  'useraddress.postcode',  'useraddress.createdAt',  'useraddress.deletedAt',  'useraddress.id',  'useraddress.area',  'useraddress.province',  'usercart.updatedAt',  'usercart.createdAt',  'usercart.id',  'usercart.count',  ]);
}
export async function queryOneUser (params) {
  return QL.find_one('user', params, [  'userData_id',  'id',  'createdAt',  'username',  'telephone',  'password',  'updatedAt',  'email',  'orderlogistic.deliveryTime',  'orderlogistic.serviceStore',  'orderlogistic.updatedAt',  'orderlogistic.logisticsFee',  'orderlogistic.expressId',  'orderlogistic.createdAt',  'orderlogistic.consigneeTel',  'orderlogistic.id',  'orderlogistic.expressName',  'orderlogistic.consignAddress',  'orderlogistic.LogisticsStatus',  'orderlogistic.consigneeName',  'orderproduct.updatedAt',  'orderproduct.productColor',  'orderproduct.unit',  'orderproduct.productSize',  'orderproduct.orderPay',  'orderproduct.createdAt',  'orderproduct.productImg',  'orderproduct.productName',  'orderproduct.productPrice',  'orderproduct.id',  'orderproduct.count',  'orderproduct.productPay',  'orderproduct.orderPay_id',  'openid.transaction_id',  'openid.trade_no',  'openid.time',  'openid.total_fee',  'openid.openid',  'openid.cash_fee',  'order.remark',  'order.updatedAt',  'order.orderLogistics_id',  'order.orderTotalPay',  'order.createdAt',  'order.orderStatus',  'order.id',  'order.count',  'order.productTotalPay',  'order.orderPay_id',  'useraddress.address',  'useraddress.updatedAt',  'useraddress.telephone',  'useraddress.default',  'useraddress.city',  'useraddress.username',  'useraddress.postcode',  'useraddress.createdAt',  'useraddress.deletedAt',  'useraddress.id',  'useraddress.area',  'useraddress.province',  'usercart.updatedAt',  'usercart.createdAt',  'usercart.id',  'usercart.count',  ]);
}
export async function createUser (params) {
  return QL.insert('user', deleteEmptyProperty(params), ['result']);
}
export async function updateUser ({ condition, data}) {
  return QL.update('user', condition, deleteEmptyProperty(data) , ['result']);
}
export async function deleteUser (params) {
  return QL.remove('user', params, ['result']);
}
export async function querySpecificationstock (params) {
  return QL.find_many('specificationStock', deleteEmptyProperty(params), [  'stock',  'detailImg',  'id',  'status',  'slideImg',  'size',  'createdAt',  'updatedAt',  'color']);
}
export async function queryOneSpecificationstock (params) {
  return QL.find_one('specificationStock', params, [  'stock',  'detailImg',  'id',  'status',  'slideImg',  'size',  'createdAt',  'updatedAt',  'color'  ]);
}
export async function createSpecificationstock (params) {
  return QL.insert('specificationStock', deleteEmptyProperty(params), ['result']);
}
export async function updateSpecificationstock ({ condition, data}) {
  return QL.update('specificationStock', condition, deleteEmptyProperty(data) , ['result']);
}
export async function deleteSpecificationstock (params) {
  return QL.remove('specificationStock', params, ['result']);
}
