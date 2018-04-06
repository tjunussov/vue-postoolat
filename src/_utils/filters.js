import Vue from 'vue'
import numeral from 'numeral'
import tjson from 'E:\\Dev\\GitHub\\tjson2html'

Vue.filter('amount', function (value) {
  return Number(value) / 100
})

Vue.filter('number', function (value) {
  return Number(isNaN(value) ? 0 : value)
})

Vue.filter('numeral', function (value, fmt) {
  return numeral(value).format(fmt)
})

Vue.filter('json2html', function (value, fmt) {
  return tjson(value, fmt)
})

Vue.filter('decode', function (key) {
  var args = Array.prototype.slice.call(arguments)
  var iv
  var inv
  for (var i = 1, ii = args.length; i < ii; i += 2) {
    iv = args[i]
    inv = (i + 1 in args) && args[i + 1]
    if (key === iv && inv !== undefined) {
      iv = inv
      break
    } else if ((i + 1) !== ii) {
      iv = key
    }
  }
  return typeof iv === 'function' ? iv(key) : iv
})
