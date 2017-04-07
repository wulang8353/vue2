import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';

import App from './App';
import goods from './components/goods/goods';
import seller from './components/seller/seller';
import ratings from './components/ratings/ratings';

import './common/stylus/index.styl';  // 要与components类似访问，webpack配置

Vue.use(VueRouter); // 显示使用Vue.use()  安装路由模块
Vue.use(VueResource); // 第三方插件，需要引入后，全局注册

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

// const routes = [
//   { path: '/goods', component: goods },
//   { path: '/ratings', component: ratings },
//   { path: '/seller', component: seller }
// ];

const router = new VueRouter({
  linkActiveClass: 'active', // 这里控制样式
  routes // （缩写）相当于 routes: routes
});

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
});
