// src/plugins/vuetify.js
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme:{
    defaultTheme: 'light',
    dark:false,
    themes:{
      form:{
        dark:false,
        colors: {
          primary: '#ff8c00',
          background: '#888888',
          primary: '#000000',
          secondary: '#888888',
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
          surface: '#ff8c00',
          background: '#888888',
          primary: '#6a5acd',
          secondary: '#6a5acd',
          ternary:'#dea921'

          
        }
        
      }
    }
  }
  
})