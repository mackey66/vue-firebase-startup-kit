<template>
  <section class="section">
    <div class="container is-mobile" v-if="ownerlist">
      <div class="box_">
        <owner-title :document="ownerlist" :refOwner="refOwner" :petItems="petItems" @deleted="handleListDelete" @petCreate="createPet = $event" />
        <hr />
        <div class="field">
          <input type="checkbox"
            :checked="createPet"
            @input="createPet = !createPet"> ペット新規登録
        </div>
        <div v-if="createPet">
          <div v-if="hasUser" class="m-b-5">
            <ValidationObserver ref="obs" v-slot="ObserverProps">
              <p class="subtitle is-7">※必須項目</p>
              <div class="columns m-b-5">
                <div class="column is-2">
                  <ValidationProvider rules="required|max:3|numeric">
                    <div slot-scope="ProviderProps">
                      <b-field label="ペットNo※" :label-position="labelPosition"
                        :type="{
                          'is-danger': ProviderProps.errors[0] || errorNo,
                        }"
                        :message="{
                          '必須項目です': ProviderProps.failedRules['required'],
                          '最大文字数(3)を超えています': ProviderProps.failedRules['max'],
                          '数字（整数）以外は使用できません': ProviderProps.failedRules['numeric'],
                          '同じNoがあります': errorNo,
                        }"
                      >
                        <b-input v-model="no" @keyup.native="searchNo(no)" style="max-width: 100px;"></b-input>
                        <!--<p class="error">{{ ProviderProps.errors[0] }}</p>-->
                      </b-field>
                    </div>
                  </ValidationProvider>
                </div>
                <div class="column is-2">
                  <b-field label="ペットID" :label-position="labelPosition" type="is-light">
                    <b-input v-model="petId" style="max-width: 200px;"></b-input>
                  </b-field>
                </div>
                <div class="column is-4">
                  <ValidationProvider rules="required">
                    <div slot-scope="ProviderProps">
                      <b-field label="名前（ペット名）※" :label-position="labelPosition"
                        :type="{
                          'is-danger': ProviderProps.errors[0],
                        }"
                        :message="{
                          '必須項目です': ProviderProps.failedRules['required']
                        }"
                      >              
                        <b-input v-model="name" style="max-width: 300px;"></b-input>
                      </b-field>
                    </div>
                  </ValidationProvider>
                </div>
              </div>
              <div class="columns m-b-5">
                <div class="column is-2">
                  <ValidationProvider rules="required">
                    <b-field label="動物種※" :label-position="labelPosition">
                      <b-select v-model="speciesSelected" @input="changedSpecies">
                        <option v-for="value in species" :key="value.id" v-bind:value="value.id">
                          {{ value.name }}
                        </option>
                      </b-select>
                    </b-field>
                  </ValidationProvider>
                </div>
                <div class="column is-4">  
                  <b-field label="品種" :label-position="labelPosition">
                    <ValidationProvider>
                      <b-input :value="breedName" @change.native="breedName = $event.target.value" style="max-width: 400px; min-width: 200px;"></b-input>
                    </ValidationProvider>
                    <ValidationProvider>
                      <b-select v-model="breedSelected" style="width: 38px;" @change.native="breedName = getBreedName($event.target.value)">
                        <option v-for="value in breedsExtracted" :key="value.id" v-bind:value="value.id">
                          {{ value.name }}
                        </option>                 
                      </b-select>
                    </ValidationProvider>
                  </b-field>  
                </div>
                <div class="column is-2">
                  <b-field label="毛色" :label-position="labelPosition">
                    <b-input v-model="color" style="max-width: 300px;"></b-input>
                    <b-select v-model="color" style="width: 38px;">
                      <option v-for="value in colorList" :key="value.id" v-bind:value="value.name">
                        {{ value.name }}
                      </option>                 
                    </b-select>
                  </b-field>
                </div>
              </div>
              <div class="columns m-b-5">
                <div class="column is-2">
                  <ValidationProvider rules="required">
                    <b-field label="性別※" :label-position="labelPosition">
                      <b-select v-model="genderSelected">
                        <option v-for="value in gender" :key="value.id" v-bind:value="value.id">
                          {{ value.name }}
                        </option>                 
                      </b-select>
                    </b-field>
                  </ValidationProvider>
                </div>
                <div class="column is-2">
                  <ValidationProvider rules="required">
                    <b-field label="去勢/避妊※" :label-position="labelPosition">
                      <b-select v-model="neuteredSelected">
                        <option v-for="value in neutered" :key="value.id" v-bind:value="value.id">
                          {{ value.name }}
                        </option>                 
                      </b-select>
                    </b-field>
                  </ValidationProvider>
                </div>
                <div class="column is-2">
                  <b-field label="去勢/避妊備考" :label-position="labelPosition">
                    <b-input v-model="neuteredRemarks" style="max-width: 300px;"></b-input>
                  </b-field>
                </div>
                <div class="column is-2">
                  <b-field label="体格" :label-position="labelPosition">
                    <b-select v-model="size">
                      <option v-for="value in sizeList" :key="value.id" v-bind:value="value.id">
                        {{ value.name }}
                      </option>                 
                    </b-select>
                  </b-field>
                </div>
              </div>
              <div class="columns m-b-5">
                <div class="column is-2">
                  <ValidationProvider rules="required">
                    <b-field label="生年月日※" :label-position="labelPosition">
                      <b-datepicker
                        v-model="birth" 
                        :date-formatter="(date) =>  moment(date).locale(lang).format('YYYY-MM-DD')"
                        :show-week-number="false"
                        placeholder="Click to select..."
                        icon="calendar-alt"
                        trap-focus
                        style="max-width: 200px;">
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
                  </ValidationProvider>
                </div>
                <div class="column is-2">
                  <b-field label="Since" :label-position="labelPosition">
                    <b-datepicker
                        v-model="since" 
                        :date-formatter="(date) =>  moment(date).locale(lang).format('YYYY-MM-DD')"
                        :show-week-number="false"
                        placeholder="Click to select..."
                        icon="calendar-alt"
                        trap-focus
                        style="max-width: 200px;">
                        <button class="button is-primary"
                          @click="since = new Date()">
                          <b-icon icon="calendar-alt"></b-icon>
                          <span>Today</span>
                        </button>
                        <button class="button is-danger m-l-10"
                          @click="since = null">
                          <b-icon icon="times"></b-icon>
                          <span>Clear</span>
                        </button>
                      </b-datepicker>
                  </b-field>
                </div> 
                <div class="column is-2">
                  <b-field label="性格" :label-position="labelPosition">
                    <b-input v-model="character" style="max-width: 300px;"></b-input>
                    <b-select v-model="character" style="width: 38px;">
                      <option v-for="value in characterList" :key="value.id" v-bind:value="value.name">
                        {{ value.name }}
                      </option>                 
                    </b-select>
                  </b-field>
                </div>
                <div class="column is-2">
                  <b-field label="環境" :label-position="labelPosition">
                    <b-select v-model="environment">
                      <option v-for="value in environmentList" :key="value.id" v-bind:value="value.id">
                        {{ value.name }}
                      </option>                 
                    </b-select>
                  </b-field>
                </div>
                <div class="column is-2">
                  <b-field label="同居" :label-position="labelPosition">
                    <b-input v-model="cohabitation" style="max-width: 300px;"></b-input>
                  </b-field>
                </div>   
              </div>
              <b-button type="is-primary" @click="handlePost" :disabled="ObserverProps.invalid">Create Pet</b-button>
            </ValidationObserver>
          </div>
        </div>
        <div class="m-b-15 m-t-15">
          <!--<div v-for="item in petItems" :key="item.id">
            <router-link :to="`/pet/${item.id}/${item.parentId}`">{{ item.no  + ": " + item.name + " " + getSpeciesName(item.species) + " " + item.breedName + " " + getGenderName(item.gender) }}</router-link>
          </div>-->
          <b-table :data="petItems" :mobile-cards="true" :narrowed="true">
            <template slot-scope="p">
              <b-table-column field="no" label="No" width="40">
                <router-link :to="`/pet/${p.row.id}/${p.row.parentId}`">
                  {{ p.row.no }}
                </router-link>
              </b-table-column>
              <b-table-column field="name" label="名前" style="min-width: 90px;">{{ p.row.name }}</b-table-column>
              <b-table-column field="species" label="種" >{{ getSpeciesName(p.row.species) }}</b-table-column>
              <b-table-column field="breed" label="品種" >{{ p.row.breedName }}</b-table-column>
              <b-table-column field="gender" label="性別" >{{ getGenderName(p.row.gender) }}</b-table-column>
              <b-table-column field="birth" label="生年月日" >{{ dateFormatter(p.row.birth) }}</b-table-column>
            </template>
          </b-table>
        </div>
        <div class="level is-mobile">
          <div class="level-left">
            <b-button class="button is-light" icon-left="fas fa-backward" @click="handleBack">戻る</b-button>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <b-loading active />
    </div>
  </section>
