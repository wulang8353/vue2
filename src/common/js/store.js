/**
 * 缓存函数
 */
export function saveToLocal(id, key, value) {   // 商家的id、字段、值
  let seller = window.localStorage.__seller__;  // eslint 指定在window空间下
  if (!seller) {
    seller = {};
    seller[id] = {};
  } else {
    seller = JSON.parse(seller);
    if (!seller[id]) {
    seller[id] = {};
  }
}
  seller[id][key] = value;
  window.localStorage.__seller__ = JSON.stringify(seller);  // 不能直接存储对象，JSON字符串
};

export function loadFromLocal(id, key, def) {
  let seller = window.localStorage.__seller__;
  if (!seller) {
    return def;
  }
  seller = JSON.parse(seller)[id];  // JSON字符串
  if (!seller) {
    return def;
  }
  let ret = seller[key];
  return ret || def;
};
