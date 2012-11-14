attr
====

Evented Property getter/setter


## API

### attr(val)

  Create a new attr with value set to val

```javascript
name = attr('Homer Simpson')
```

### attr()
  
  Read a value

```javascript
name() // => 'Homer Simpson'
```

### attr(val)

   Write a value

```javascript
name('Bart Simpson')
```

  - Emits "change" event with `(value, previousValue)`.

```javascript
name.on('change', function(new_name, old_name) {
  console.log('my name changed from', old_name, 'to', new_name)
})
```

### .toggle()

  Flips truthy to false and falsey to true

### .incr(val) 
  
  Increments value by 1 or val

### .change(fn)

  Binds a fn to the `change`

### .change()

 force a change event

### .value
  
  contains the current value

### .old
  
  contains the last value 


## Computed properties

  These have the same API, except no setter and a function is passed in as the initial value

### attr.computed(fn)

   Creates a computed attr:

```javascript
fullName = attr.computed(function() {
  return firstName() + ' ' + surName()
})

fullName() // => 'Homer Simpson'
```

### attr.depends()  

  Returns the current dependencies

### attr.depends(array)  

  Set dependencies. attr is recalculated whenever a dependency changes

```javascript
fullName.depends([firstName, surName])
firstName('Bart')

fullName() // => 'Bart Simpson'
```

# Testing

  make && open test/index.html 

# License

  MIT