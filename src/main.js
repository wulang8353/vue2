import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';

// 1.引入路由组件
import goods from 'components/goods/goods';
import seller from 'components/seller/seller';
import ratings from 'components/ratings/ratings';

import 'common/stylus/index.styl';
 // 加载全局样式后,页面可以直接使用全局养殖
 // alias 支持引入一个JS库，而CSS是不能的

// 全局注册
Vue.use(VueRouter);    // 2.如果使用模块化机制编程，導入Vue和VueRouter，要调用 Vue.use(VueRouter)
Vue.use(VueResource);

// 3.定义路由映射
const routes = [
  {
    path: '/',
    redirect: '/goods'
  }, {
    path: '/goods',
    component: goods
  }, {
    path: '/ratings',
    component: ratings
  }, {
    path: '/seller',
    component: seller
  }
];

// 4.创建router实例并传入'routes'的映射配置
const router = new VueRouter({
  linkActiveClass: 'active',
  routes // （缩写）相当于 routes: routes
});

/* eslint-disable no-new */
new Vue({
    el: '#app',
    template: '<App/>',
    router,
    components: { App }
});
// 实例化对象需要赋值给某个值，单独实例化需要加上注释，跳过校验
