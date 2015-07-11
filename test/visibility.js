/**
 * Created by sam on 15/7/9.
 */

describe('Visibility', function(){

  var document = null;

  var webkitSet = function(state){
    document.webkitHidden = state == 'hidden';
    document.webkitVisibilityState = state;
  }

  var set = function(state){
    document.hidden = state == 'hidden';
    document.visibilityState = state;
  }

  beforeEach(function(){
    Visibility._init = false;
    Visibility._callbacks = {};
    Visibility._id = 3;
    Visibility._doc = document = {
      addEventListener: function(){}
    }
    Visibility.name = 'samhwang';
  })

  afterEach(function(){
    for(var method in Visibility){
      Visibility[method] && Visibility[method].restore && Visibility[method].restore();
    }
  })

  it('Hala Mocha', function(){
    expect('foo').to.equal('foo');
  })

  describe('core', function(){
    // core test begin

    describe('._getPrefix', function(){

      beforeEach(function(){
        Visibility._prefixCached = null;
      })

      after(function(){
        Visibility._prefixCached = null;
      })

      it('if _prefixCached is empty in webkit core, return webkit', function(){
        webkitSet('hidden');
        expect(Visibility._getPrefix()).to.equal('webkit');
      })

      it('if _prefixCached is empty in webkit core，_prefixCached should be webkit', function(){
        webkitSet('hidden');
        Visibility._getPrefix();
        expect(Visibility._prefixCached).to.equal('webkit');
      })

      it('if _prefixCached is empty in common core，return empty', function(){
        set('hidden');
        expect(Visibility._getPrefix()).to.equal('');
      })

      it('if _prefixCached is empty in common core，_prefixCached should be empty', function(){
        set('hidden');
        Visibility._getPrefix();
        expect(Visibility._prefixCached).to.equal('');
      })

      it('if _prefixCached is not empty, return itself', function(){
        Visibility._prefixCached = 'foobar';
        expect(Visibility._getPrefix()).to.equal('foobar');
      })

    })

    describe('._getPropName', function(){

      it('._getPrefix should be call', function(){

      })

      it('if _prefixCached is empty, first letter will be lowercase', function(){

      })

      it('if _prefixCached is not empty, will prepend prefix to itself with first letter uppercased', function(){
        
      })

    })

    // core test end
  })

  describe('fallback', function(){
  })


});