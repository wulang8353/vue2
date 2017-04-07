<template>
  <transition name="move">
    <div v-show="showFlag" class="food" ref="food">
      <div class="food-content">
        <div class="img-header">
          <img :src="food.image">
          <div class="back" @click="hide">
            <i class="icon-arrow_lift"></i>
          </div>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}%</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span><span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol @add="addFood" :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div class="buy" @click.stop.prevent="addFirst" v-show="!food.count || food.count === 0">
              加入购物车
            </div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品介绍</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>

        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect  @select="selectRating" @toggle="toggleContent" :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings"></ratingselect>
          <div class="rating-wrapper">
            <ul v-show="food.ratings && food.ratings.length">
              <li v-show="needShow(rating.rateType,rating.text)" v-for="rating in food.ratings" class="rating-item border-1px">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" width="12" height="12" :src="rating.avatar"></img>
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>

</template>

<script type="text/ecmascript-6">
import BScroll from 'better-scroll';
import cartcontrol from '../cartcontrol/cartcontrol';// export default
import Vue from 'vue';
import {formatDate} from '../../common/js/date';  // export function 可以传入多个函数 {formatDate,a}
import split from '../split/split.vue';
import ratingselect from '../ratingselect/ratingselect.vue';

const ALL = 2;

export default {

  props: {
    food: {
      type: Object
    }
  },
  data() {
    return {
      showFlag: false,

      // 商品介绍块
      selectType: ALL,
      onlyContent: false,
      desc: {
        all: '全部',
        postive: '推荐',
        negative: '吐槽'
      }
    };
  },
  methods: {
    show() {
      // 保证是在DOM渲染完成后执行操作
      this.showFlag = true;
      // 保证每次的初始化 -商品介绍块
      this.selectType = ALL;
      this.onlyContent = false;

      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.food, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    addFood(target) {
      this.$emit('add', target);
    },
    hide() {
      this.showFlag = false;
    },
    addFirst(event) {
      if (event._constructed) {
        return;
      }
      this.$emit('add', event.target);
      Vue.set(this.food, 'count', 1); // 第一次点击，通过Vue,将count置为1
    },
    needShow(type, text) {
      if (this.onlyContent && !text) { // 只有内容但没有实际文本，false不显示
        return false;
      }
      if (this.selectType === ALL) {  // 有文本、显示所有的评论
        return true;
      } else {
        return type === this.selectType; // 选择类型和评价类型一致才显示
      }
    },
    selectRating(type) {
      this.selectType = type;
      this.$nextTick(() => {    // 改变selectType,DOM并没有更新
        this.scroll.refresh();  // 重新计算高度
      });
    },
    toggleContent() {
      this.onlyContent = !this.onlyContent;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      return formatDate(date, 'yyyy-MM-dd hh:mm');
    }
  },
  components: {
    cartcontrol,
    split,
    ratingselect
  }
};
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixin.styl'
  .food
    position: fixed
    left 0
    top 0
    bottom 48px  // 购物车的高度
    z-index 30   // 小于购物车和弹窗
    width 100%
    background #fff
    transform translate3d(0,0,0)
    &.move-enter-active,&.move-leave-active
      transition all 0.3s linear
    &.move-enter,&.move-leave-active
      transform translate3d(100%,0,0)
    .img-header
      // 图片是异步加载的
      // 因为屏幕高度为知,不能固定高度
      // 若不设置高度，页面加载会抖动，因为图片未加载完成是没有高度的
      // 加载完毕后，图片突然升高，这就会抖动
      position relative
      width 100%
      height 0
      // W3C标准，当padding设置100%时，值的计算相对于盒子的 宽度(已设置)
      // padding-top 100% 保证了上下的padding与宽度相等
      // 即宽高相等的容器
      padding-top 100%
      img
        position absolute
        top 0
        left 0
        width 100%
        height 100%
      .back
        position absolute
        top 10px
        left 0
        .icon-arrow_lift
          display block
          padding 10px  // 扩大点击区域
          font-size 20px
          color #fff
    .content
      padding 18px
      position relative
      .title
        line-height 14px
        margin-bottom 8px
        font-size 14px
        font-weight 700
        color rgb(7,17,27)
      .detail
        margin-bottom 18px
        line-height 10px
        height 10px
        font-size 0
        .sell-count,.rating
          font-size 10px
          color rgb(147,153,159)
        .sell-count
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
          color rgb(147,153,159)
      .cartcontrol-wrapper
        position absolute
        right 12px
        bottom 12px // 内部有6px的padding 12+6 = 18px
      .buy
        position absolute
        right 18px
        bottom 18px
        height 24px
        line-height 24px
        z-index 10 // 要盖度cartcontrol这个组件，不能进行点击了
        padding 0 12px // 扩宽
        box-sizing border-box
        font-size 10px
        border-radius 12px
        color #fff
        background-color rgb(0,160,220)
        &.fade-enter-active,&.fade-leave-active
         transition all 0.2s
        &.fade-enter,&.fade-leave-active
          opacity 0
          z-index: -1
    .info
      padding 18px
      .title
        line-height 14px
        margin-bottom 6px
        font-size 14px
        color rgb(7,17,27)
      .text
        line-height 24px
        padding 0 8px
        font-size 12px
        color rgb(77,85,93)
    .rating
      padding-top 18px
      .title
        line-height 14px
        margin-left 18px
        font-size 14px
        color rgb(7,17,27)
      .rating-wrapper
        padding 0 18px
        .rating-item
          position relative
          padding 16px 0
          border-1px(rgba(7,17,27,0.1))
          .user
            position absolute
            right 0
            top 16px
            line-height 12px
            font-size 0
            .name
              display inline-block
              vertical-align top
              margin-right 6px
              font-size 10px
              color rgb(147,153,159)
            .avatar
              border-radius 50%
          .time
            margin-bottom 6px
            line-height 12px
            font-size 10px
            color rgb(147,153,159)
          .text
            line-height 16px
            font-size 12px
            color rgb(7,17,27)
            .icon-thumb_up,.icon-thumb_down
              margin-right 4px
              line-height 16px
              font-size 12px
            .icon-thumb_up
              color rgb(0,160,220)
            .icon-thumb_down
              color rgb(147,153,159)
        .no-rating
          padding 16px 0
          font-size 12px
          color rgb(147,153,159)



</style>
