import './index.css'

import { createApp } from 'vue'
import router from './router'
import App from './App.vue'

import {
  Button,
  Card,
  Input,
  setConfig,
  frappeRequest,
  resourcesPlugin,
} from 'frappe-ui'

import vue3GoogleLogin from 'vue3-google-login'

import Vue3EasyDataTable from 'vue3-easy-data-table';
import 'vue3-easy-data-table/dist/style.css';

let app = createApp(App)

app.use(vue3GoogleLogin, {
  clientId: '239650682110-vv1jgrgaoqgg5sf3bkgh3cm8chbk3m6j.apps.googleusercontent.com'
})

app.component('EasyDataTable', Vue3EasyDataTable);


setConfig('resourceFetcher', frappeRequest)

app.use(router)
app.use(resourcesPlugin)

app.component('Button', Button)
app.component('Card', Card)
app.component('Input', Input)

app.mount('#app')
