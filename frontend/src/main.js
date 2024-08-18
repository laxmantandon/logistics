import './index.css'

import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

import {
  setConfig,
  frappeRequest,
  resourcesPlugin,
} from 'frappe-ui'

import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  options: {
    customProperties: true,
  },
})


let app = createApp(App)

setConfig('resourceFetcher', frappeRequest)

app.use(vuetify)
app.use(resourcesPlugin)
app.use(router)

// app.component('EasyDataTable', Vue3EasyDataTable);

app.mount('#app')
