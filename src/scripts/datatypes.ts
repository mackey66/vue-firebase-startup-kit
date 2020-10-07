import { firestore } from 'firebase'

export interface BaseDocument {
	id: string;
	owner: string;
	ownerName: string;
	title: string;
	timeCreated: firebase.firestore.Timestamp;
}

export type ChatRoom = BaseDocument

export interface Message extends BaseDocument {
	message: string;
}

export interface BlogArticle extends BaseDocument {
	content: any;
}

export type TodoList = BaseDocument

export interface TodoItem extends BaseDocument {
	completed: boolean;
}

export interface OwnerList {
	no: number;
	owner: string;
	ownerName: string;
	title: string;
	nameSei: string;
	nameNa: string;
	nameSeiKana: string;
	nameNaKana: string;
	zip: string;
	address1: string;
	address2: string;
	address3: string;
	phone: string[];
	occupation: string;
	timeCreated: firebase.firestore.Timestamp;
}

export interface Pets extends BaseDocument {
	no: number;
	petId: string;
	name: string;
	nameKana: string;
	species: string;
	speciesName: string;
	breed: string;
	breedName: string;
	gender: string;
	neutered: string;
	birth: firebase.firestore.Timestamp;
	completed: boolean;
	parentId: string;
	color: string;
  	size: string;
  	since: firebase.firestore.Timestamp;
	character: string;
	environment: string;
	cohabitation: string;
	bw: number;
	dead: string;
	deadRemarks: string;
	ownerNo: number;
	ownerFullname: string;
}

export interface IwanBaseDocument {
	id: string;
	owner: string;
	ownerName: string;
	name: string;
	timeCreated: firebase.firestore.Timestamp;
}

export interface Species extends IwanBaseDocument {
	nameEng: string;
	order: number;
}

export interface Breeds extends IwanBaseDocument {
	nameEng: string;	
	order: number;
	species: string;
}

export interface Dmh extends IwanBaseDocument {
	parentId: string;
	type: string;
	condDate: firebase.firestore.Timestamp;
	nextDate: firebase.firestore.Timestamp;
	last: boolean;
	lotNo: string;
	productionNoA: string;
	productionNoB: string;
	checks: [false, false, false, false, false, false, false, false, false, false, 
		false, false, false, false, false, false, false, false, false, false];
	img: firestore.Blob;
}

export interface DmSubject extends IwanBaseDocument {
	no: number;	
}

export interface Accounth extends IwanBaseDocument {
	parentId: string;
	condDate: firebase.firestore.Timestamp;
	nextDate: firebase.firestore.Timestamp;
	sum: number;
	taxIn: number;
	taxEx: number;
	payment: number;
	preDebt: number;
	preDeposit: number;
	debt: number;
	deposit: number;
	insRate: number;
	insExpense: number;
	ownerExpense: number;
	change: number;
	carry: boolean;
}

export interface Accountd extends IwanBaseDocument {
	parentId: string;
	condDate: firebase.firestore.Timestamp;
	itemCd: string;
	mtsubject: string;
	mtclass: string
	item: string;
	unitPrice: number;
	quantity: number;
	amount: number;
	insurance: boolean;
	tax: string;
	taxIn: number;
	taxEx: number;
	ins: number;
}
