var name = "a";

var foo = function()
{
    console.log(this.name);
}

var bar = {
    name : "bar",
    foo : foo
}

var baz = {
    name : "baz",
    foo : bar.foo
}

var boo = function()
{
    var name = "boo";
    return foo;
}

var quz = function()
{
    var name = "quz";
    return function() { console.log(name); }
}

var bum = {
    name : "bum",
    foo : function() {
        return function() { this.name = "bum.foo"; console.log(this.name); }
    }
}

foo();
bar.foo();
baz.foo();
boo()();
quz()();
bum.foo()();
var goo = new (bum.foo());
console.log(goo.name);


