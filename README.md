attr
====

Evented Property getter/setter component

## API

### attr(val)

  Create a new attr with value set to val

```javascript
name = attr('Homer Simpson')
```

### ()
  
  Read a value

```javascript
name() // => 'Homer Simpson'
```

### (val)

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

  Binds fn to the `change` event

### .change()

 force a change event

### .value
  
  contains the current value. Use to get value without running the getter (most useful for computed properties)

### .old
  
  contains the last value 


## Computed properties

  These have the same API, except no setter and a function is passed in and is run to determine the intial value

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

fullName.value // => 'Bart Simpson'
```

# Testing

  make && open test/index.html 

# License

  MIT