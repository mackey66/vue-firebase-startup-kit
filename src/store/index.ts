import Vue from 'vue'
import Vuex from 'vuex'
import { User } from "firebase";
import { Accounth, Pets, Dmh } from "../scripts/datatypes";

Vue.use(Vuex)

export default new Vuex.Store({
	state: {
		user: undefined as User | null | undefined,
		masterNocache: false,
		dateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - 1),
		dateTo: new Date(),
		accounth: undefined as Accounth | null | undefined,
		pet: undefined as Pets | null | undefined,
		keyword: "",
		searchDate: "next",
		dmDateFrom: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
		dmDateTo: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
		dmCheck: [false, false, false, false, false, false, false, false, false, false, 
			false, false, false, false, false, false, false, false, false ,false],
		dmh: undefined as Dmh | null | undefined,
		isActive: '1',
	},
	mutations: {
		setUser(state, user: User | null) {
			state.user = user
		},
		setMasterNocache(state, masterNocache: boolean) {
			masterNocache == !masterNocache
		},
		setDateFrom(state, dateFrom: Date) {
			state.dateFrom = dateFrom
		},
		setDateTo(state, dateTo: Date) {
			state.dateTo = dateTo
		},
		setDmDateFrom(state, dateFrom: Date) {
			state.dmDateFrom = dateFrom
		},
		setDmDateTo(state, dateTo: Date) {
			state.dmDateTo = dateTo
		},
		setSearchDate(state, value: string) {
			state.searchDate = value
		},
		setDmCheck(state, value: boolean[]) {
			state.dmCheck = value
		},
		setIsActive(state, value: string) {
			state.isActive = value
		},
		/*setAccounth(state, accounth: Accounth) {
			state.accounth = accounth
		},
		setPet(state, pet: Pets) {
			state.pet = pet
		},
		setKeywords(state, keyword: string) {
			state.keyword = keyword
		},*/
	},
	actions: {
	},
	modules: {
	}
})
