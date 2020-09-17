<template>
  <section class="section">
    <div class="container" >   

      
        <div v-if="hasUser" class="m-b-8">
          <ValidationObserver ref="obs" v-slot="ObserverProps">
            <div class="columns">
              <div class="column is-3">
                <ValidationProvider rules="required|max:3|numeric">
                  <div slot-scope="ProviderProps">
                    <b-field label="ペットNo（枝番）" :label-position="labelPosition"
                      :type="{
                        'is-danger': ProviderProps.errors[0] || errorNo,
                      }"
                      :message="{
                        '必須項目です': ProviderProps.failedRules['required'],
                        '最大文字数(3)を超えています': ProviderProps.failedRules['max'],
                        '数字以外は使用できません': ProviderProps.failedRules['numeric'],
                        '同じNoがあります': errorNo,
                      }"
                    >
                      <b-input v-model="no" @keyup.native="searchNo(no)" class="m-b-4"></b-input>
                    </b-field>
                  </div>
                </ValidationProvider>
              </div>
              <div class="column is-4">
                <b-field label="ペットID" :label-position="labelPosition" type="is-light">
                  <b-input v-model="petId" class="m-b-4"></b-input>
                </b-field>
              </div>
            </div>
            <div class="columns">
              <div class="column is-6">
                <ValidationProvider rules="required">
                  <div slot-scope="ProviderProps">
                    <b-field label="名前（ペット名）" :label-position="labelPosition"
                      :type="{
                        'is-danger': ProviderProps.errors[0],
                      }"
                      :message="{
                        '必須項目です': ProviderProps.failedRules['required']
                      }"
                    >              
                      <b-input v-model="name" class="m-b-4"></b-input>
                    </b-field>
                  </div>
                </ValidationProvider>
              </div>
            </div>
            <div class="columns">
              <div class="column is-6">
                <b-field label="動物種" :label-position="labelPosition">
                  <b-select v-model="speciesSelected" @input="changedSpecies">
                    <option v-for="value in species" :key="value.id" v-bind:value="value.id">
                      {{ value.name }}
                    </option>
                  </b-select>
                </b-field>
              </div>
            </div>
            <div class="columns">
              <div class="column is-8">
                <b-field label="品種" :label-position="labelPosition">
                  <b-select v-model="breedSelected">
                    <option v-for="value in breedsExtracted" :key="value.id" v-bind:value="value.id">
                      {{ value.name }}
                    </option>                 
                  </b-select>
                </b-field>
              </div>
            </div>
            <div class="columns">
              <div class="column is-3">
                <b-field label="性別" :label-position="labelPosition">
                  <b-select v-model="genderSelected">
                    <option v-for="value in gender" :key="value.id" v-bind:value="value.id">
                      {{ value.name }}
                    </option>                 
                  </b-select>
                </b-field>
              </div>
            </div>
            <div class="columns">
              <div class="column is-3">
                <b-field label="去勢/避妊" :label-position="labelPosition">
                  <b-select v-model="neuteredSelected">
                    <option v-for="value in neutered" :key="value.id" v-bind:value="value.id">
                      {{ value.name }}
                    </option>                 
                  </b-select>
                </b-field>
              </div>
            </div>
            <div class="columns">
              <div class="column is-3">
                <b-field label="生年月日" :label-position="labelPosition">
                  <b-datepicker
                    v-model="birth" 
                    :date-formatter="(date) =>  moment(date).locale(lang).format('YYYY-MM-DD')"
                    :show-week-number="false"
                    placeholder="Click to select..."
                    icon="calendar-alt"
                    trap-focus>

                    <button class="button is-primary"
                      @click="birth = new Date()">
                      <b-icon icon="calendar-alt"></b-icon>
                      <span>Today</span>
                    </button>

                    <button class="button is-danger m-l-10"
                      @click="birth = null">
                      <b-icon icon="times"></b-icon>
                      <span>Clear</span>
                    </button>
                  </b-datepicker>
                </b-field>
              </div>
            </div>
            <b-button type="is-primary" @click="handlePost" :disabled="ObserverProps.invalid || !ObserverProps.validated">Create Pet</b-button>
          </ValidationObserver>
        </div>
      

    </div>
    
  </section>
</template>



<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator"; // 2020-06-16 +Prop
import { db, firestore } from "@/scripts/firebase";
import { OwnerList, Pets, Species, Breeds, IwanBaseDocument } from "@/scripts/datatypes";
import EditableTitle from "@/components/EditableTitleIwan.vue";
import SourceLink from "@/components/SourceLink.vue";
import moment from 'moment';
Vue.prototype.moment = moment;

import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { extend } from 'vee-validate';
import { required, email, max, numeric } from 'vee-validate/dist/rules';
//required.message = '必須項目です';
//max.message = '最大文字数を超えています';
extend('required', required);
extend('max', max);
extend('numeric', numeric);
extend('positive', no => {
  return no >= 0;
});

@Component({
  components: {
    SourceLink,
    EditableTitle,
    ValidationProvider,
    ValidationObserver
  }
})
export default class Chatroom extends Vue {
  no = "";
  petId = "";
  name = ""; 
  breed = "";
  birth = "";
  todolist: OwnerList | null = null;
  todoitems: Array<Pets> = [];
  detacher?: firebase.Unsubscribe;
  createPet = false;
  species: Species | null = null;
  breeds: Breeds | null = null;
  breedsExtracted: Breeds | null = null;
  speciesSelected = '';
  breedSelected = '';
  genderSelected = '';
  neuteredSelected = '';
  gender: IwanBaseDocument | null = null;
  neutered: IwanBaseDocument | null = null;
  errorNo = false;

