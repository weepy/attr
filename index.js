var Emitter = require('emitter')

var methods = {
  incr: function (val) { 
    return this(this.value + (val || 1)) 
  },
  toggle: function (val) { 
    return this(!this.value) 
  },
  change: function(fn) {
    fn
      ? this.on('change', fn)          // setup observer
      : this.emit('change', this(), this.old)
    return this
  },
  toString: function() { 
    return "attr:" + JSON.stringify(this.value)
  },
  'constructor': Attr
}

Emitter(methods)

function extend(a, b) {
  for(var i in b) a[i] = b[i]
}

/* 
 * simple attribute
 */

var watcher = false

function Attr(arg, deps) {

  // autocreate computed attr for function values
  if(Attr.autocompute && typeof arg == 'function') return Attr.computed(arg, deps)

  function attr(v) {
    if(arguments.length) {
      // setter
      attr.old = attr.value
      attr.value = v
      
      attr.emit('change', attr.value, attr.old)
    } 
    else {
      if(Dependencies.list) Dependencies.list.push(attr)
    }
    return attr.value
  }

  // mixin common methods
  extend(attr, methods)
  
  // set to initial
  attr.value = arg
  
  return attr
}

/*
 * Autocompute functions
 */

Attr.autocompute = true

function Dependencies(fn) {
  if(Dependencies.list) throw 'nested dependencies'

  var deps = Dependencies.list = []
  Dependencies.lastValue = fn()
  delete Dependencies.list
  return deps
}

Attr.dependencies = Dependencies

/* 
 * computed attribute
 */

Attr.computed = function(fn, deps) {
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
  if(deps) {
    attr.value = fn() // set to initial value
  } else {
    deps = Dependencies(fn)
    attr.value = Dependencies.lastValue
  }

  attr.dependencies = deps

  deps.forEach(function(dep) {
    dep.on('change', changeFn)
  })

  // static change function
  function changeFn() {
    attr.change()
  }

  attr.computed = true

  return attr
}

module.exports = Attr