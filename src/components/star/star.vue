<template>
  <div class="star" :class="starType">
    <span v-for="itemClass in itemClasses" :class="itemClass" class="star-item"></span>
  </div>
</template>

<script type="text/ecmascript-6">
const LENGTH = 5;
const CLS_ON = 'on';
const CLS_HALF = 'half';
const CLS_OFF = 'off';

  export default {
    props: {
      size: {
        type: Number
      },
      score: {
        type: Number
      }
    },
    computed: {
      starType() {
        return 'star-' + this.size;  // 拼成对应的类名
      },
      itemClasses() {  // 提供遍历数组
        let result = [];
        let score = Math.floor(this.score * 2) / 2;
        let hasDecimal = score % 1 !== 0;
        let integer = Math.floor(score);
        //  判断多少个全星
        for (let i = 0; i < integer; i++) {
          result.push(CLS_ON);
        }
        if (hasDecimal) {
          result.push(CLS_HALF);
        }
        while (result.length < LENGTH) {
          result.push(CLS_OFF);
        }
        return result;
        // 数组[on,on,on,on,off]  通过遍历得到每一个值，与绑定的类名相同，找到对应的样式
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .star
    .star-item
      font-size 0
      display inline-block
      background-repeat no-repeat
    // 根据传回来的size，根据计算属性去拼接
    &.star-48 // 与父元素同一级  div.class.star.star-48
      .star-item
        width 20px
        height 20px
        margin-right 20px
        background-size 20px 20px
        &:last-child
           margin-right 0
        // itemClass取值范围
        &.on   // 与父元素 star-item同一级  div.class.star.star-48
          bg-image('star48_on')
        &.half
          bg-image('star48_half')
        &.off
          bg-image('star48_off')
    &.star-36
      .star-item
        width 15px
        height 15px
        margin-right 6px
        background-size 15px 15px
        &:last-child
           margin-right 0
        // itemClass取值范围
        &.on
          bg-image('star36_on')
        &.half
          bg-image('star36_half')
        &.off
          bg-image('star36_off')
    &.star-24
      .star-item
        width 10px
        height 10px
        margin-right 3px
        background-size 10px 10px
        &:last-child
           margin-right 0
        // itemClass取值范围
        &.on
          bg-image('star24_on')
        &.half
          bg-image('star24_half')
        &.off
          bg-image('star24_off')
</style>
