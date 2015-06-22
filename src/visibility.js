/**
 * Created by sam on 15/6/22.
 *
 * Public Method Support:
 * isSupport();         -- check visibility is supported
 * onceVisible();       -- when page is visible, trigger once, then destroy itself
 * onVisible();         -- when page is visible, trigger
 * onHidden();          -- when page is hidden, trigger
 * onStateChange();     -- when page visible state is changed, trigger
 * afterPrerender();    -- trigger at any state except 'prerender'
 *
 * Public Attributes Support:
 * state
 */

+function(global){

  'use strict';

  var _self = {
    _doc: document || {},
    _callbacks: {},

    _prefixes: ['webkit', 'ms', 'o', 'moz', 'khtml'],
    _prefixCached: undefined,

    _propHidden: 'Hidden',
    _getHidden: function(){
      return _self._getPropValue(_self._propHidden);
    },

    _propState: 'VisibilityState',
    _getState: function(){
      return _self._getPropValue(_self._propState);
    },

    _propEvent: 'visibilitychange',

    _getPrefix: function(){
      var prefixItem,
        i = 0;

      /*
      * 若前缀尚未知道，则遍历_prefixes 数组，看document 中是否存在hidden 属性
      * 1. 如果存在，则设置前缀，并跳过整个遍历；
      * 2. 如果不存在，则设置前为空字符串；
      *
      * 最后，返回前缀
      * */
      if(typeof _self._prefixCached === 'undefined'){
        for(; prefixItem = _self._prefixes[i++];){
          if((prefixItem + _self._propHidden) in _self._doc){
            _self._prefixCached = prefixItem;
            break;
          }else{
            _self._prefixCached = '';
          }
        }
      }
      return _self._prefixCached;
    },

    _getPropName: function(name){
      var _prefix, _propWithPrefix;

      if(!name)
        return '';

      _prefix = _self._getPrefix();

      if(_prefix === ''){
        _propWithPrefix = name.substring(0, 1).toLowerCase() + name.substring(1);
      }else{
        _propWithPrefix = _prefix + name.substring(0, 1).toUpperCase() + name.substring(1);
      }

      return _propWithPrefix;
    },

    _getPropValue: function(name){
      var _propWithPrefix, _propValue;

      if(!name){
        return '';
      }

      _propWithPrefix = _self._getPropName(name);
      _propValue = _self._doc[_propWithPrefix];

      return _propValue;
    }
  };

  var self = {
    state: null,
    isSupport: function(){

    },
    onceVisible: function(){

    },
    onVisible: function(){

    },
    onHidden: function(){

    },
    onStateChange: function(event){

    },
    afterPrerender: function(){

    },
    unbind: function(id){

    }
  };

  if(typeof 'module' !== 'undefined' && module.exports){
    module.exports = self;
  }else{
    global.Visibility = self;
  }

}(this);
