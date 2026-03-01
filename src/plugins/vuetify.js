// src/plugins/vuetify.js
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

export default createVuetify({
  components,
  directives,
  theme:{
    themes:{
      form:{
        dark:false,
        colors: {
          primary: '#ff8c00',
          secondary: '#ffffff'
        }
      }
    }
  }
  
})