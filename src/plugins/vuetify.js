// src/plugins/vuetify.js
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default createVuetify({
  
  components,
  directives,
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
  theme:{
    defaultTheme: 'light',
    dark:false,
    themes:{
      form:{
        dark:false,
        colors: {
          background: '#87CEEB',
          primary: '#F5F5F5',
          secondary: '#87CEEB',
          ternary: 'rgb(var(--v-theme-ternary))',
          surface: '#f9c3a5'

        },
        variables: {
          'border-color': '#000000',
          'border-opacity': 0.5
        }
      },
      light: {
        dark:false,
        colors: {
          background: '#6facc6',
          secondary: '#6facc6',
          primary: '#F5F5F5',
          ternary: '#f0825a',
          quaternary: '#ed6636',
          surface: '#f0825a',
          error: '#F28B82'

          
        }
        
      }
    }
  }
  
})