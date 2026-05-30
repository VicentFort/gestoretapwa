const { defineConfig } = require("@vue/cli-service");
const { readFileSync } = require("fs");

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  // Configuración de la PWA
  pwa: {
    name: "Gestoreta",
    shortName: "Gestoreta", // Nombre en la pantalla de inicio
    themeColor: "#8B9E83",  // Color de la barra de estado/navegación
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",

    // Configuración del Service Worker
    workboxPluginMode: "GenerateSW", // Genera el service worker automáticamente
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true
    }
  },

  devServer: {
    host: '0.0.0.0',
    server: {
      type: 'https'
    },
    port: 5173
  }
});