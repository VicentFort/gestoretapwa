// src/plugins/vuetify.js
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  theme: {
    options: {
      customProperties: true, // Enables CSS variables
    },
    defaultTheme: "gestoreta",
    themes: {
      gestoreta: {
        dark: false,
        colors: {
          background: "#FDFCF8", // bone (era azul)
          surface: "#FFFFFF", // blanco puro (era naranja!)
          primary: "#E35D33", // terracotta — el acento, no el fondo
          secondary: "#8B9E83", // charcoal — para texto/acentos serios
          accent: "#E35D33",
          error: "#9E3026",
          success: "#2F8F5A",
          warning: "#C98A2E",
          info: "#3B6FA0",
          // mantenemos los alias usados en tu código:
          ternary: "#8B9E83", // misma terracotta para no romper
          quaternary: "#c1c9d2", // cream para zonas suaves
          transaction: "#2F8F5A",
        },
        variables: {
          "border-color": "#8B9E83",
          "border-opacity": 0.08, // borde sutil, era 0.5
          "theme-on-background": "#8B9E83",
        },
      },
    },
  },
  defaults: {
    VCard: {
      elevation: 0,
      border: true,
    },

    VBtn: {
      rounded: "lg",
    },
    VForm: {
      rounded: "lg",
      variant: "flat",
      border: true,
    },
    VChip: { rounded: "lg" },
    VSheet: {
      rounded: "lg",
    },
  },
});
