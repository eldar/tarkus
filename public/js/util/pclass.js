/**
  * Little OOP library, borrowed from
  * http://www.ruzee.com/blog/2008/12/javascript-inheritance-via-prototypes-and-closures
  * Subject to change.
  */
(function(){
  var isFn = function(fn) { return typeof fn == "function"; };
  PClass = function(){};
  PClass.create = function(proto) {
    var k = function(magic) { // call init only if there's no magic cookie
      if (magic != isFn && isFn(this.init)) this.init.apply(this, arguments);
    };
    k.prototype = new this(isFn); // use our private method as magic cookie
    for (key in proto) (function(fn, sfn){ // create a closure
      k.prototype[key] = !isFn(fn) || !isFn(sfn) ? fn : // add _super method
        function() { this._super = sfn; return fn.apply(this, arguments); };
    })(proto[key], k.prototype[key]);
    k.prototype.constructor = k;
    k.extend = this.extend || this.create;
    return k;
  };
})();