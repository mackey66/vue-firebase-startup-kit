import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Buefy from 'buefy'
import 'firebaseui/dist/firebaseui.css'

//import { Table, Input } from 'buefy'
import 'buefy/dist/buefy.css'

//Vue.use(Buefy)
Vue.use(Buefy, {
    defaultIconPack: 'fas',
    defaultContainerElement: '#content',
    // ...
})

//Vue.use(Table)
//Vue.use(Input)

//import { library } from '@fortawesome/fontawesome-svg-core'
//import { fas } from '@fortawesome/free-solid-svg-icons'
//import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

//library.add(fas)
//Vue.component('font-awesome-icon', FontAwesomeIcon)
//Vue.use(Buefy, { defaultIconPack: 'fas' })

//Vue.component('vue-fontawesome', FontAwesomeIcon)

Vue.config.productionTip = false
/*
Vue.use(Buefy, {
	defaultIconPack: 'fas',
})
*/

export const eventBus = new Vue(); //子 → 子 受け渡し用

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount('#app')

