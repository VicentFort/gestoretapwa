const { defineConfig } = require("@vue/cli-service");
const { readFileSync } = require("fs");
module.exports = defineConfig({

  transpileDependencies:true,
  lintOnSave: false,
  pwa: {
    name:"Gestoreta",
  },
  devServer: {
    host:'0.0.0.0',
    
    server: {
      type:'https'
    },
    
    port: 5173
  },
});
