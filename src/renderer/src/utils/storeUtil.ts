
const Store = require('electron-store');
const store = new Store();

const setObj = (map: Map<any, any>): void => {
  map.forEach((v, k) => {
    store.set(k, v);
  })
};

const getObjByKey = (key: string): any => {
  const result = store.get(key);
  return result;
};

const objCastToMap = (obj) => {
  let map = new Map();
  for(let key in obj) {
    map.set(key,obj[key]);
  }
  return map;
}

export default {
  setObj,
  getObjByKey,
  objCastToMap
};
