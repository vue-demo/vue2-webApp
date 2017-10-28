/**
 * Created by saturn on 2017/8/8.
 */

import axios from 'axios';
import Vue from 'vue';
import vueJsonp from 'vue-jsonp'
Vue.use(vueJsonp);

// 接口服务器地址
const baseUrl = 'http://192.168.50.230:8883/api';
// const baseUrl = 'http://192.168.50.155:8881/api';
// const baseUrl = 'http://i.0t.com.cn';

// 图片服务器地址
const imgSrc = 'http://192.168.50.216/';
// const imgSrc = 'http://183.134.74.90/';

/***********************登录相关********************************/
const getCodeApi = baseUrl + '/v1/sys/';
const signUp_api = baseUrl + '/v1/user/login';
const signIn_api = baseUrl + '/v1/mall/user/register';

/***********************获取产品列表********************************/
const home_get_goods = baseUrl + '/a/shop/goods/list';
const home_get_carouse = baseUrl + '/a/shop/carousel/getCarouselList';
const get_detail = baseUrl + '/a/shop/goods/getInfo';

/***********************购物车********************************/
const goods_get_number = baseUrl + '/a/shop/cart/getCartNum'; // 获取购物车总数量
const cart_goods_list = baseUrl + '/a/shop/cart/getList'; // 获取购物车列表
const goods_remove = baseUrl + '/a/shop/cart/remove'; // 删除购物车产品
const goods_add = baseUrl + '/a/shop/cart/add'; // 加入购物车
const detail_changeChecked = baseUrl + '/a/shop/cart/changeChecked';

/***********************收货地址********************************/
const address_list = baseUrl + '/a/shop/receive/address/list'; // 收货地址列表
const address_save = baseUrl + '/a/shop/receive/address/save'; // 保存收货地址
const address_update = baseUrl + '/a/shop/receive/address/update'; // 选择收货地址
const address_remove = baseUrl + '/a/shop/receive/address/remove'; // 删除收货地址
const address_getDetail = baseUrl + '/a/shop/receive/address/getDetail'; // 修改收货地址详细

/***********************订单********************************/
const orderForm_save = baseUrl + '/a/shop/order/saveOrder'; // 订单保存
const order_list = baseUrl + '/a/shop/order/getOrderList'; // 获取订单列表
const order_info = baseUrl + '/a/shop/order/getOrderDetail'; // 获取订单信息
const delete_order = baseUrl + '/a/shop/order/delete'; // 删除订单
const order_receipt = baseUrl + '/a/shop/order/receipt'; // 确认收货
const order_buyAgain = baseUrl + '/a/shop/order/buyAgain'; // 再次购买

/**
 * 001 首页焦点图
 * @param callback
 * @returns null
 */
function getHomeFocus(callback) {
  axios.get(home_get_carouse).then(res => {
    if (res.data.code === 200) {
      let data = res.data.data.filter(item => {
        // return item.addata === null && item.picInfo[0];
        return item;
      }).map(item => {
        return {
          title: item.name,
          url: 'detail?id=' + item.id,
          // img: this.imgSrc + item.pathInfo,
          img: 'http://183.134.74.90/group1/M00/00/04/wKgBCVljaDyAbZdsAAITmoNI0yE716.png'//??上线改掉
        }
      });
      callback(data);
    }
  });
}

/**
 * 002 首页无缝滚动
 * @returns Promise
 */
function getHomeMarquee() {
  return new Promise((resolve, reject) => {
    Vue.jsonp('http://3g.163.com/touch/jsonp/sy/recommend/0-9.html').then(data => {
      let marquee_list = data.live.filter(item => {
        return item.addata === null && item.picInfo[0];
      }).map(item => {
        return {title: item.title}
      });
      resolve(marquee_list);
    }).catch(err => {
      reject(err);
    });
  });
}

/**
 * 003 首页商品列表
 * @param callback
 * @returns null
 */
