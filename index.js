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


function createAttr(arg) {
  function attr(v) {
    if(arguments.length) {
      attr.old = attr.value
      attr.value = v
      attr.emit('change', attr.value, attr.old)
    }
    return attr.value
  }

  
  for(var i in methods) attr[i] = methods[i]
  // set to initial
  attr.value = arg

  
  return attr
}

createAttr.computed = function(fn) {
  function cattr() {
    cattr.old = cattr.value
    cattr.value = fn()
    cattr.emit('change', cattr.value, cattr.old)
    return cattr.value
  }

  
  for(var i in methods) cattr[i] = methods[i]

  cattr.value = fn()

  // setup dependencies
  cattr._depends = []


  cattr.depends = function(deps) {
    cattr._depends.forEach(function(dep) {
      dep.off('change', changeFn)
    })

    cattr._depends = deps
    deps.forEach(function(dep) {
      dep.on('change', changeFn)
    })
    return cattr
  }

  function changeFn() {
    cattr.change()
  }

  return cattr
}

module.exports = createAttr