  async created() {
    /*
    this.detacher = this.refTodoList
      .collection("pets")
      .orderBy("no")
      .onSnapshot(snapshot => {
        this.todoitems = snapshot.docs.map(doc => {
          return Object.assign(doc.data(), { id: doc.id, parentId: this.$route.params.listId }) as Pets;
        });
      });
    this.todolist = (await this.refTodoList.get()).data() as OwnerList;
    */
    const result: any = [];
    const resultB: any = [];
    const resultG: any = [];
    const resultN: any = [];
    const speciesRef = db.collection("species");
    const breedsRef = db.collection("breeds");
    const genderRef = db.collection("gender");
    const neuteredRef = db.collection("neutered");
    
    await speciesRef.where("owner", "==", this.$store.state.user.uid)
      .get()
      .then(function(querySnapshot) {      
        querySnapshot.forEach(function(doc) {         
          // doc.data() is never undefined for query doc snapshots 
          const d = doc.data();
          d.id = doc.id; // idをセット
          result.push(d as Species);
          //console.log(doc.id, " => ", d);
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    result.sort(this.compare);
    this.species = result;
    await breedsRef.where("owner", "==", this.$store.state.user.uid)
      .get()
      .then(function(querySnapshot) {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultB.push(d as Breeds);
          //console.log(doc.id, " => ", d);
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    resultB.sort(this.compare);
    this.breeds = resultB;
    this.breedsExtracted = resultB;
    await genderRef
      .get()
      .then(function(querySnapshot) {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultG.push(d as IwanBaseDocument);
          //console.log(doc.id, " => ", d);
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    this.gender = resultG;
    await neuteredRef
      .get()
      .then(function(querySnapshot) {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultN.push(d as IwanBaseDocument);
          //console.log(doc.id, " => ", d);
        });
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    this.neutered = resultN;
  }
  destroyed() {
    this.detacher && this.detacher();
  }

  get refTodoList(): firebase.firestore.DocumentReference {
    //console.log('refTodoList():', `owners/${this.$route.params.listId}`);
    return db.doc(`owners/${this.$route.params.listId}`);
  }
  get hasUser(): boolean {
    return !!this.$store.state.user;
  }
  get itemMap(): any {
    return this.todoitems.reduce((ret: any, item) => {
      ret[item.id] = item;
      return ret;
    }, {});
  }

  async handlePost() {
    await this.refTodoList.collection("pets").add({
      owner: this.$store.state.user.uid,
      ownerName: this.$store.state.user.displayName,
      timeCreated: firestore.FieldValue.serverTimestamp(),
      no: Number(this.no),
      petId: this.petId,
      name: this.name,
      species: this.speciesSelected,
      breed: this.breedSelected,
      gender: this.genderSelected,
      neutered: this.neuteredSelected,
      birth: this.birth,
      completed: false
    });
    this.no = "";
    this.name = "";
    this.createPet = false;
  }
  refTodoItem(id: string): firebase.firestore.DocumentReference {
    return this.refTodoList.collection("pets").doc(id);
  }
  async handleCheck(id: string) {
    const item = this.itemMap[id] as Pets;
    if (this.isOwner(id)) {
      await this.refTodoItem(id).update({
        completed: !item.completed
      });
    }
  }
  async handleDelete(id: string) {
    await this.refTodoItem(id).delete();
  }
  isOwner(id: string): boolean {
    const user = this.$store.state.user;
    const item = this.itemMap[id] as Pets;
    return user && user.uid == item.owner;
  }
  handleListDelete() {
    this.$router.push("/owner");
  }
  data() {
    return {
      labelPosition: 'on-border',
      breedSelected: '',
      genderSelected: '',
      neuteredSelected: '',
      birth: new Date(),
      lang: "ja-jp"
    }
  }

  compare(a: any, b: any) {
    let r = 0;
    if (a.order < b.order) { 
      r = -1;
    } else if ( a.order > b.order ) { 
      r = 1; 
    }
    return r;
  }
  changedSpecies() {
    const b = this.breeds as any;
    const s = this.speciesSelected; 
    const matchData = b.filter(function(item: any, index: any){
      if (item.species == s) return true;     
    });
    this.breedsExtracted = matchData;
  }

  async getSpeciesName(id: string) {
    if (!id) return;
    const s = this.species as any;
    return s.find((x: any) => x.id === id).name;
  }

  async getBreedName(id: string) {
    if (!id) return;
    const s = this.breeds as any;
    return s.find((x: any) => x.id === id).name;
  }

  async getGenderName(id: string) {
    if (!id) return;
    const s = this.gender as any;
    return s.find((x: any) => x.id === id).name;
  }

  searchNo(no: string) {
    let result = false;
    if (this.no.length > 0 && !this.no.search(/^[0-9]+$/)) {   
      this.todoitems.filter(function(item, index){
        if (item.no == Number(no)) {
          result = true;
          return true;
        }
      });
    }
    this.errorNo = result;
  }
  
}
</script>

<style lang="scss">
$spaces: (0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50); // 0から50pxまでを用意
$sides: (top, bottom, left, right); // 方向性

@each $space in $spaces {
  @each $side in $sides {
    .m-#{str-slice($side, 0, 1)}-#{$space} {
      margin-#{$side}: #{$space}px !important;
    }

    .p-#{str-slice($side, 0, 1)}-#{$space} {
      padding-#{$side}: #{$space}px !important;
    }
  }
}
</style>