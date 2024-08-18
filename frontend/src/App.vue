<template>
  <v-app v-if="session.isLoggedIn">
      <v-app-bar app v-if="session.isLoggedIn">
        <v-toolbar-title>Bliss</v-toolbar-title>
        <v-spacer></v-spacer>
        <router-link to="/enquiry"><v-btn text>New Enquiry</v-btn></router-link>
        <router-link to="/enquiry-list"><v-btn text>Enquiry List</v-btn></router-link>
        <v-btn text :loading="session.logout.loading" @click="session.logout.submit()">Logout</v-btn>
      </v-app-bar>

      <v-main>
        <router-view></router-view>
      </v-main>

    </v-app>
    <Login v-if="!session.isLoggedIn" />

</template>

<script setup>
  import Login from './pages/Login.vue'
  import { session } from './data/session'
</script>