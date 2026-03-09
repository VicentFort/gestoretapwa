const { defineConfig } = require("@vue/cli-service");
const { readFileSync } = require("fs");
module.exports = defineConfig({
  pluginOptions: {
     vuetify : {

    }
  },
  transpileDependencies: true,
  lintOnSave: false,
  pwa: {
    name:"Gestoreta",
    themeColor:"#000000"
  },
  devServer: {
    host:'0.0.0.0',
    server: {
      type:'https',
      
    },
    port: 5173
  },
});
