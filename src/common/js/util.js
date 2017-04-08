/**
 * 解析url参数
 * http://localhost:8080/?id=12345&a=b#/seller
 *  @example   window.location.search 拿到 ?id=12345&a=b
 * @return Object {id:12345,a:b}
 */
export function urlParse() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg);
  // ['?id=12345', '&a=b']
if (arr) {
arr.forEach((item) => {
   let tempArr = item.substring(1).split('=');
   // 去掉第二个参数，然后用分隔符'=',区分开,连接符不会被正则匹配到
   let key = decodeURIComponent(tempArr[0]);  // 得到是URL参数，需要解码 id
   let val = decodeURIComponent(tempArr[1]);  // 12345
   obj[key] = val;
  });
 }
 return obj;
};
