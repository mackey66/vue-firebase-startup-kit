import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
	{
		path: '/',
		name: 'Home',
		component: Home
	},
	{
		path: '/about',
		name: 'About',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
	},
	{
		path: '/auth',
		name: 'Auth',
		component: () => import('../views/Auth.vue')
	},
	{
		path: '/chat',
		name: 'Chat',
		component: () => import('../views/Chat.vue')
	},
	{
		path: '/chat/:roomId',
		component: () => import('../views/Chatroom.vue')
	},
	{
		path: '/blog',
		component: () => import('../views/Blog.vue')
	},
	{
		path: '/blog/:articleId',
		component: () => import('../views/BlogArticle.vue')
	},
	{
		path: '/todo',
		component: () => import('../views/Todo.vue')
	},
	{
		path: '/todo/:listId',
		component: () => import('../views/TodoList.vue')
	},
	{
		path: '/profile',
		component: () => import('../views/Iwan.vue')
	},
	{
		path: '/owner/:listId',
		component: () => import('../views/IwanList.vue')
	},
	{
		path: '/pet/:petId/:parentId',
		component: () => import('../views/IwanPet.vue')
	},
	{
		path: '/search',
		component: () => import('../views/IwanSearch.vue')
	},
	{
		path: '/master',
		component: () => import('../views/IwanMaster.vue')
	},
	{
		path: '/dmh/:dmhId/:petId/:parentId',
		component: () => import('../views/IwanDmh.vue')
	},
	{
		path: '/dm',
		component: () => import('../views/IwanDm.vue')
	},
	{
		path: '/postcard',
		component: () => import('../views/PostcardPrint.vue'),
		name: 'postcard',
		//props: true
	},
	{
		path: '/dmlist',
		component: () => import('../views/DmListPrint.vue'),
		name: 'dmlist'
	},
	{
		path: '/accounth/:accounthId/:petId/:parentId',
		component: () => import('../views/IwanAccounth.vue')
	},
	{
		path: '/account',
		component: () => import('../views/IwanAccountSearch.vue'),
		name: 'account'
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes
})

export default router
