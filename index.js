var Emitter = require('emitter')

var methods = {
  incr: function (val) { 
    return this(this.value + (val || 1)) 
  },
  toggle: function (val) { 
    return this(!this.value) 
  },
  change: function(fn) {
    if(fn) {
      this.on('change', fn)          // setup observer
    }
    else { // force the change
      var val = this()
      this.emit('change', val, this.old)
    }
    return this
  },
  toString: function() { 
    return "attr:"+JSON.stringify(this.value)
  }
}

Emitter(methods)

function extend(a, b) {
  for(var i in b) a[i] = b[i]
}

/* 
 * simple attribute
 */

var watcher = false

function Attr(arg) {

  // IDEA: autocreate computed attr for function values
  // if(typeof arg =='function') return Attr.computed(arg)

  function attr(v) {
    if(arguments.length) {
      // setter
      attr.old = attr.value
      attr.value = v
      
      attr.emit('change', attr.value, attr.old)
    } else {
      if(watcher) watcher(attr)
    }
    return attr.value
  }

  // mixin common methods
  extend(attr, methods)
  
  // set to initial
  attr.value = arg
  
  return attr
}



Attr.dependencies = function(fn) {
  var deps = []
  // watches for simple attr reads
  watcher = function(attr) {
    deps.push(attr)
  }
  var val = fn()
  watcher = false
  return {
    value: val,
    depends: deps
  }
}


/* 
 * computed attribute
 */

Attr.computed = function(fn, depends) {
  function attr() {
    // nb - there is no setter
    attr.old = attr.value
    attr.value = fn()
    attr.emit('change', attr.value, attr.old)
    return attr.value
  }

  // mixin common methods
  extend(attr, methods)

  // setup dependencies
  if(depends) {
    attr.value = fn() // set to initial value
  } else {
    var o = Attr.dependencies(fn)
    depends = o.depends
    attr.value = o.value
  }

  attr.depends = depends

  depends.forEach(function(dep) {
    dep.on('change', changeFn)
  })

  // static change function
  function changeFn() {
    attr.change()
  }

  return attr
}

module.exports = Attr