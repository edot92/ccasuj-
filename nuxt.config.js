require('dotenv').config()
module.exports = {
  /*
  ** Headers of the page
  */
  env: {
    database: process.env.database,
    username: process.env.username,
    password: process.env.password,
    host: process.env.host,
    serverWS: process.env.serverWS,
  },
  head: {
    title: 'starter',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' },
    ],
    link: [
      {
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons',
        rel: 'stylesheet',
      },
      // {
      //   href: ' https://unpkg.com/vuetify/dist/vuetify.min.css',
      //   rel: 'stylesheet',
      // },

      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
    ],
    script: [
      {
        src: '/js/jquery.js',
      },
      {
        src: '/js/notify.min.js',
      },
      {
        src: '/js/socketio.js',
      },
    ],
  },
  /*
  ** Global CSS
  */
  css: ['~/assets/css/main.css'],
  plugins: [
    {
      src: '~/plugins/vuetify.js',
      ssr: true,
    },
    {
      src: '~/plugins/datetime.js',
      ssr: true,
    },

    // '~/plugins/axios'
  ],
  /*
  ** Add axios globally
  */
  build: {
    vendor: ['axios'],
    /*
    ** Run ESLINT on save
    */
    extend(config, ctx) {
      if (ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/,
        })
      }
    },
  },
}
