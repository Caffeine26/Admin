import vuetify from 'eslint-config-vuetify'

export default [
    ...vuetify(), // Spread the Vuetify config
    {
      rules: {
        'indent': 'off', // Disable ESLint core indentation rule
        '@typescript-eslint/indent': 'off', // Disable TypeScript indentation rule
        'vue/html-indent': 'off' // Disable Vue template indentation rule
      }
    }
  ];
