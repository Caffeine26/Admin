<template>
  <div>
    <v-img
      :src="background"
      cover
      class="h-screen w-screen d-flex align-center justify-center"
      
    >

     
      
      <v-card
        class="mx-auto pa-12 pb-8"
        elevation="8"
        max-width="500"
        rounded="lg"
      >
        <div class="text-h6 text-center mb-6">Create Account</div>

        <v-text-field
          density="compact"
          placeholder="Full Name"
          prepend-inner-icon="mdi-account-outline"
          variant="outlined"
        ></v-text-field>

        
        <v-text-field
          density="compact"
          placeholder="Email Address"
          prepend-inner-icon="mdi-email-outline"
          variant="outlined"
        ></v-text-field>

        
        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
        ></v-text-field>

        <v-text-field
          :append-inner-icon="confirmVisible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="confirmVisible ? 'text' : 'password'"
          density="compact"
          placeholder="Confirm Password"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="confirmVisible = !confirmVisible"
        ></v-text-field>

        <v-checkbox
          label="I agree to the Terms & Privacy Policy"
          color="blue"
        ></v-checkbox>

       
        <v-btn
          class="mb-8 mt-4"
          color="blue"
          size="large"
          variant="tonal"
          block
        >
          Sign Up
        </v-btn>

        
        <v-card-text class="text-center">
            <router-link to="/login">
                 <a
            class="text-blue text-decoration-none"
            href="#"
            rel="noopener noreferrer"
            target="_blank"
          >
            Already have an account? Log In
            <v-icon icon="mdi-chevron-right">
               
            </v-icon>
          </a>

            </router-link>
         
        </v-card-text>
      </v-card>
    </v-img>
  </div>
</template>

<script setup>
import { ref } from 'vue'

import background from '@/assets/images/backgrounds/night.png'
const visible = ref(false)
const confirmVisible = ref(false)
</script>
