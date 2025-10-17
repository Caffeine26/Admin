<template>

<LoginForm/>

</template>
<script lang="ts">
import LoginForm from '@/components/auth/LoginForm.vue';


export default defineComponent({
  name: 'Login', // Optional: Name of the component
  // Component options (e.g., data, methods, etc.)
  data() {
    return {
      // Your reactive data here
    };
  },
});
</script>