</template>



<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator"; // 2020-06-16 +Prop
import { db, firestore } from "@/scripts/firebase";
import { OwnerList, Pets, Species, Breeds, IwanBaseDocument } from "@/scripts/datatypes";
import OwnerTitle from "@/components/EditableTitleIwan.vue";
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

/*
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
*/
// tslint:disable-next-line:no-var-requires
//const VCalendar = require('v-calendar');
// tslint:disable
//import { VCalendar } from "v-calendar";
//import VCalendar = require('v-calendar');

@Component({
  components: {
    SourceLink,
    OwnerTitle,
    ValidationProvider,
    ValidationObserver
  }
})
export default class Chatroom extends Vue {
  no = "";
  petId = "";
  name = ""; 
  breed = "";
  breedName = '';
  birth = "";
  ownerlist: OwnerList | null = null;
  petItems: Array<Pets> = [];
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
  neuteredRemarks = "";
  size = '';
  sizeList: IwanBaseDocument | null = null;
  color = "";
  colorList: IwanBaseDocument | null = null;
  since = "";
  character = "";
  characterList: IwanBaseDocument | null = null;
  environment = "";
  environmentList: IwanBaseDocument | null = null;
  cohabitation = "";
  errorNo = false;

  //@Prop() readonly path!: string; 2020-06-16 +

