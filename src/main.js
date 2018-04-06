// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueRouter from 'vue-router'
import Resource from 'vue-resource'
import VueIdb from 'vue-idb'
import date from 'vue-date-filter'

import App from './App'
import Decoder from './components/Decoder'
import Demo from './components/Demo'
import Contact from './components/Contact'

import './_utils/filters.js'
import './_utils/directives.js'
import Modal from './components/Modal'
import DemoModal from './components/DemoModal'

Vue.config.productionTip = false

Vue.use(VueRouter)
Vue.use(Resource)
Vue.use(VueIdb)
Vue.use(date)

Vue.component('modal', Modal)
Vue.component('demoModal', DemoModal)

const routes = [
  { path: '/demo', component: Demo, alias: '/' },
  { path: '/decoder', component: Decoder },
  { path: '/contact', component: Contact }
]

const idb = new VueIdb({
  version: 1,
  database: 'postoolat',
  schemas: [
    { payments: 'created_, json' }
  ]
})

const router = new VueRouter({
  mode: 'history',
  routes
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  idb,
  template: '<App/>',
  components: { App }
})
