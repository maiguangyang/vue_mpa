import Jsencrypt from 'jsencrypt';

// 用服务器公key加密
export const JsEncrypt = new Jsencrypt();
export const encrypt = (value, pubKey) => {
  if (_.isObject(value)) {
    value = JSON.stringify(value);
  }
  pubKey = window.atob(pubKey);
  JsEncrypt.setPublicKey(pubKey);

  if (JsEncrypt.getPublicKey().replace(/[\r\n]/g, '') !== pubKey.replace(/[\r\n]/g, '')) {
    return false;
  }

  let str = '';
  const limitLen = 117;
  for (let i = 0; i < value.length; i += limitLen) {
    str += JsEncrypt.encrypt(value.slice(i, i + limitLen));
  }
  return str;
};

// 用本地私key解密（把本地公key给服务器加密返回的加密串）
export const JsDecrypt = new Jsencrypt();
export const decrypt = (value) => {
  const limitLen = 172;
  const valueLen = value.length;
  if (valueLen % limitLen !== 0) {
    return false;
  }

  let str = '';
  for (let i = 0; i < valueLen; i += limitLen) {
    str += JsDecrypt.decrypt(value.slice(i, i + limitLen));
  }

  try {
    return JSON.parse(str);
  } catch (err) {
    return str;
  }
};
