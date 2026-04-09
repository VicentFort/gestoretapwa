const { defineConfig } = require("@vue/cli-service");
const { readFileSync } = require("fs");
module.exports = defineConfig({
  pluginOptions: {
     vuetify : {

    }
  },
  transpileDependencies:true,
  lintOnSave: false,
  pwa: {
    name:"Gestoreta",
    themeColor:"#000000"
  },
  devServer: {
    host:'0.0.0.0',
    /*
    server: {
      type:'https',
      options: {
        key: readFileSync('./certificates/37.135.29.68+2-key.pem'),
        cert: readFileSync('./certificates/37.135.29.68+2.pem'),
      }
    },
    */
    port: 5173
  },
});
