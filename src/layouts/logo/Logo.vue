<script setup lang="ts">
import { RouterLink } from 'vue-router'
import Logoimg from '@/assets/images/logos/onemorelogo.jpg'
</script>

<template>
    <div class="inline-flex items-center">
        <RouterLink to="/">
            <img :src="Logoimg" alt="home" class="h-10 w-auto" />
        </RouterLink>
    </div>
</template>
