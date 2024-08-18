<template>

<v-container fluid class="d-flex justify-center align-center fill-height">
    <v-card variant="outlined" width="400">
      <v-card-title class="justify-center bg-grey-lighten-1 mb-4">{{ is_signup ? 'Signup': 'Login'}}</v-card-title>
      
      <v-card-text v-if="is_signup==false">
        <v-form @submit.prevent="submit">
          <v-text-field
            density="compact"
            label="Email"
            type="email"
            name="email"
            required
            variant="outlined"
          ></v-text-field>

          <v-text-field
            density="compact"
            label="Password"
            type="password"
            name="password"
            required
            variant="outlined"
          ></v-text-field>
          <v-btn class="mr-2" type="submit" color="primary" :loading="session.login.loading">Login</v-btn>
          <v-btn @click="is_signup = true" variant="outlined" >Signup</v-btn>
        </v-form>
      </v-card-text>
      
      <v-card-text v-if="is_signup==true">
        <v-form @submit.prevent="signup">
          <v-text-field
            density="compact"
            label="Full Name"
            name="full_name"
            required
            variant="outlined"
          ></v-text-field>
          <v-text-field
            density="compact"
            label="Email"
            type="email"
            name="email"
            required
            variant="outlined"
          ></v-text-field>
          <v-text-field
            density="compact"
            label="Password"
            type="password"
            name="new_password"
            required
            variant="outlined"
          ></v-text-field>
          <v-btn class="mr-2" type="submit" color="primary" :loading="session.signup.loading">Signup</v-btn>
          <v-btn @click="is_signup = false" variant="outlined" >Login</v-btn>
        </v-form>
      </v-card-text>


      <v-card-actions class="d-flex justify-space-between">
        <v-btn text>Forgot Password?</v-btn>
      </v-card-actions>
    </v-card>
    <!-- <pre>{{ show_login_error }} {{ login_error_title }}</pre> -->
  </v-container>

  <v-dialog v-model="show_login_error" max-width="500">
    <v-card>
      <v-card-title>Error</v-card-title>
      <v-card-text>{{ login_error_title }}</v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="show_login_error = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

</template>

<script lang="ts" setup>
import { ref } from 'vue';

import { useRouter, useRoute } from 'vue-router'

import { session } from '../data/session'

const login_error_title = ref('')
const login_error_message = ref('')
const show_login_error = ref(false)
const is_signup = ref(false)

function submit(e) {
  let formData = new FormData(e.target)
  if (!formData.get('email')) {
    login_error_title.value = "Provide Email"
    show_login_error.value = true
    return
  }

  if (!formData.get('password')) {
    login_error_title.value = "Provide Password"
    show_login_error.value = true
    return
  }


  session.login.submit({
    email: formData.get('email'),
    password: formData.get('password'),
  }).catch(error => {
    console.log(error)
    login_error_title.value = error.messages[0]
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
      login_error_title.value = 'Signup Successful'
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

</script>
<style>
html, body, #app {
  height: 100%;
  margin: 0;
}

.fill-height {
  min-height: 70vh;
}
</style>