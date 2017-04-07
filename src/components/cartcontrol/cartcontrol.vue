<template>
  <div class="cartcontrol">
   <transition name="move">
      <div class="cart-decrease" v-show="food.count>0" @click.stop.prevent="decreaseCart">
         <span class="inner icon-remove_circle_outline"></span>
         <!-- 字体放在内层滚动 -->
      </div>
     </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop.prevent="addCart($event)"></div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  // BScroll 已经默认不能触发点击事件，需要在前面cilck=true

  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart(event) {
        if (!event._constructed) {
          return;
        }
        if (!this.food.count) {
          Vue.set(this.food, 'count', 1);
        } else {
          this.food.count++;
        }
        //  储存当前点击的元素（即DOMd对象传入）
        this.$emit('add', event.target);
      },
      decreaseCart(event) {
        if (!event._constructed) {
          return;
        }
        if (this.food.count) {
          this.food.count--;
        }
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  .cartcontrol
    font-size 0
    .cart-decrease
      display inline-block
      padding 6px  // 通过增加padding，在不影响图标尺寸的时候，增加用户点击的范围
      transition all 0.5s linear
      .inner
        line-height 24px
        font-size 24px
        color rgb(0,160,220)
        transition all 0.4s linear
      &.move-enter-active, &.move-leave-active
        transform translate3d(0,0,0)
        .inner
          display inline-block
          transform rotate(0deg)
      &.move-enter, &.move-leave-active
        opacity 0
        transform translate3d(24px,0,0)
        .inner
          transform: rotate(180deg)
    .cart-count
      display inline-block
      vertical-align top
      width 12px  // 有padding
      padding-top 6px
      line-height 24px
      text-align center
      font-size 10px
      color rgb(147,153,159)
    .cart-add
      display inline-block
      padding 6px  // 通过增加padding，在不影响图标尺寸的时候，增加用户点击的范围
      line-height 24px
      font-size 24px
      height 24px
      color rgb(0,160,220)
</style>
