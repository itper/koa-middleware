var App = function(){
    this.middleware = [];
    this.next = [];
}

App.prototype.use = function(fn){
    this.middleware.push(fn);
};

App.prototype.start = function(){
    var middleware = this.middleware;
    return function *(){

        var j = middleware.length;
        var next = function*(){}();
        while(j--){
            next = middleware[j].call(this,next);
        }
        return yield * next;
    }
}
var app = new App();
app.use(function*(next){
    console.log(1);
    yield next;
    console.log('next '+next);
    console.log(10);
});
app.use(function*(next){
    console.log(2);
    yield next;
    console.log(20);
});
app.use(function*(next){
    console.log(3);
    yield next;
    console.log(30);
    yield next;
    console.log('23123');
});
var c = app.start()();
function co(gen){
    var n = gen.next('123');
    if(isGeneratorFunction(n.value)){
         if(!n.done){
            co(n.value);
        }
    }
    if(!n.done)
    co(gen);
}
co(c);
function isGenerator(obj) {
  return 'function' == typeof obj.next && 'function' == typeof obj.throw;
}
/**
 * Check if `obj` is a generator function.
 *
 * @param {Mixed} obj
 * @return {Boolean}
 * @api private
 */
function isGeneratorFunction(obj) {
  if(!obj)return;
  var constructor = obj.constructor;
  if (!constructor) return false;
  if ('GeneratorFunction' === constructor.name || 'GeneratorFunction' === constructor.displayName) return true;
  return isGenerator(constructor.prototype);
}
