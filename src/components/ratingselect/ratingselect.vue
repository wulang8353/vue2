<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span @click="select(2,$event)" class="block postive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
      <span @click="select(0,$event)" class="block postive" :class="{'active':selectType===0}">{{desc.postive}}<span class="count">{{postives.length}}</span></span>
      <span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
    </div>
    <div class="switch" @click="toggleContent">
      <span class="icon-check_circle" :class="{'on':onlyContent===true}"></span>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    props: {
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      selectType: {
        type: Number,
        default: ALL
      },
      onlyContent: {
        type: Boolean,
        default: false
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            postive: '满意',
            negative: '不满意'
          };
        }
      }
    },
    computed: {
      // 修改prop中的数据，在计算属性中通过this.ratings 去处理成其他数据进行输出
      postives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      },
      negatives() {
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      }
    },
    methods: {
      select(type, event) {
        if (!event._constructed) {
          return;
        }
        this.$emit('select', type);
        // this.selectType = type;
        // this.$reventHub.$emit('ratingtype.select', type);  // 父组件监听改事件，改变selectType
      },
      toggleContent(event) {
        if (!event._constructed) {
          return;
        }
        this.$emit('toggle');
        // this.onlyContent = !this.onlyContent;
        // this.$root.eventHub.$emit('content.toggle', this.onlyContent); 父组件监听改事件，改变selectType
      }
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .ratingselect
    .rating-type
      padding 18px 0  // padding 18px  会导致其下的横线也会扩宽
      margin 0 18px
      border-1px(rgba(7,17,27,0.1))
      font-size 0
      .block
        display inline-block
        line-height 16px
        padding 8px 12px
        margin-right 8px
        border-radius 1px
        font-size 12px
        color rgb(77,85,93)
        &.active
          color #fff
        .count
          font-size 8px
          margin-left 2px
        &.postive
          background-color rgba(0,160,220,0.2)
          &.active
            background-color rgb(0,160,220)
        &.negative
          background-color rgba(77,85,93,0.2)
          &.active
            background-color rgb(77,85,93)
    .switch
      padding 12px 18px
      line-height 24px
      border-bottom 1px solid rgba(7,17,27,0.1)
      color rgb(147,153,159)
      font-size 0
      .icon-check_circle
        display inline-block
        vertical-align top
        margin-right 4px
        font-size 24px
        &.on
          color: #00c580
      .text
        display inline-block
        font-size 12px


</style>
