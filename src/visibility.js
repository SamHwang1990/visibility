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
 *
 * Public Attributes Support:
 * state
 */

;(function(global){

  'use strict';

  var self = {
    state: function () {
      return self._getState() || 'visible';
    },
    isSupport: function(){
      return !! self._getState();
    },
    onceVisible: function(callback){
      var cbId;

      if(!self.isSupport()){
        return false;
      }

      // 如果当前
      if(!self._getHidden()){
        (typeof callback === 'function') && (callback());
        return true;
      }

      cbId = self.onChange(function(state){
        if(!self._getHidden()){
          self.unbind(cbId);
          (typeof callback === 'function') && (callback());
        }
      });

      return cbId;
    },
    onVisible: function(callback){
      var cbId;

      if(!self.isSupport()){
        return false;
      }

      if(!self._getHidden()){
        (typeof callback === 'function') && (callback());
      }

      cbId = self.onChange(function(state){
        if(!self._getHidden()){
          (typeof callback === 'function') && (callback());
        }
      });

      return cbId;
    },
    onHidden: function(callback){
      var cbId;

      if(!self.isSupport()){
        return false;
      }

      if(self._getHidden()){
        (typeof callback === 'function') && (callback());
      }

      cbId = self.onChange(function(state){
        if(self._getHidden()){
          (typeof callback === 'function') && (callback());
        }
      });

      return cbId;
    },
    onChange: function(callback){
      var cbId;

      if(!self.isSupport()) return false;

      cbId = self._id++;
      self._callbacks[cbId] = callback;
      self._listen();

      return cbId;
    },
    afterPrerender: function(callback){
      var _prerender = 'prerender',
          cbId;

      if(!self.isSupport()) return false;

      if(self._getState() !== _prerender){
        (typeof callback === 'function') && (callback());
        return true;
      }

      cbId = self.onChange(function(state){
        if(state !== _prerender){
          self.unbind(cbId);
          (typeof callback === 'function') && (callback());
        }
      });

      return cbId;

    },
    unbind: function(id){
      return delete self._callbacks[id];
    },

    // 私有变量、方法
    _id: 0,                     // 回调ID
    _doc: document || {},
    _callbacks: {},

    _prefixes: ['webkit', 'ms', 'o', 'moz', 'khtml'],
    _prefixCached: null,

    _propHidden: 'Hidden',
    _getHidden: function(){
      return self._getPropValue(self._propHidden);
    },

    _propState: 'VisibilityState',
    _getState: function(){
      return self._getPropValue(self._propState);
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
      if(self._prefixCached == null){
        for(; prefixItem = self._prefixes[i++];){
          if((prefixItem + self._propHidden) in self._doc){
            self._prefixCached = prefixItem;
            break;
          }else{
            self._prefixCached = '';
          }
        }
      }
      return self._prefixCached;
    },

    _getPropName: function(name){
      var _prefix, _propWithPrefix;

      if(!name)
        return '';

      _prefix = self._getPrefix();

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

      _propWithPrefix = self._getPropName(name);
      _propValue = self._doc[_propWithPrefix];

      return _propValue;
    },

    _listen: function(){
      var listenFunc;

      if(self._init){
        return;
      }

      listenFunc  = function(){
        self._executeChange.apply(self, arguments);
      };

      if(self._doc.addEventListener){
        self._doc.addEventListener(self._propEvent, listenFunc);
      }else{
        self._doc.attachEvent(self._propEvent, listenFunc);
      }

      self._init = true;
    },

    _executeChange: function(event){
      var state = self.state();

      for(var id in self._callbacks){
        (typeof self._callbacks[id] === 'function') && self._callbacks[id].call(self._doc, state, event);
      }
    }

  };

  var fallback = {
    _doc: document,
    _hiddenProp: self._getPropName(self._propHidden),
    _stateProp: self._getPropName(self._propState),
    stateChangeEvent: undefined,
    init: function(){
      if(self.isSupport()){
        return false;
      }

      fallback._doc[fallback._hiddenProp] = false;
      fallback._doc[fallback._stateProp]  = 'visible';

      if(fallback._doc.addEventListener){
        fallback._doc.addEventListener('focus', fallback.onFocus, true);
        fallback._doc.addEventListener('blur', fallback.onBlur, true);
      }else{
        fallback._doc.attachEvent('onfocusin', fallback.onFocus);
        fallback._doc.attachEvent('onfocusout', fallback.onBlur);
      }
    },
    onFocus: function(){
      fallback._doc[fallback._hiddenProp] = false;
      fallback._doc[fallback._stateProp]  = 'visible';
      fallback.fireEvent();
    },
    onBlur: function(){
      fallback._doc[fallback._hiddenProp] = true;
      fallback._doc[fallback._stateProp]  = 'hidden';
      fallback.fireEvent();
    },
    fireEvent: function(){
      if(fallback._doc.createEvent){
        if(!fallback.stateChangeEvent){
          fallback.stateChangeEvent = fallback._doc.createEvent('HTMLEvents');
          fallback.stateChangeEvent.initEvent(self._propEvent, true, true);
        }
        fallback._doc.detachEvent(fallback.stateChangeEvent);
      }else{
        self._executeChange();
      }
    }

  };

  fallback.init();

  if(typeof(module) !== 'undefined' && module.exports){
    module.exports = self;
  }else{
    global.Visibility = self;
  }

})(this);
