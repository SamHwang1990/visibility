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

  var unset = function(){
    document = null;
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

    unset();

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

      it('.getPropName should be call once', function(){
        var spy = sinon.spy(Visibility, '_getPropName');
        var propValue = Visibility._getPropValue('hidden');
        expect(spy).to.have.been.calledOnce;
      })

      it('if name param is not a property of doc, return undefined', function(){
        set('visible');
        expect(Visibility._getPropValue('notexist')).to.be.undefined;
        // expect(Visibility._getPropValue('notexist')).to.be.an('undefined');
      })

      it('set document to hidden, get the correct value', function(){
        webkitSet('hidden');
        expect(Visibility._getPropValue('hidden')).to.be.true;
        expect(Visibility._getPropValue('visibilityState')).to.be.equal('hidden');
      })

      it('set document to visible, get the correct value', function(){
        set('visible');
        expect(Visibility._getPropValue('hidden')).to.be.false;
        expect(Visibility._getPropValue('visibilityState')).to.be.equal('visible');
      })

    })

    describe('._listen', function(){

      it('if _init is true, addEventListener should not be called', function(){
        var spy = sinon.spy(document, 'addEventListener');
        Visibility._init = true;
        Visibility._listen();
        expect(spy).to.not.have.been.called;
      })

      it('sets listener only once, and _init is set to true', function(){
        var spy = sinon.spy(document, 'addEventListener');

        Visibility._listen();
        Visibility._listen();

        expect(spy).to.have.been.calledOnce;
        expect(Visibility._init).to.be.true;

      })

      it('sets listener', function(){
        var _listener = null,
            spy;

        document.addEventListener = function(a, b, c){
          _listener = b;
        }

        spy = sinon.spy(Visibility, '_executeChange');
        Visibility._listen();
        _listener();

        expect(spy).to.have.been.called;
        expect(spy).to.have.been.calledOn(Visibility);

      })

      it('sets listener on IE', function(){
        var spy;

        Visibility._doc = document = {
          attachEvent: function(){}
        }

        spy = sinon.spy(document, 'attachEvent');
        Visibility._listen();

        expect(spy).to.have.been.called;

      })
    })

    describe('.state', function(){

      it('._getState() shall be called', function(){
        var spy = sinon.spy(Visibility, '_getState');
        Visibility.state();
        expect(spy).to.have.been.called;
      })

      it('if state is undefined in document, return default value: visible', function(){
        Visibility._doc = document = {};
        expect(Visibility.state()).to.equal('visible');
      })

      it('return the state of document', function(){
        webkitSet('hidden');
        expect(Visibility.state()).to.equal('hidden');
        expect(Visibility.state()).to.not.equal('visible');
      })

    })

    describe('.isSupport', function(){

      it('._getState() shall be called', function(){
        var spy = sinon.spy(Visibility, '_getState');
        Visibility.isSupport();
        expect(spy).to.have.been.called;
      })

      it('if state is undefined in document, return false', function(){
        Visibility._doc = document = {};
        expect(Visibility.isSupport()).to.be.false;
      })

      it('if state is defined in document, return true', function(){
        webkitSet('visible');
        expect(Visibility.isSupport()).to.be.true;
      })

    })

    describe('.onceVisible', function(){

      it('if not support, return false, without callback called', function(){
        var stub = sinon.stub(Visibility, 'isSupport');
        var spy = sinon.spy();
        var onChangeSpy = sinon.spy(Visibility, 'onChange');
        stub.returns(false);

        expect(Visibility.onceVisible(spy)).to.be.false;
        expect(stub).to.have.been.called;
        expect(spy).to.have.not.been.called;
        expect(onChangeSpy).to.have.not.been.called;
      })

      it('if current state is visible, callback will be called at once', function(){
        webkitSet('visible');

        var cbSpy = sinon.spy(),
            onChangeSpy = sinon.spy(Visibility, 'onChange');

        expect(Visibility.onceVisible(cbSpy)).to.be.true;
        expect(cbSpy).to.have.been.calledOnce;
        expect(onChangeSpy).to.have.not.been.called;

      })

      it('when state change to visible, .unbind and callback will be called', function(){

      })

    })

    // core test end
  })

  describe('fallback', function(){
  })


});