function getHomeGoods(callback) {
  axios.get(home_get_goods).then(res => {
    if (res.data.code === 200) {
      let data = res.data.data.filter(item => {
        // return item.addata === null && item.picInfo[0];
        return item;
      }).map(item => {
        return {
          id: item.id,
          title: item.goodsName,
          price: item.salePrice,
          // pic: item.productImg,
          pic: 'http://183.134.74.90/group1/M00/00/04/wKgBCVljaDyAbZdsAAITmoNI0yE716.png'//??上线改掉
        }
      });
      callback(data);
    }
  });
}

/**
 * 004 获取 商品详情
 * @param id
 * @param callback
 */
function getDetailGoods(id, callback) {
  axios({
    url: get_detail,
    // url: '/static/get_goods_detail.json',
    method: 'post',
    params: {},
    data: {goodsId: id}
  }).then(res => {
    if (res.data.code === 200) {
      let item = res.data.data;
      callback({
        title: item.goodsName,
        desc: item.goodsDesc !== undefined ? item.goodsDesc : '暂无简介',
        info: item.goodsInfo,
        price: item.salePrice,
        pics: [{url: 'http://183.134.74.90/group1/M00/00/04/wKgBCVljaDyAbZdsAAITmoNI0yE716.png'}, {url: 'http://183.134.74.90/group1/M00/00/04/wKgBCVljaDyAbZdsAAITmoNI0yE716.png'}]
        //pics: item.imgList.map(item => item.url.indexOf('http') < 1 ? (imgSrc + item.url) : item.url ) /*补全http*/
      });
    }
  }).catch(err => {
    console.log(err);
  });
}

/**
 * 005 获取购物车数量
 * @param id
 * @param callback
 */
function goodsGetNumber(id, callback) {
  axios({
    url: goods_get_number,
    method: 'post',
    params: {},
    data: {goodsId: id}
  }).then(res => {
    if (res.data.code === 200) {
      callback(res.data.data);
    }
  }).catch(err => {
    console.log(err);
  });
}

/**
 * 006 购物车清单
 */
function cartGoodsList(callback) {
  axios({
    url: cart_goods_list,
    method: 'post',
    params: {},
    data: {}
  }).then(res => {
    if (res.data.code === 200) {
      let data = res.data.data;
      let arr = data.filter(item => {
        return item.goods !== undefined;
      }).map(item => ({
        "id": item.goodsId,
        "title": item.goods.goodsName,
        "type": "暂无分类",
        "price": item.goods.salePrice,
        "num": item.num,
        "checked": item.checked,
        "desc": "暂无简介",
        //"src": item.goods.productImg,
        "src": item.goods.productImg.indexOf("http") < 1 ? (imgSrc + item.goods.productImg) : item.goods.productImg,
        "url": {
          "path": "/car",
          "replace": false
        }
      }));
      callback(arr);
    }
  }).catch(err => {
    console.log(err);
  });
}

/**
 * 007 增加商品
 * @param id
 * @param callback
 */
function goodsAdd(id, callback) {
  axios({
    url: goods_add,
    method: 'post',
    params: {},
    data: {goodsId: id}
  }).then(res => {
    if (res.data.code === 200) {
      callback(res.data);
    }
  }).catch(err => {
    console.log(err);
  });
}

/**
 * 008 减少商品
 * @param callback
 */
function goodsRemove(item, callback) {
  axios({
    url: goods_remove,
    method: 'post',
    params: {},
    data: {
      goodsId: item.id,
      num: item.num + 1
    }
  }).then(res => {
    if (res.data.code === 200) {
      callback(res.data);
    }
  }).catch(err => {
    console.log(err);
  });
}

/**
 * 009 获取 收货地址
 * @param callback
 */
function getAddress(callback) {
  axios({
    url: address_list,
    method: 'post',
  }).then(res => {
    let arr = res.data.data.filter(item => {
      return item.contacts !== undefined && item.phone.length === 11;
    }).map(item => ({
      id: item.id,
      isUsed: item.isUsed == 2,
      name: item.contacts,
      phone: item.phone,
      addrName: item.addrName.split(' ').join('/')
    }));
    callback(arr);
  }).catch(err => {
    console.log(err);
  });
}

/**
 * 010 新增 收货地址
 * @param address
 * @param callback
 */
