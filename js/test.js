var A = function()
{
    console.log("in A");    
}

console.log(A.prototype.constructor == A);


var a = new A();


