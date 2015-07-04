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

+function(global){

  'use strict';

  var fallback = function(){
    var onFocus, onBlur, fireEvent, stateChangeEvent;
    var _doc        = document,
        _hiddenProp = _self._getPropName(_self._propHidden),
        _stateProp  = _self._getPropName(_self._propState);

    if(self.isSupport()){
      return false;
    }

    _doc[_hiddenProp] = false;
    _doc[_stateProp]  = 'visible';

    fireEvent = function(){
      if(_doc.createEvent){
        if(!stateChangeEvent){
          stateChangeEvent = _doc.createEvent('HTMLEvents');
          stateChangeEvent.initEvent(_self._propEvent, true, true);
        }
      }else{
        _self._executeChange();
      }
    };

    onFocus = function(){
      _doc[_hiddenProp] = false;
      _doc[_stateProp]  = 'visible';
      fireEvent();
    };

    onBlur = function(){
      _doc[_hiddenProp] = true;
      _doc[_stateProp]  = 'hidden';
      fireEvent();
    };

    if(_doc.addEventListener){
      _doc.addEventListener('focus', onFocus, true);
      _doc.addEventListener('blur', onBlur, true);
    }else{
      _doc.attachEvent('onfocusin', onFocus);
      _doc.attachEvent('onfocusout', onBlur);
    }


  };

  var _self = {
    _id: 0,
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
      if(_self._prefixCached == null){
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
    },

    _listen: function(){
      var listenFunc;

      if(self.init){
        return;
      }

      listenFunc  = function(){
        _self._executeChange.apply(_self, arguments);
      };

      if(_self._doc.addEventListener){
        _self._doc.addEventListener(_self._propEvent, listenFunc);
      }else{
        _self._doc.attachEvent(_self._propEvent, listenFunc);
      }

      self.init = true;
    },

    _executeChange: function(event){
      var state = self.state();

      for(var id in _self._callbacks){
        (typeof _self._callbacks[id] === 'function') && _self._callbacks[id].call(_self._doc, state, event);
      }
    }
  };

  var self = {
    state: function () {
      return _self._getState() || 'visible';
    },
    isSupport: function(){
      return !! _self._getState();
    },
    onceVisible: function(callback){
      var cbId;

      if(!self.isSupport()){
        return false;
      }

      if(!_self._getHidden()){
        (typeof callback === 'function') && (callback());
        return true;
      }

      cbId = self.onChange(function(state){
        if(!_self._getHidden()){
          self.unbind(cbId);
          (typeof callback === 'function') && (callback());
        }
      });

      return cbId;
    },
    onVisible: function(callback){
      var cbId, visibleCb;

      if(!self.isSupport()){
        return false;
      }

      if(!_self._getHidden()){
        (typeof callback === 'function') && (callback());
      }

      cbId = self.onChange(function(state){
        if(!_self._getHidden()){
          (typeof callback === 'function') && (callback());
        }
      });

      return cbId;
    },
    onHidden: function(callback){
      var cbId, hiddenCb;

      if(!self.isSupport()){
        return false;
      }

      if(_self._getHidden()){
        (typeof callback === 'function') && (callback());
      }

      cbId = self.onChange(function(state){
        if(_self._getHidden()){
          (typeof callback === 'function') && (callback());
        }
      });

      return cbId;
    },
    onChange: function(callback){
      var cbId;

      if(!self.isSupport()) return false;

      cbId = _self._id++;
      _self._callbacks[cbId] = callback;
      _self._listen();

      return cbId;
    },
    afterPrerender: function(callback){
      var _prerender = 'prerender',
          cbId;

      if(!self.isSupport()) return false;

      if(_self._getState() !== _prerender){
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
      return delete _self._callbacks[id];
    }
  };

  fallback();

  if(typeof(module) !== 'undefined' && module.exports){
    module.exports = self;
  }else{
    global.Visibility = self;
  }

}(this);
