import Vue from 'vue'
// import VeeValidate from "vee-validate";
import 'vuetify/dist/vuetify.min.css' // Ensure you are using css-loader

// import Vuetify from 'vuetify'
// import colors from "vuetify/es5/util/colors";
import Vuetify from 'vuetify'
Vue.use(Vuetify, {
  theme: {
    primary: '#BC0A22',
    secondary: '#b0bec5',
    accent: '#9f0010',
    error: '#b71c1c'
  }
})