function setAddress(address, callback) {
  axios({
    url: address_save,
    method: 'post',
    data: address,
    headers: {
      //'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(res => {
    let data = res.data.success;
    callback(data);
  }).catch(err => {
    console.log(err);
  });
}

/**
 * 011 选择默认 收货地址
 * @param id
 * @param callback
 */
function selectAddress(id, callback) {
  axios({
    url: address_update,
    method: 'get',
    params: {id: id},
    data: {},
    headers: {
      //'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(result => {
    let data = result.data.success;
    callback(data);
  }).catch(err => {
    console.log(err);
  });
}

/**
 * 012 修改 详细收货地址
 * @param data
 * @param callback
 */
function updateAddress(data, callback) {
  axios({
    url: address_save,
    method: 'post',
    params: {id: data.id},
    data: data
  }).then(result => {
    callback(result.data.data);
  });
}

/**
 * 013 获取 详细收货地址
 * @param id
 * @param callback
 */
function detailAddress(id, callback) {
  axios({
    url: address_getDetail,
    method: 'get',
    params: {id: id},
    data: {}
  }).then(result => {
    let data = result.data.data;
    callback({
      id: data.id,
      isUsed: 2,
      name: data.contacts,
      phone: data.phone,
      addrDetail: data.addrDetail,
      addrName: data.addrName.split('/')

    });
  });
}

/**
 * 014 删除 收货地址
 * @param id
 * @param callback
 */
function deleteAddress(id, callback) {
  axios({
    url: address_remove,
    method: 'get',
    params: {id: id},
    data: {}
  }).then(result => {
    callback(result.data.data);
  });
}

/**
 * 015 保存订单
 * @param data
 * @param callback
 */
function orderFormSave(data, callback) {
  axios({
    url: orderForm_save,
    method: 'post',
    params: {},
    data: data
  }).then(result => {
    callback(result.data.data);
  });
}

/**
 * 016 获取订单列表
 * @param data
 * @param callback
 */
function orderFormList(data, callback) {
  axios({
    url: order_list,
    method: 'post',
    params: {},
    data: {
      "status": data.status || null,
      "payStatus": data.payStatus || null
    }
  }).then(result => {
    let test = [{
      id: 'bb5d4a2fc687434cab325fb6e4d8870f',
      orderNum: 'RY17082301731',
      totalPrice: '200',
      goodsList: {
        "goodsName": "烟雾传感器",
        "productImg": "group1/M00/00/04/wKgBCVljaGKAQZ3kAAQas3XpTfw122.png",
        "num": 1
      }
    }];
    let arr = [];
    let arrList = [];
    let data = result.data.data.forEach((item, index) => {
      arr.push({
        id: item.id,
        orderNum: item.orderNum,
        totalPrice: item.totalPrice,
        productImg: item['goodsList'][0].productImg,
        goodsList: [{
          label: item['goodsList'][0].goodsName,
          value: 'x' + item['goodsList'][0].num
        }],
        buttonsMeun: [{
          style: 'default',
          text: '查看订单',
          link: '/book?src=books&id=' + item.id
        }, {
          style: 'primary',
          text: '再次购买',
          link: '/detail?id=' + item.id
        }]
      })
    });
    callback(arr);
  });
}

/**
 * 获取订单详情
 * @param data
 * @param callback
 */
function orderFormInfo(data, callback) {
  axios({
    url: order_info,
    method: 'post',
    params: {},
    data: data || {}
  }).then(result => {
    callback(result.data.data);
  })
}
/**
 * 样板函数
 * @param uid
 * @param callback
 * @returns {Promise}
 */
function axiosDemo(uid = 123, callback) {
  return new Promise((resolve, reject) => {
    axios({
      url: 'http://3g.163.com/touch/jsonp/sy/recommend/0-9.html',
      method: 'get',
      params: {},    // GET
      data: {},      // POST
    }).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err);
    });
  });
}

export {
  getHomeFocus,
  getHomeMarquee,
  getHomeGoods,
  getDetailGoods,
  goodsGetNumber,
  cartGoodsList,
  goodsAdd,
  getAddress,
  setAddress,
  goodsRemove,
  selectAddress,
  updateAddress,
  detailAddress,
  deleteAddress,
  orderFormSave,
  orderFormList,
  orderFormInfo
}
