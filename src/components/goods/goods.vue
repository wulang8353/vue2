<template>
  <div class="goods">
  <!--  template 中 ref="name" 中，某name不可使用短横线拼接命名的方式， -->
    <div class="menu-wrapper" ref="menuWrapper">
      <ul>
        <li v-for="(item,$index) in goods" class="menu-item" :class="{'current': currentIndex===$index}" @click="selectMenu($index,$event)" >
          <span class="text border-1px">
            <span v-show="item.type>0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" ref="foodsWrapper">
      <ul>
        <li v-for="(item,$index) in goods" class="food-list" ref="foodList" >
          <h1 class="title">{{item.name}}</h1>
          <ul>
            <li v-for="food in item.foods" @click="selectFood(food,$event)" class="food-item border-1px">
              <div class="icon">
                <img width="57" height="57" :src="food.icon">
              </div>
              <div class="content">
                <h2 class="name">{{food.name}}</h2>
                <p class="desc">{{food.description}}</p>
                <div class="extra">
                  <span class="count">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
                </div>
                <div class="price">
                  <span class="now">￥{{food.price}}</span>
                  <span v-show="food.oldPrice" class="old">￥{{food.oldPrice}}</span>
                </div>
                <div class="cartcontrol-wrapper">
                  <cartcontrol  @add="addFood" :food="food"></cartcontrol>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <shopcart  ref="shopcart" :selectFoods="selectFoods" :deliverPrice="seller.deliveryPrice" :minPrice="seller.minPrice"></shopcart>
    <food  @add="addFood" :food="selectedFood" ref="food"></food>
  </div>

</template>

<script type="text/ecmascript-6">
//  尽管热加载自动刷新浏览器，但是还是要手动刷新保证BScroll

import BScroll from 'better-scroll';  // 1.引入better-scroll 实例化后接受一个DOM
import shopcart from '../shopcart/shopcart';
import cartcontrol from '../cartcontrol/cartcontrol';
import food from '../food/food';

const ERR_OK = 0;

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],  // 还没通过http取得数据时，这里是空数组；待取到后推入数据
        listHeight: [],
        scrollY: 0,
        selectedFood: {}
      };
    },
    computed: {
      currentIndex() {
        for (let i = 0; i < this.listHeight.length; i++) {
          //  区间高度的范围
          let height1 = this.listHeight[i];
          let height2 = this.listHeight[i + 1];

          if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
            return i;
          }
        }
        return 0;
      },
      selectFoods() {
        let foods = [];
        this.goods.forEach((good) => {
          good.foods.forEach((food) => {
            if (food.count) {
              foods.push(food);
            }
          });
        });
        return foods;
      }
    },
    created() {
       this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
       this.$http.get('/api/goods').then((response) => {
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          this.$nextTick(() => {
          // 3 在这个函数中调用以防内容还未加载完就执行，获取不到元素的高度导致无法滑动，也就是说异步加载完数据再执行函数
            this._initScorll();
            this._calculateHeight();
          });
        }
      });
    },
    methods: {
      //  >>> 联动1
      selectMenu(index, event) {
        if (!event._constructed) {
          return;
        //  >>> 联动3
        }
        // 通过BScroll派发的event，具有event._constructed，为true，继续执行
        // PC端，原生点击事件不具有该属性，
        // 即可以过滤掉浏览器原生事件
        // let foodList = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook'); // 访问DOM元素
        let foodList = this.$refs.foodList;
        let el = foodList[index];
        this.foodsScroll.scrollToElement(el, 300);
      },
      selectFood(food, event) {
        if (!event._constructed) {
          return;
        }
        this.selectedFood = food;
        this.$refs.food.show();
      },

      // 取得子组件传递来的函数add(),得到点击对象
      // 在父组件中设置add的函数，即调用其他子组件方法，传递对象
      addFood(target) {
        this._drop(target);
      },
      // events: {
      //   'add'(target) {
      //     this._drop(target);
      //   }
      // }
      _drop(target) {
        // 同时开启两个动画，造成计算量较大
        // 点击事件不立刻执行动画
        // 体验优化,异步执行下落动画，这是异步的
        this.$nextTick(() => {
          this.$refs.shopcart.drop(target); // 访问子组件方法
        });
      },

      _initScorll() {   // 2 函数声明，目的是要获取到DOM的高度
        this.menuScroll = new BScroll(this.$refs.menuWrapper, {click: true});
        // 第一个参数是DOM对象，第二个是json

        // click: true,可以点击   >>> 联动2
        // BScroll 监听touch事件，会默认阻止默认事件
        // PC页面下，事件点击，会派发两个点击事件：BScroll派发 + 浏览器原生点击事件
        // 移动端，就只会有一个点击事件,由BScroll派发

        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          probeType: 3,
          // 探针，检测实时滚动的位置
          click: true
        });
        this.foodsScroll.on('scroll', (pos) => {
          this.scrollY = Math.abs(Math.round(pos.y)); // 转成正值
        });
      },
      _calculateHeight() {
        let foodList = this.$refs.foodList;
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
      }
    },
    components: {
      shopcart,
      cartcontrol,
      food
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import '../../common/stylus/mixin.styl'

  .goods
    display flex
    position absolute
    top 174px   // header=134px + tab=40px
    bottom 46px
    width 100%
    overflow hidden
    .menu-wrapper
      flex 0 0 80px   // 等分、缩放、占位空间
      width 80px      // 处理兼容性问题
      background #f3f5f7
      .menu-item
        display table // 垂直居中
        height 54px
        width 56px
        line-height  14px
        padding 0 12px
        &.current
          position relative
          z-index 10
          margin-top -1px
          background #fff
          font-weight 700
          .text
            border-none();
        .icon
          display inline-block
          vertical-align top
          width 12px
          height 12px
          margin-right 2px
          background-size 12px 12px
          background-repeat no-repeat
          &.decrease
            bg-image('decrease_3')
          &.discount
            bg-image('discount_3')
          &.special
            bg-image('special_3')
          &.invoice
            bg-image('invoice_3')
          &.guarantee
            bg-image('guarantee_3')
        .text
          display table-cell
          width 56px
          vertical-align middle
          border-1px(rgba(7,17,27,0.1))
          font-size 12px
    .foods-wrapper
      flex 1
      .title
        padding-left 14px
        height 26px
        line-height 26px
        border-left 2px solid #d9dde1
        font-size 12px
        color rgb(147, 153, 159)
        background #f3f5f7
      .food-item
          display flex
          margin 18px
          padding-bottom 18px
          border-1px(rgba(7,17,27,0.1))
          &:last-child
            border-none()
            margin-bottom 0
          .icon
            flex 0 0 57px
            margin-right 10px
          .content
            flex 1 // 自适应
            .name
              margin 2px 0 8px 0
              font-size 14px
              line-height 14px
              height 14px
              color rgb(7,17,27)
            .desc, .extra
              line-height 10px
              font-size 10px
              color rgb(147,153,159)
            .desc
              margin-bottom 8px
              line-height 12px
            .extra
              .count
                margin-right 12px
            .price
              font-weight 700
              line-height 24px
              .now
                margin-right 8px
                font-size 14px
                color rgb(240, 20, 20)
              .old
                text-decoration line-through
                font-size 10px
                font-weight 700
                line-height 24px
                color rgb(147,153,159)
            .cartcontrol-wrapper
              position absolute
              right 0
              bottom 12px

</style>
