var attr = require('attr')
  , assert = require('component-assert')


describe('attr()', function(){
  
  it('should return an attr', function(){
    assert(attr() != null)
  })

  it('should set its value to initial', function(){
    var a = attr(1)
    assert( a() == 1 )
  })

  it('should set its value to a new value', function(){
    var a = attr(1)
    a("hello")
    assert( a() == "hello" )
  })

  it('should set its old to current when set', function(){
    var a = attr(1)
    a("hello")
    assert( a.old == 1 )
  })


  it('should emit change events', function(){
    var a = attr(1)
    
    var args = []
    a.on("change", function(value, oldvalue) {
      args = [value, oldvalue]
    })
    a(2)
    
    assert( args[0] == 2 && args[1] == 1 )
  })

  it('should toggle', function(){
    var a = attr(true)
    
    a.toggle()    
    assert( a() == false)
  })

  it('should increment', function(){
    var a = attr(1)
    
    a.incr()
    assert( a() == 2)
  })

  it('should increment by first arg', function(){
    var a = attr(1)
    
    a.incr(-10)
    assert( a() == -9)
  })

  it('should have a change listener', function(){
    var a = attr(1)
    var run = false
    a.change(function(val, old) {
      assert(val == 2)
      assert(old == 1)
      run = true
    })

    a(2)
    assert( run == true)
  })

  it('should force a change with no args', function(){
    var a = attr(1)
    var run = false
    
    a.change(function() {
      run = true
    })

    a.change()

    assert(a.value == 1)
    assert( run == true)
  })

  it('should have no dependencies', function(){
    var a = attr(1)
    
    assert( a.dependencies == null )
  })

  describe('computed attr', function(){

    it('runs function to determine value', function(){
      
      var firstName = attr('John')
      var surName = attr('Bob')

      var fullName = attr.computed(function() {
        return firstName() + ' ' + surName()
      })

      assert(fullName.value == 'John Bob')
    })

    it('reruns function upon get', function(){
      
      var firstName = attr('John')
      var surName = attr('Bob')

      var fullName = attr.computed(function() {
        return firstName() + ' ' + surName()
      })
      surName('Sandy')

      assert(fullName() == 'John Sandy')
    })

    it('reruns function upon forced change', function(){
      
      var firstName = attr('John')
      var surName = attr('Bob')

      var fullName = attr.computed(function() {
        return firstName() + ' ' + surName()
      })
      surName('Sandy')

      fullName.change()
      assert(fullName.value == 'John Sandy')
    })

    it('has 0 dependencies', function(){

      var fullName = attr.computed(function() {})
    
      assert(fullName.dependencies.length == 0)
    })

    it('has 2 dependencies calculated automatically', function(){

      var firstName = attr('John')
      var surName = attr('Bob')
      
      var fullName = attr.computed(function() { return firstName() + surName() })
    
      assert(fullName.dependencies.length == 2)
    })

    it('attr.dependencies calculates dependencies of a function', function(){

      var firstName = attr('John')
      var surName = attr('Bob')
      
      var deps = attr.dependencies(function() { return firstName() + surName() })
    
      assert(deps.length == 2)
    })


    it('has 1 dependencies when set explicitly', function(){

      var firstName = attr('John')
      var surName = attr('Bob')
      
      var fullName = attr.computed(function() { return firstName() + surName() }, [firstName])
    
      assert(fullName.dependencies.length == 1)
    })


    it('recalcs when a dependency changes', function(){
      var firstName = attr('John')
      var surName = attr('Bob')

      var fullName = attr.computed(function() {
        return firstName() + ' ' + surName()
      })

      surName('Sandy')

      assert(fullName.value == 'John Sandy')
    })


  })

  function returnsOne() {
    return 1
  }

  describe('autocomputed attr', function(){
    it('autocompute functions by default', function(){
      assert(attr.autocompute == true )
    })

    it('is a computed attr', function(){
      var a = attr(returnsOne)
      assert(a.computed == true )
      assert(a() == 1 )
    })

    it('if compute is set false they will not be autocomputed', function(){
      attr.autocompute = false
      var a = attr(returnsOne)
      assert(a.computed == null )
      assert(a() == returnsOne )
    })

    it('should throw if handle nested dependencies', function() {
      attr.autocompute = true


      var x = attr(1)
        , y = attr(2)
        , fn
        , fn2

      assertThrows(function() {
        fn = attr(function() {
          x()
          fn2 = attr(function() {
            y()
          })
        })
      })

    })
  })


  
})


function assertThrows(fn) {
  var thrown = false

  try {
    fn()
  }
  catch(e) {
    thrown = true
  }

  assert(thrown)
}