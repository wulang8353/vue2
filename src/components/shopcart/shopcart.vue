<template>
  <div>
    <div class="shopcart">
      <div class="content"  @click="toggleList">
        <div class="content-left" >
          <div class="logo-wrapper">
            <div class="logo" :class="{'highlight':totalCount>0}">
              <i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highlight':totalCount>0}">
          ￥{{totalPrice}}
          </div>
          <div class="desc">
            另需配送费￥{{deliveryPrice}}元
          </div>
        </div>
        <div class="content-right" @click.stop.prevent="pay">
          <div class="pay" :class="payClass">
            {{payDesc}}
          </div>
        </div>
        <div class="ball-container">
          <div  v-for="(ball,index) in balls" >
             <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
              <div class="ball"  v-show="ball.show">
                <div class="inner inner-hook"></div>
              </div>
             </transition>
          </div>
        </div>
        <transition name="fold">
          <div class="shopcart-list" v-show="listShow">
            <div class="list-header">
              <h1 class="title">
                购物车
              </h1>
              <span class="empty" @click="empty">清空</span>
            </div>
            <div class="list-content" ref="listContent">
              <ul>
                <li class="food" v-for="food in selectFoods">
                  <span class="name">{{food.name}}</span>
                  <div class="price">
                    <span>￥{{food.price * food.count}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cartcontrol  @add="addFood" :food="food"></cartcontrol>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <transition name="fade">
      <div class="list-mask" v-show="listShow" @click="hideList"></div>
    </transition>
  </div>

</template>

<script type="text/ecmascript-6">
import cartcontrol from '../cartcontrol/cartcontrol';
import BScroll from 'better-scroll';

// Component template should contain exactly one root element
// 最外层裹一层div，指定一个根元素即可

  export default {
    // 有传值就一定有接受
     props: {
      deliveryPrice: {
        type: Number,
        default: 0
      },
      minPrice: {
        type: Number,
        default: 0
      },
      // 从goods传递过来
      selectFoods: {
        type: Array,
        default() {
          return [
            {
              price: 10,
              count: 1
            }
          ];
        }
      }
    },
    data() {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        fold: true
      };
    },
    computed: {
      totalPrice() {
        let total = 0;
        this.selectFoods.forEach((food) => {
          total += food.price * food.count;
        });
        return total;
      },
      totalCount() {
        let count = 0;
        this.selectFoods.forEach((food) => {
          count += food.count;
        });
        return count;
      },
      payDesc() {
        if (this.totalPrice === 0) {
          return `￥${this.minPrice}元起送`;
        } else if (this.totalPrice < this.minPrice) {
          let diff = this.minPrice - this.totalPrice;
          return `还差￥${diff}元起送`;
        } else {
          return '去结算';
        }
      },
      payClass() {
        if (this.totalPrice < this.minPrice) {
          return 'not-enough';
        } else {
          return 'enough';
        }
      },
      listShow() {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {
            this.$nextTick(() => {
              if (!this.scroll) {
                 this.scroll = new BScroll(this.$refs.listContent, {
                   click: true
                 });
              } else {
                this.scroll.refresh();
                // 根据视口内容的高度差决定是否可以滚动
              }
          });
        }
        return show;
      }
    },
    methods: {
      drop(el) { // el 对应的是cartcontrol中的点击元素
        // console.log(el);
        for (let i = 0, l = this.balls.length; i < l; i++) {
          let ball = this.balls[i];
          if (!ball.show) {  // 找到一个隐藏的小球
            ball.show = true;// 触发动画的条件
            ball.el = el;    // 通过设置属性,存入得到点击的小球
            this.dropBalls.push(ball); // 将触发动画的小球推入
            return;
          }
        }
      },
      beforeDrop(el) {
        //  console.log(el); 当前执行动画的DOM对象
        let count = this.balls.length;
        while (count--) {
          let ball = this.balls[count]; // 触发动画的小球
          if (ball.show) {
            let rect = ball.el.getBoundingClientRect(); // 获得元素相对视口的位置
            let x = rect.left - 32; // 屏幕最左上小角为原点。当前点击小球的x轴 - 小球最后地方的x轴
            let y = -(window.innerHeight - rect.top - 22); // y轴负半轴,取负
            el.style.display = '';  // 原来本是none 让他显示出来
            el.style.webkitTransform = `translate3d(0,${y}px,0)`; // 外层的元素纵向动画
            el.style.transform = `translate3d(0,${y}px,0)`;       // 外层的元素纵向动画
            let inner = el.getElementsByClassName('inner-hook')[0]; // .inner-hook hook表示被js拿来选择的样式,取数组的第一个元素
            inner.style.webkitTransform = `translate3d(${x}px,0,0)`; // 内层的元素横向动画
            inner.style.transform = `translate3d(${x}px,0,0)`;       // 内层的元素横向动画
          }
        }
      },
      dropping(el, done) { // 动画完成后
        /* eslint-disable no-unused-vars */
        let rf = el.offsetHeight;
        //  注释表明该变量不使用 触发浏览器重绘
        this.$nextTick(() => {
          el.style.webkitTransform = 'translate3d(0,0,0)';
          el.style.transform = 'translate3d(0,0,0)';
          let inner = el.getElementsByClassName('inner-hook')[0];
          inner.style.webkitTransform = 'translate3d(0,0,0)';
          inner.style.transform = 'translate3d(0,0,0)';
          el.addEventListener('transitionend', done); // 触发回调
        });
      },
      afterDrop(el) {   // 动画
        let ball = this.dropBalls.shift();  // 状态重置
        if (ball) {
          ball.show = false;
          el.style.display = 'none';        // 过渡结束后消失
        }
      },
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      empty() {
        this.selectFoods.forEach((food) => {
          food.count = 0;
        });
      },
      hideList() {
        this.fold = true;
      },
      addFood(target) {
        this.drop(target);
      },
      pay() {
        if (this.totalPrice < this.minPrice) {
          return;
        } else {
          window.alert(`支付${this.totalPrice}元`);
        }
        // 点击事件冒泡，阻止冒泡
      }
    },
    components: {
      cartcontrol
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixin.styl'
  .shopcart
    position fixed
    left 0px
    bottom 0px
    z-index 50
    width 100%
    height 48px
    .content
      display flex
      background #141d27
      font-size 0  // 所有字体均看不见
      color: rgba(255, 255, 255, 0.4)
      .content-left
        flex 1
        .logo-wrapper
          display inline-block
          vertical-align top
          position relative
          top -10px // (116-96)/2 = 10px
          margin 0 12px  // (36-12)/2=12px
          padding  6px
          width 56px
          height 56px
          box-sizing border-box
          // (88+12*2)/2=56px
          // 这里是用IE盒模型计算，
          // 宽高包括了padding、border在内
          border-radius 50%
          background #141d27
          .logo
            width 100%
            height 100%
            border-radius 50%
            background #2b343c
            text-align center
            &.highlight
              background rgb(0,160,220)
            .icon-shopping_cart
              line-height 44px
              font-size 24px
              color #80858a
              &.highlight
                color #fff
          .num
            position absolute
            top 0
            right 0
            width 24px
            height 16px
            line-height 16px
            text-align center
            border-radius 16px
            font-size 9px
            font-weight 700
            color #fff
            background rgb(240,20,20)
            border-show  0 4px 8px 0 rga(0,0,0,0.4)
        .price
          display inline-block
          vertical-align top
          margin-top 12px
          line-height 24px
          // 父元素高度48px  垂直居中：若直接定义line-height=48px，那么右边的虚线会撑满高度
          padding-right 12px
          box-sizing border-box
          font-size 16px
          font-weight 700
          border-right 1px solid rgba(255,255,255,0.1)
          &.highlight
            color #fff
        .desc
          display inline-block
          vertical-align top
          line-height 24px
          margin 12px 0 0 12px
          font-size 10px
      .content-right
        flex 0 0 105px
        width 105px
        .pay
          line-height 48px
          height 48px
          text-align center
          font-size 12px
          font-weight 700
          &.not-enough
            background #2b333b
          &.enough
            background #00b43c
            color #fff
      .ball-container
        .ball
          position fixed
          left 32px
          bottom 22px
          z-index 200
          transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
          .inner
            width 16px
            height 16px
            border-radius 50%
            background rgb(0,160,220)
            transition all 0.4s linear
      .shopcart-list
        position absolute
        left 0
        top 0
        z-index -1
        width 100%
        background #fff
        transform translate3d(0,-100%,0)
        &.fold-enter-active,&.fold-leave-active
          transition all 0.5s
        &.fold-enter, &.fold-leave-active
          transform translate3d(0,0,0)
        .list-header
          height 40px
          line-height 40px
          background #f3f5f7
          border-bottom 1px solid rgba(7,17,27,0.1)
          padding 0 18px
          .title
            float left
            font-size 14px
            font-weight 200
            color rgb(7,17,27)
          .empty
            float right
            font-size 12px
            color rgb(0,160,220)
        .list-content
          max-height 217px
          overflow hidden
          padding 0 18px
          .food
            position relative
            padding 12px 0
            font-size 14px
            font-weight 700
            box-sizing border-box
            border-1px rgba(7,17,27,0.1)
            .name
              line-height 24px
              color rgb(7,17,27)
            .price
              position absolute
              right 90px
              bottom 12px
              line-height 24px
              font-weight 700
              color rgb(240,20,20)
            .cartcontrol-wrapper
              position absolute
              right 0
              bottom 6px  // 本身就有6px的内边距
  .list-mask
    position fixed
    top 0
    left 0
    width 100%
    height 100%
    z-index 40  // 小于 50
    background rgba(7,17,27,0.6)
    backdrop-filter blur(10px)
    &.fade-enter-active,&.fade-leave-active
      transition opacity 0.5s
    &.fade-enter,&.fade-leave-active
      opacity 0
</style>
