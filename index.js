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

function createAttr(arg) {

  // IDEA: autocreate computed attr for function values
  // if(typeof arg =='function') return createAttr.computed(arg)

  function attr(v) {
    if(arguments.length) {
      // setter
      attr.old = attr.value
      attr.value = v
      attr.emit('change', attr.value, attr.old)
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
 * computed attribute
 */

createAttr.computed = function(fn) {
  function attr() {
    // nb - there is no setter
    attr.old = attr.value
    attr.value = fn()
    attr.emit('change', attr.value, attr.old)
    return attr.value
  }

  // mixin common methods
  extend(attr, methods)

  // set to initial value
  attr.value = fn()

  // setup dependencies
  attr._depends = []

  // dependency setter
  attr.depends = function(deps) {
    // getter
    if(arguments.length == 0) return attr._depends

    // unbind old
    attr._depends.forEach(function(dep) {
      dep.off('change', changeFn)
    })

    attr._depends = deps
    // bind new
    deps.forEach(function(dep) {
      dep.on('change', changeFn)
    })
    return attr
  }

  // static change function for binding
  function changeFn() {
    attr.change()
  }

  return attr
}

module.exports = createAttr