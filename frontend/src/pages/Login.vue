<template>
  <div v-if="is_signup==false" class="h-screen flex flex-row items-center justify-center">
    <Card title="Welcome" class="w-full max-w-md">
      <form class="flex flex-col space-y-2 w-full" @submit.prevent="submit">
        <Input required name="email" type="text" placeholder="johndoe@email.com" label="User ID" />
        <Input required name="password" type="password" placeholder="••••••" label="Password" />
        <div class="h-2"></div>
        <Button :loading="session.login.loading" variant="solid">Login</Button>
        <div class="h-2"></div>

        <!-- <GoogleLogin :callback="callback">
          <Button>Login with google</Button>
          </GoogleLogin> -->
      </form>
      <Button @click="is_signup=true">Sign up</Button>
    </Card>
  </div>
  <div v-if="is_signup==true" class="h-screen flex flex-row items-center justify-center">
    <Card title="Signup" class="w-full max-w-md">
      <form class="flex flex-col space-y-2 w-full" @submit.prevent="signup">
        <Input required name="full_name" type="text" placeholder="Full Name" label="Full Name" />
        <Input required name="email" type="text" placeholder="johndoe@email.com" label="Email ID" />
        <Input required name="new_password" type="password" placeholder="****" label="Password" />

        <div class="h-2"></div>
        <Button :loading="session.signup.loading" variant="solid">Signup</Button>
        <div class="h-2"></div>

        <!-- <GoogleLogin :callback="callback">
          <Button>Login with google</Button>
        </GoogleLogin> -->
      </form>
      <Button @click="is_signup=false">Login</Button>
    </Card>
  </div>
  <div>
    <pre>{{ show_login_error }}</pre>
  </div>
  
  <Dialog v-model="show_login_error">
      <template #body-title>
        <h3>{{ login_error_title }}</h3>
      </template>
      <template #body-content>
        <p>{{ login_error_message }}</p>
      </template>
      <!-- <template #actions>
        <Button class="ml-2" @click="show_login_error = false">Close</Button>
      </template> -->
    </Dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import {
  Dialog,
  Button,
  Input,
  Card
} from 'frappe-ui'

import { useRouter, useRoute } from 'vue-router'

import { session } from '../data/session'
import { decodeCredential } from 'vue3-google-login'

const router = useRouter()
const route = useRoute()

const login_error_title = ref('')
const login_error_message = ref('')
const show_login_error = ref(false)
const is_signup = ref(false)

function submit(e) {
  let formData = new FormData(e.target)
  session.login.submit({
    email: formData.get('email'),
    password: formData.get('password'),
  }).catch(error => {
    login_error_title.value = 'Login Error'
    login_error_message.value= error.messages[0]
    show_login_error.value = true
  })
}

function signup(e) {
  let formData = new FormData(e.target)
  session.signup.submit({
    email: formData.get('email'),
    full_name: formData.get('full_name'),
    new_password: formData.get('new_password')
  }).then(resp => {
    if(resp.status){
      login_error_title.value = 'Login Info'
      login_error_message.value= 'Signup Successful.'
      show_login_error.value = true      
      is_signup.value = false;
    }
  }).catch(error => {
    console.log(error.messages)
    login_error_title.value = 'Login Error'
    if (error.messages[0] == 'Internal Server Error') {
      login_error_message.value= 'Please check Email ID, or Use Strong Password'
    } else {
      login_error_message.value= error.messages[0]
    }
    show_login_error.value = true
  })
}


function callback(response) {
  console.log("Handle the response", response)
  const userData = decodeCredential(response.credential)
  console.log("Handle the userData", userData)
}
</script>
