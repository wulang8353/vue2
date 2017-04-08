<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{seller.name}}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{seller.ratingCount}})</span>
          <span class="text">月售{{seller.sellCount}}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{seller.minPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryPrice}}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{seller.deliveryTime}}</span>分钟
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>

      <split></split>

      <div class="bulletin">
        <h1 class="title">公告与活动</h1>
        <div class="content-wrapper border-1px">
          <p class="content">{{seller.bulletin}}</p>
        </div>
        <ul v-if="seller.supports" class="supports">
         <li class="support-item border-1px" v-for="(item,index) in seller.supports">
           <span class="icon" :class="classMap[seller.supports[index].type]"></span>
           <span class="text">{{seller.supports[index].description}}</span>
         </li>
        </ul>
      </div>

      <split></split>

      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="pic in seller.pics">
              <img :src="pic" width="120" height="90">
            </li>
          </ul>
        </div>
      </div>

      <split></split>
      <div class="info">
        <h1 class="title border-1px">商家信息</h1>
        <ul>
          <li class="info-item" v-for="info in seller.infos">{{info}}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BScroll from 'better-scroll';
  import {saveToLocal, loadFromLocal} from 'common/js/store';
  import star from '../star/star.vue';
  import split from '../split/split.vue';
  export default {
    props: {    // 从路由传过来
      seller: {
        type: Object
      }
    },
    data() {
      return {
        // 针对URL存取方案
        favorite: (() => {
          return loadFromLocal(this.seller.id, 'favorite', false);
        })()
      };
    },
    computed: {
      favoriteText() {
        return this.favorite ? '已收藏' : '收藏';
      }
    },
    created () {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    watch: { // 在页面刷新的时候，检测值的变化，但是导航栏切换不会检测
      'seller'() {
        this.$nextTick(() => {
          this._initScroll();
          this._initPics();
        });
      }
    },
    // 初始化时机不对
    // seller是一个异步加载的数据，内容是靠数据撑开
    // 当BS计算高度时，DOM被渲染但内容还未被填充，高度计算错误
    mounted() {
      this.$nextTick(() => {
        this._initScroll();
        this._initPics();
      });
    },
    methods: {
      toggleFavorite(event) {
        if (!event._constructed) {
          return;
        }
        this.favorite = !this.favorite;
        saveToLocal(this.seller.id, 'favorite', this.favorite);
      },
      _initScroll() {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {
            click: true  // 让移动端可点击
          });
        } else {
          this.scroll.refresh();  // mounted 优先执行watch，当scorll已存在，刷新重新计算
        }
      },
      _initPics() {
        if (this.seller.pics) { // 存在图片
          let picWidth = 120;   // 手动设置图片宽度
          let margin = 6;
          let width = (picWidth + margin) * this.seller.pics.length - margin; // ul的总宽度(减去最后一个margin)
          this.$refs.picList.style.width = width + 'px'; // 给ul设置宽度
          this.$nextTick(() => {
            if (!this.picScroll) {
              this.picScroll = new BScroll(this.$refs.picWrapper, {
                scrollX: true,   // 默认纵向滚动,使用横向滚动
                eventPassthrough: 'vertical'  // 忽略垂直方向的滚动(让外层区块纵向滚动)，让内存区块横向滚动，
              });
            } else {
              this.picScroll.refresh();
            }
          });
        }
      }
    },
    components: {
      star,
      split
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
@import '../../common/stylus/mixin.styl'
  .seller
    position absolute
    top 174px
    bottom 0
    left 0
    width 100%
    overflow hidden
    .overview
      padding 18px
      position relative
      .title
        margin-bottom 8px
        line-height 14px
        font-size 14px
        color rgb(7,17,27)
      .desc
        padding-bottom 18px
        font-size 0
        border-1px(rgba(7,17,27,0.1))
        .star
          display inline-block
          margin-right 8px
          vertical-align top
        .text
          display inline-block
          line-height 18px
          margin-right 12px
          vertical-align top
          font-size 10px
          color rgb(77,85,93)
      .remark
        display flex
        padding-top 18px
        .block
          flex 1
          text-align center
          border-right 1px solid rgba(7,17,27,0.1)
          &:last-child
            border none
          h2
            line-height 10px
            margin-bottom 4px
            font-size 10px
            color rgb(147,153,159)
          .content
            line-height 24px
            font-size 10px
            color rgb(7,17,27)
            .stress
              font-size 24px
      .favorite   // *********** 固定宽度
        position absolute
        width 50px
        right 11px
        top 18px
        text-align center
        .icon-favorite
          display block
          margin-bottom 4px
          line-height 24px
          font-size 24px
          color #d4d6d9
          &.active
            color rgb(240,20,20)
        .text
          line-height 10px
          font-size 10px
          color rgb(77,85,93)
    .bulletin
      padding 18px 18px 0 18px
      .title
        margin-bottom 8px
        line-height 14px
        font-size 14px
        color rgb(7,17,27)
      .content-wrapper
        padding 0 12px 16px 12px
        border-1px(rgba(7,17,27,0.1))
        .content
          line-height 24px
          font-size 12px
          font-weight 200
          color rgb(240,20,20)
          text-align justify
      .supports
        .support-item
          padding 16px 12px
          font-size 0
          border-1px(rgba(7,17,27,0.1))
          &:last-child
            border-none()
          .icon
            display inline-block
            vertical-align top
            width 16px
            height 16px
            margin-right 6px
            background-size 16px 16px
            background-repeat no-repeat
            &.decrease
              bg-image('decrease_4')
            &.discount
              bg-image('discount_4')
            &.special
              bg-image('special_4')
            &.invoice
              bg-image('invoice_4')
            &.guarantee
              bg-image('guarantee_4')
          .text
            line-height 16px
            font-size 12px
            color rgb(7,17,27)
    .pics
      padding 18px
      .title
        margin-bottom 12px
        line-height 14px
        font-size 14px
        color rgb(7,17,27)
      // 固定视口大小宽度，图片超出隐藏，图片横向滚动
      .pic-wrapper
        width 100%
        overflow hidden
        white-space nowrap
        .pic-list
          font-size 0
          .pic-item
            display inline-block
            margin-right 6px
            width 120px
            height 90px
            &:last-child
              margin 0
    .info
      padding 18px 18px 0 18px
      color rgb(7,17,27)
      .title
        padding-bottom 12px
        line-height 14px
        font-size 14px
        border-1px(rgba(7,17,27,0.1))
      .info-item
        padding 16px 12px
        line-height 16px
        font-size 12px
        border-1px(rgba(7,17,27,0.1))
        &:last-child
          border-none()
</style>
