<template>
  <div id ="app">
    <v-header :seller="seller"></v-header>
    <!-- v-header 传递seller -->
    <div class="tab border-1px">
      <div class="tab-item">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tab-item">
        <router-link to="/seller">商家</router-link>
      </div>
    </div>

    <!-- 路由出口 -->
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
    <!-- 状态保留，生命周期不会重新加载 -->
    <!-- 路由改变，刷新这部分的内容 传递seller -->
  </div>
</template>

<script type="text/ecmascript-6">
import {urlParse} from 'common/js/util';
import header from './components/header/header.vue';

const ERR_OK = 0;

export default {
  //  ajax请求 将数据请求到App,vue层，通过props属性进行传递

  //  DOM结构中，就直接将seller传递到组件中
  //  因为htpp请求是一个异步过程，在最刚开始初始化seller,这就是一个空对象
  //  传递到props中也就是undefined
  data() {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse();  // 得到商家的url
          // console.log(queryParam)       id:'12345'
          return queryParam.id;         // 得到商家的id
        })()
      }
    };
  },
  // 实例周期中的钩子
  created() {
    // 从这里发送请求的id
    this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
      // response 这里是属性，不像jQuery直接是JSON数组
      // response = response.json(); json是promise对象
      response = response.body; // 这里body是属性，而不是方法

      if (response.errno === ERR_OK) {
        // this.seller = response.data; 赋值会丢掉id
        this.seller = Object.assign({}, this.seller, response.data);
        // (最终的结果、属性、传值)
        // 在id的基础上给seller添加其他属性

        // 对象扩展属性的方法 Object.assign()
      }
    });

    // 接口返回的res并不直接是返回的数据，而是经过axios本身处理过的json对象。真正的数据在res.data里
    // axios.get('/api/seller').then((res) => {
    //   var response = res.data;
    //   if (response.errno === ERR_OK) {
    //     this.seller = response.data;
    //     console.log(this.seller);
    //   }
    // });
  },

  components: {
    'v-header': header
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus">
//  @import 是 stylus的语法。专门引用css样式
@import "./common/stylus/mixin.styl"
.tab
  // vue-loader 有一个postcss，能搞定CSS兼容问题
  display: flex
  width: 100%
  height: 40px
  line-height: 40px
  // border: 1px solid rgba(7, 17, 27, 0.1 )
  // 增加伪类，是一条线，具有缩放功能，将1px能缩放到手机上也是1px
  border-1px(rgba(7, 17, 27, 0.1 ))
  .tab-item
    flex: 1
    text-align center
    & > a
      display: block
      font-size: 14px
      color: rgb(77,85,93)
      &.active
        color: rgb(240,20,20)
</style>
