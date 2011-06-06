

var Foo = function() {
}

Foo.prototype = {
    foo: "foo"
}

var foo = new Foo();

Object.prototype.foo = 42;
var bar = new Object();

/*
console.log(Foo.prototype);
console.log(foo.prototype);
console.log(Object.getPrototypeOf(foo));
console.log(Object.getOwnPropertyDescriptor(foo, "foo"));
console.log(Object.getOwnPropertyDescriptor(Object.getPrototypeOf(foo), "foo"));
*/
console.log(Object.hasOwnProperty(bar, "foo"));
