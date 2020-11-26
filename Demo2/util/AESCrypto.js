/**
 * AES加密
 * 需要引用crypto-js.min.js
 * @example
 * 加密
 * var aes = new AESCrypto();
 * var mw = aes.encryptor(CryptoJS.enc.Utf8.parse("这里是明文"));
 * mw = mw.toString();
 *
 * 解密
 * mw = aes.decryptor(CryptoJS.enc.Hex.parse(mw));
 * mw.toString(CryptoJS.enc.Utf8);
 * 
*/
export default function AESCrypto (Key, Iv){

    var CryptoJS = require('crypto-js');

    var CONST_STR = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    var RandomByMaxValue = function (maxValue) {
        return parseInt(Math.random() * maxValue, 10);
    }


    this.key = Key;
    this.iv = Iv;
    /**
     * 创建秘钥
     * @returns 秘钥，utf8格式字符串
     */
    this.createKey = function () {
        return this.__proto__.createKey(32);
    };
    /**
     * 创建偏移量
     * @returns 偏移量，utf8格式字符串
     */
    this.createIv = function () {
        return this.__proto__.createIv(32);
    };
    /**
     * 加密
     * @param {CryptoJS.lib.WordArray} plaintextWordArray 明文
     * @returns {CryptoJS.lib.WordArray} 密文
     * @example
     * var aes = new AESCrypto();
     * var mw = aes.Encryptor(CryptoJS.enc.Utf8.parse("这里是明文"));
     * mw.toString();
     */
    this.encryptor = function (plaintextWordArray) {
        return this.__proto__.encryptor(plaintextWordArray, this.key, this.iv ? this.iv : undefined);
    };
    /**
     * 解密
     * @param {CryptoJS.lib.WordArray} ciphertextWordArray 密文
     * @returns {CryptoJS.lib.WordArray} 明文
     * @example
     * var aes = new AESCrypto();
     * var mw = aes.Encryptor(CryptoJS.enc.Hex.parse("e8bf99e9878ce698afe6988ee69687"));
     * mw.toString(CryptoJS.enc.Utf8.toLocaleString);
     */
    this.decryptor = function (ciphertextWordArray) {
        return this.__proto__.decryptor(ciphertextWordArray, this.key, this.iv ? this.iv : undefined);
    };
    /**
     * 从utf8格式转成wordArray
     * @param {Array} value utf8格式字符串
     * @returns {CryptoJS.lib.WordArray} wordArray
     */
    this.fromUtf8String = fromUtf8String;
    /**
     * 从bit格式转成wordArray
     * @param {Array} value bit格式字符串
     * @returns {CryptoJS.lib.WordArray} wordArray
     */
    this.fromBitString = fromBitString;
    /**
     * 从wordArray格式转成utf8
     * @param {CryptoJS.lib.WordArray} wordArray
     * @returns {Array} value utf8格式字符串
     */
    this.toUtf8String = toUtf8String;
    /**
     * 从wordArray格式转成bit
     * @param {CryptoJS.lib.WordArray} wordArray
     * @returns {Array} value bit格式字符串
     */
    this.toBitString = toBitString;

    this.__proto__.createKey = createString;
    this.__proto__.createIv = createString;
    this.__proto__.encryptor = encryptor;
    this.__proto__.decryptor = decryptor;

    if (!this.key && !this.iv) {
        this.key = this.__proto__.key = this.createKey();
        this.iv = this.__proto__.iv = this.createIv();
    } else if (!this.key) {
        this.key = this.__proto__.Key = this.createKey();
    }

    if (this.key) this.key = this.__proto__.key = fromUtf8String(this.key);
    if (this.iv) this.iv = this.__proto__.iv = fromBitString(this.iv);

    /**
     * 加密
     * @param {CryptoJS.lib.WordArray} plaintextWordArray 明文
     * @param {CryptoJS.lib.WordArray} keyWordArray 秘钥
     * @param {CryptoJS.lib.WordArray} ivWordArray 偏移量
     * @returns {CryptoJS.lib.WordArray} 密文
     */
    function encryptor(plaintextWordArray, keyWordArray, ivWordArray) {
        var encryptedData = undefined;
        if (ivWordArray == null || ivWordArray == undefined) {
            encryptedData = CryptoJS.AES.encrypt(plaintextWordArray, keyWordArray, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
            });
        } else {
            encryptedData = CryptoJS.AES.encrypt(plaintextWordArray, keyWordArray, {
            iv: ivWordArray,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
            });
        }
        if (encryptedData != null && encryptedData != undefined) {
            return encryptedData.ciphertext;
        }
        return undefined;
    }
    /**
     * 解密
     * @param {CryptoJS.lib.WordArray} ciphertextWordArray 密文
     * @param {CryptoJS.lib.WordArray} keyWordArray 秘钥
     * @param {CryptoJS.lib.WordArray} ivWordArray 偏移量
     * @returns {CryptoJS.lib.WordArray} 明文
     */
    function decryptor(ciphertextWordArray, keyWordArray, ivWordArray) {
        var decryptedData = undefined;

        //密文必须为Base64格式的字符串
        var ciphertext = ciphertextWordArray.toString(CryptoJS.enc.Base64);

        if (ivWordArray == null || ivWordArray == undefined) {
            decryptedData = CryptoJS.AES.decrypt(ciphertext, keyWordArray, {
            mode: CryptoJS.mode.ECB,
            padding: CryptoJS.pad.Pkcs7
            });
        } else {
            decryptedData = CryptoJS.AES.decrypt(ciphertext, keyWordArray, {
            iv: ivWordArray,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
            });
        }
        return decryptedData;
    }

    function fromUtf8String(value) {
        return CryptoJS.enc.Utf8.parse(value);
    }

    function fromBitString(value) {
        return CryptoJS.enc.Hex.parse(value);
    }

    function toUtf8String(value) {
        return CryptoJS.enc.Utf8.stringify(value);
    }

    function toBitString(value) {
        return CryptoJS.enc.Hex.stringify(value);
    }

    function createString(length) {
        var a = '';
        for (var i = 0; i < 32; i++) {
            a += CONST_STR[RandomByMaxValue(CONST_STR.length)];
        }
        return a;
    }
}