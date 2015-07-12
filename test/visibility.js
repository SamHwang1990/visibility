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
    Visibility._prefixCached = null;
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

      it('if name param is undefined, return empty', function(){
        expect(Visibility._getPropName()).to.equal('');
      })

      it('if name param is blank, return empty', function(){
        expect(Visibility._getPropName('')).to.equal('');
      })


      it('._getPrefix should be call once', function(){
        var spy = sinon.spy(Visibility, '_getPrefix');
        var propHideen = Visibility._getPropName('hidden');
        expect(spy).to.have.been.calledOnce;
      })

      it.skip('if _getPrefix return empty, first letter will be lowercase', function(){
        var stub = sinon.stub(Visibility, '_getPrefix');
        stub.returns('');
        expect(Visibility._getPropName('SamHwang')).to.be.equal('samHwang');
        expect(Visibility._getPropName('samHwang')).to.be.equal('samHwang');
      })

      it.skip('if _prefixCached return not empty, will prepend prefix to itself with first letter uppercased', function(){
        var stub = sinon.stub(Visibility, '_getPrefix');
        stub.returns('prefix');
        expect(Visibility._getPropName('SamHwang')).to.be.equal('prefixSamHwang');
        expect(Visibility._getPropName('samHwang')).to.be.equal('prefixSamHwang');
      })

      it('in webkit core, prepend webkit to itself with first letter uppercased', function(){
        webkitSet('hidden');
        expect(Visibility._getPropName('state')).to.be.equal('webkitState');
      })

      it('in common core, first letter of name will be lowercase', function(){
        set('visible');
        expect(Visibility._getPropName('State')).to.be.equal('state');
      })

    })

    describe('._getPropValue', function(){

      it('if name param is undefined, return empty', function(){
        expect(Visibility._getPropValue()).to.equal('');
      })

      it('if name param is empty, return empty', function(){
        expect(Visibility._getPropValue('')).to.equal('');
      })



    })

    // core test end
  })

  describe('fallback', function(){
  })


});