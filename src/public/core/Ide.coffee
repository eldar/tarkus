define ->
  _data: {}
  
  register: (name, obj) ->
    @_data[name] = obj  unless @_data[name]

  query: (name) -> @_data[name]
