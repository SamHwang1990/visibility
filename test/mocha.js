/**
 * Created by sam on 15/7/8.
 */

sinon = require('sinon');   // 第一步：引入sinon，防止sinon.fakeServer 报错

window = global;            // 第二步：如果没有使用phantomJS 或karma，window 是undefined 的，所以，自行创建一个window 全局变量
document = {                // 第三部：如果没有使用phantomJS 或karma，document 是undefined 的，所以，自行创建一个document 全局变量
  addEventListener: function(){},   // fallback 用到
  createEvent     : function(){},   // fallback 用到
  createElement   : function(){}    // sinon 会调用document 中方法
}

Visibility = require('../src/visibility');

chai = require('chai');
sinonChai = require('sinon-chai');
expect = chai.expect;               // 这里使用expect assert style，因为should style 的兼用行需要考虑
chai.use(sinonChai);
