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
          primary: '#ff8c00',
          background: '#888888',
          primary: '#888888',
          secondary: '#000000',
          ternary: '#ffffff',
          surface: '#dea921'

        },
        variables: {
          'border-color': '#000000',
          'border-opacity': 0.5
        }
      },
      light: {
        dark:false,
        colors: {
          surface: '#ebb675',
          background: '#b4aaa4',
          primary: '#000000',
          secondary: '#7368b6',
          ternary:'#ba8d1d'

          
        }
        
      }
    }
  }
  
})