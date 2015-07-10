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

  beforEach(function(){

  })

  afterEach(function(){

  })

  it('Hala Mocha', function(){
    expect('foo').to.equal('foo');
  })

  describe('_self', function(){
  })

  describe('self', function(){
  })

  describe('fallback', function(){
  })

});