
/**
 * hmac-sha1 签名
 * 需要引用crypto-js.min.js
 * @example
 * 签名
 * var shasign = new Hmacsha1Sign(CryptoJS.enc.Utf8.parse('ABCD'));
 * var sign = shasign.sign(CryptoJS.enc.Utf8.parse('1234567890qwertyuiop'));
 * sign.toString();//或者sign.toString(CryptoJS.enc.Base64);
 *
 * 验证签名
 * var value = shasing.verifySign(CryptoJS.enc.Base64.parse(sign));
 * value.toString(CryptoJS.enc.Utf8);
 *
*/
export default function Hmacsha1Sign(key){
  var CryptoJS = require('crypto-js');

  this.key = key;

  /**
   * 签名
   * @param {CryptoJS.lib.WordArray} valueWordArray 正文
   * @returns {CryptoJS.lib.WordArray} 已签名WordArray ，格式：签名+正文
  */
  this.__proto__.sign = function(valueWordArray) {
    return sign(valueWordArray, this.key);
  }

   /**
   * 验证签名
   * @param {CryptoJS.lib.WordArray} signWordArray 含起签名的正文
   * @returns {CryptoJS.lib.WordArray} 正文
   * @exception 验证签名失败
  */
  this.__proto__.verifySign = function (signWordArray) {
    return verifySign(signWordArray, this.key);
  }

  /**
   * 签名
   * @param {CryptoJS.lib.WordArray} valueWordArray 正文
   * @param {CryptoJS.lib.WordArray} keyWordArray   签名Key
   * @returns {CryptoJS.lib.WordArray} 已签名WordArray ，格式：签名+正文
   */
  function sign(valueWordArray, keyWordArray) {
    var resulttext = CryptoJS.HmacSHA1(valueWordArray, keyWordArray);
    resulttext = resulttext.concat(valueWordArray);
    return resulttext;
  }
  
   /**
   * 验证签名
   * @param {CryptoJS.lib.WordArray} signWordArray 含起签名的正文
   * @param {CryptoJS.lib.WordArray} keyWordArray   签名Key
   * @returns {CryptoJS.lib.WordArray} 正文
   * @exception 验证签名失败
  */
  function verifySign (signWordArray, keyWordArray) {
    var sign1 = getSign(signWordArray);
    var value = getCiphetext(signWordArray);
    var sign2 = CryptoJS.HmacSHA1(value, keyWordArray);
    if (sign1.toString() === sign2.toString()) {
      return value;
    }
    throw "验证签名失败！";
  }
  
  /**
   * 从已签名正文中获取签名
   * @param {CryptoJS.lib.WordArray} wordArray 从已签名正文
   * @returns {CryptoJS.lib.WordArray} 签名
   */
  function getSign(wordArray) {
    var words = wordArray.words;
    var sigBytes = wordArray.sigBytes;
    words = words.slice(0, 5);
    return new CryptoJS.lib.WordArray.init(words, 20);
  }
  
  /**
   * 从已签名正文中获取正文
   * @param {CryptoJS.lib.WordArray} wordArray 从已签名正文
   * @returns {CryptoJS.lib.WordArray} 正文
   */
  function getCiphetext(wordArray) {
    var words = wordArray.words;
    var sigBytes = wordArray.sigBytes;
    words = words.slice(5, words.length);
    return new CryptoJS.lib.WordArray.init(words, sigBytes - 20);
  }
}