# 框架

> vuex　+　vue-router +　vue-resourse + webpack + axios
```
npm install

npm run dev

npm run build

```
### webpack核心插件
代码热更新，修改代码之后网页无刷新改变，对前端开发来说非常的方便

PostCss，再也不用去管兼容性的问题了，只针对chrome写css代码，会自动编译生成支持多款浏览器的css代码

Eslint，统一代码风格，规避低级错误，对于有代码洁癖的人来说是绝对的好东西，不过有些地方的代码校验有时候也挺麻烦的-.-

bable，ES2015出来已经有一段时间了，但是不少浏览器还没有兼容ES6.有了bable，放心使用ES6语法，它会自动转义成ES5语法。

Stylus，类似于SASS/SCSS，但是可以不写{}和“：”，使用起来还是很方便的

### 布局方式

Sticky footers: 如果页面内容不够长的时候，页脚块粘贴在视窗底部；如果内容足够长时，页脚块会被内容向下推送

```
<div class="wrapper clearfix">
  <div class="main"></div>
</div>
<div class="close"></div>

<style lang="stylus" rel="stylesheet/stylus">
.wrapper  //  最小高度应该和窗口一样高
  min-height 100%
  width 100%
  .main
    margin-top 64px
    padding-bottom 64px  //  内容撑开一定高度给关闭符号
</style>
```
