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
          ternary: '#FF7F50',
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
          background: '#7fa1af',
          secondary: '#7fa1af',
          primary: '#F5F5F5',
          ternary: '#FF7F50',
          quaternary: '#ea9262',
          surface: '#FF7F50',
          error: '#F28B82'

          
        }
        
      }
    }
  }
  
})