  async created() {
    this.detacher = this.refOwner
      .collection("pets")
      .orderBy("no")
      .onSnapshot(snapshot => {
        this.petItems = snapshot.docs.map(doc => {
          return Object.assign(doc.data(), { id: doc.id, parentId: this.$route.params.listId }) as Pets;
        });
      });
    this.ownerlist = (await this.refOwner.get()).data() as OwnerList;

    this.reloadCache()
    
    const speciesRef = db.collection("species");
    const breedsRef = db.collection("breeds");
    const genderRef = db.collection("gender");
    const neuteredRef = db.collection("neutered");
    const sizeRef = db.collection("size");
    const colorRef = db.collection("color");
    const characterRef = db.collection("character");
    const environmentRef = db.collection("environment");

    const result: any = [];
    const resultB: any = [];
    const resultG: any = [];
    const resultN: any = [];
    const resultS: any = [];
    const resultC: any = [];
    const resultCh: any = [];
    const resultE: any = [];
    
    await speciesRef//.where("owner", "==", this.$store.state.user.uid)
      .get({ source: 'cache'})
      //.get()
      .then( querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          // doc.data() is never undefined for query doc snapshots 
          const d = doc.data();
          d.id = doc.id; // idをセット
          result.push(d as Species);
          //console.log(doc.id, " => ", d);
        });
        result.sort(this.compare);
        this.species = result;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    
    await breedsRef//.where("owner", "==", this.$store.state.user.uid)
      .get({ source: 'cache'})
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultB.push(d as Breeds);
          //console.log(doc.id, " => ", d);
        });
        resultB.sort(this.compare);
        this.breeds = resultB;
        this.breedsExtracted = resultB;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    
    await genderRef
      .get({ source: 'cache'})
      .then(querySnapshot => {  
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultG.push(d as IwanBaseDocument);
          //console.log(doc.id, " => ", d);
        });
        this.gender = resultG;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });

    await neuteredRef
      .get({ source: 'cache'})
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultN.push(d as IwanBaseDocument);
          //console.log(doc.id, " => ", d);
        });
        this.neutered = resultN;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    
    await sizeRef
      .get({ source: 'cache'})
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultS.push(d as IwanBaseDocument);
          //console.log(doc.id, " => ", d);
        });
        this.sizeList = resultS;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });

    await colorRef
      .orderBy("no")
      .get({ source: 'cache'})
      //.get()
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultC.push(d as IwanBaseDocument);
        });
        this.colorList = resultC;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });

    await characterRef
      .get({ source: 'cache'})
      //.get()
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultCh.push(d as IwanBaseDocument);
        });
        this.characterList = resultCh;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    
    await environmentRef
      .get({ source: 'cache'})
      //.get()
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultE.push(d as IwanBaseDocument);
        });
        this.environmentList = resultE;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });   
  }

  destroyed() {
    this.detacher && this.detacher();
  }

  get refOwner(): firebase.firestore.DocumentReference {
    //console.log('refTodoList():', `owners/${this.$route.params.listId}`);
    return db.doc(`owners/${this.$route.params.listId}`);
  }
  get hasUser(): boolean {
    return !!this.$store.state.user;
  }
  get itemMap(): any {
    return this.petItems.reduce((ret: any, item) => {
      ret[item.id] = item;
      return ret;
    }, {});
  }

  async handlePost() {
    await this.refOwner.collection("pets").add({
      owner: this.$store.state.user.uid,
      ownerName: this.$store.state.user.displayName,
      timeCreated: firestore.FieldValue.serverTimestamp(),
      no: Number(this.no),
      petId: this.petId,
      ownerId: this.$route.params.listId,
      ownerNo: this.ownerlist!.no,
      ownerFullname: this.ownerlist!.nameSei + " " + this.ownerlist!.nameNa,
      name: this.name,
      species: this.speciesSelected,
      speciesName: this.getSpeciesName(this.speciesSelected),
      breed: this.breedSelected,
      breedName: this.breedName,
      gender: this.genderSelected,
      neutered: this.neuteredSelected,
      birth: this.birth,
      color: this.color,
      size: this.size,
      since: this.since,
      character: this.character,
      environment: this.environment,
      cohabitation: this.cohabitation,
      dead: 0,
      completed: false
    });
    this.no = "";
    this.name = "";
    this.speciesSelected = "";
    this.breedName = "";
    this.genderSelected = "";
    this.neuteredSelected = "";
    this.birth = "";
    this.since = "";
    this.color = "";
    this.size = "";
    this.character = "";
    this.environment = "";
    this.cohabitation = "";
    this.createPet = false;
  }
  refPetItem(id: string): firebase.firestore.DocumentReference {
    return this.refOwner.collection("pets").doc(id);
  }
  async handleCheck(id: string) {
    const item = this.itemMap[id] as Pets;
    if (this.isOwner(id)) {
      await this.refPetItem(id).update({
        completed: !item.completed
      });
    }
  }
  async handleDelete(id: string) {
    await this.refPetItem(id).delete();
  }
  isOwner(id: string): boolean {
    const user = this.$store.state.user;
    const item = this.itemMap[id] as Pets;
    return user && user.uid == item.owner;
  }
  handleListDelete() {
    this.$router.push("/owner");
  }
  handleBack() {
    this.$router.go(-1);
  }
  data() {
    return {
      labelPosition: 'on-border',
      breedSelected: '',
      genderSelected: '',
      neuteredSelected: '',
      birth: null,
      since: null,
      lang: "ja-jp"
    }
  }

  
  
  /*
  get refSpecies(): firebase.firestore.DocumentReference {
    return db.doc(`species/RvbhPm63Pff2jXjCxuU0`);
  }
  */
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

  getSpeciesName(id: string) {
    if (!id || !this.species) return;
    const s = this.species as any;
    return s.find((x: any) => x.id === id).name;
  }
  getBreedName(id: string) {
    if (!id) return;
    const s = this.breeds as any;
    //console.log(id + ": " + s.find((x: any) => x.id === id).name);
    return s.find((x: any) => x.id === id).name;
  }
  /*
  async getBreedName(id: string) {
    if (!id) return;
    const s = this.breeds as any;
    return s.find((x: any) => x.id === id).name;
  }
  */

  getGenderName(id: string) {
    if (!id || !this.gender) return;
    const s = this.gender as any;
    return s.find((x: any) => x.id === id).name;
  }

  searchNo(no: string) {
    let result = false;
    if (this.no.length > 0 && !this.no.search(/^[0-9]+$/)) {
      this.petItems.filter(function(item, index){
        if (item.no == Number(no)) {
          result = true;
          return true;
        }
      });
    }
    this.errorNo = result;
  }

  // Sample: キャッシュ優先（単一ドキュメント）
  async getNeutered(user: firebase.User): Promise<firebase.firestore.DocumentSnapshot> {
    // リファレンスの作成
    const configuration = db.doc(`neutered/${user.uid}`)
    try {
      // キャッシュからドキュメントを取得
      return await configuration.get({ source: 'cache' })
    } catch (error) {
      // ドキュメントがキャッシュされていない場合はサーバーから取得
      if (error.code == 'unavailable') {
        return configuration.get({ source: 'server' })
      }
      throw error
    }
  }
  // Sample: キャッシュ優先（クエリ）
  async getGender(): Promise<firebase.firestore.QuerySnapshot> {
    // クエリの作成
    const products = db.collection("gender");
    // キャッシュから取得
    const snapshot = await products.get({ source: 'cache' })
    // 結果が空でなければキャッシュから取得した結果を返却
    if (!snapshot.empty) {
      return snapshot
    }
    // 結果が空の場合はサーバーから取得した結果を返却
    return products.get()
  }

  // キャッシュが空のデータはサーバーから取得する
  async reloadCache() {
    // gender
    const gender = db.collection("gender");
    const snapshot = await gender.get({ source: 'cache' })
    if (snapshot.empty || this.$store.state.masterNocache == true) gender.get()
    // neutered
    const neutered = db.collection("neutered");
    const neuteredS = await neutered.get({ source: 'cache' })
    if (neuteredS.empty || this.$store.state.masterNocache == true) neutered.get()
    // environment
    const environment = db.collection("environment");
    const environmentS = await environment.get({ source: 'cache' })
    if (environmentS.empty || this.$store.state.masterNocache == true) environment.get()
    // color
    const color = db.collection("color");
    const colorS = await color.get({ source: 'cache' })
    if (colorS.empty || this.$store.state.masterNocache == true) color.get()
    // size
    const size = db.collection("size");
    const sizeS = await size.get({ source: 'cache' })
    if (sizeS.empty || this.$store.state.masterNocache == true) size.get()
    // character
    const character = db.collection("character");
    const characterS = await character.get({ source: 'cache' })
    if (characterS.empty || this.$store.state.masterNocache == true) character.get()
    // dead
    const dead = db.collection("dead");
    const deadS = await dead.get({ source: 'cache' })
    if (deadS.empty || this.$store.state.masterNocache == true) dead.get()

    // species
    const species = db.collection("species");
    const speciesS = await species.get({ source: 'cache' })
    if (speciesS.empty || this.$store.state.masterNocache == true) species.get()
    // breed
    const breed = db.collection("breeds");
    const breedS = await breed.get({ source: 'cache' })
    if (breedS.empty || this.$store.state.masterNocache == true) breed.get()
  }

  dateFormatter(date: firebase.firestore.Timestamp) {
    try {
      return date.toDate().toLocaleDateString("ja-JP", {year:"numeric", month:"2-digit", day:"2-digit"}) 
    } catch (e) {
      //console.log(e)
      return
    }
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