import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import 'font-awesome/css/font-awesome.min.css'

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from '@/router'
import './utils/directives.js'
import '@/icons' // icon
import '@/permission' // permission control


import Print from 'vue-print-nb'
　　Vue.use(Print); //注册

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
