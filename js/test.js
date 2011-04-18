var A = function()
{
    this.dynamicallyAddedInCtor = 1;
}

A.prototype.instance = 2;
A.static = 3;

var a = new A();

console.log(a.dynamicallyAddedInCtor);
console.log(a.instance);
console.log(A.static);
