import Vue from 'vue'

Vue.directive('focus', {
  // When the bound element is inserted into the DOM...
  inserted: function (el) {
    // Focus the element
    el.focus()
  }
})

Vue.directive('show-label', function (el, binding) {
  el.innerHTML = el.innerHTML.replace(/%s/g, binding.value)
  el.style.display = !binding.value ? 'none' : ''
})
