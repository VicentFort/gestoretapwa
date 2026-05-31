const { defineConfig } = require("@vue/cli-service");
const { readFileSync } = require("fs");

module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false,
  pages: {
    index: {
      entry: 'src/main.js', // el punto de entrada de tu app
      title: 'Gestoreta', // El título que reemplazará a htmlWebpackPlugin.options.title
    },
  },
  // Configuración de la PWA
  pwa: {
    name: "Gestoreta",
    shortName: "Gestoreta", // Nombre en la pantalla de inicio
    themeColor: "#8B9E83",  // Color de la barra de estado/navegación
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",

    // 👇 AQUÍ AÑADIMOS LAS RUTAS DE LOS ICONOS
    iconPaths: {
      faviconSVG: null,
      favicon32: 'ic_gestoreta_logo.png',
      favicon16: 'ic_gestoreta_logo.png',
      appleTouchIcon: 'ic_gestoreta_logo.png',
      maskIcon: null,
      msTileImage: 'ic_gestoreta_logo.png'
    },

    manifestOptions: {
      background_color: "#FFFFFF",
      icons: [
        {
          src: "./ic_gestoreta_logo.png",
          sizes: "512x512", // Ponemos un tamaño grande estándar; el dispositivo lo reescalará
          type: "image/png"
        },
        {
          src: "./ic_gestoreta_logo.png",
          sizes: "512x512",
          type: "image/png",
          purpose: "maskable"
        }
      ]
    },

    workboxPluginMode: "GenerateSW",
    workboxOptions: {
      skipWaiting: true,
      clientsClaim: true
    },
  },

  devServer: {
    host: '0.0.0.0',
    server: {
      type: 'https'
    },
    port: 5173
  }
});