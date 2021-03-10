import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import VueTextareaAutosize from 'vue-textarea-autosize';
import firebase from 'firebase/app';
import 'firebase/firestore';

Vue.use(VueTextareaAutosize);

Vue.config.productionTip = false

firebase.initializeApp({
  apiKey: "AIzaSyDo1MJURnDA4bAwuOO5gmGX5iSNwt4hBng",
  authDomain: "vue-calendar-d6a05.firebaseapp.com",
  projectId: "vue-calendar-d6a05",
  storageBucket: "vue-calendar-d6a05.appspot.com",
  messagingSenderId: "193268396518",
  appId: "1:193268396518:web:4e55f6c87c140f82962627"
});

export const db = firebase.firestore();

new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
