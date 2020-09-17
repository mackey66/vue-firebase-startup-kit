<template>
  <section class="section">
    <div class="container is-desktop" id="target" v-if="ownerlist">
      <div class="box_">
        <div class="title_screen m-b-20">
          <span class="icon has-text-info"><i class="fas fa-syringe"></i></span>
          <span class="h2">予防</span>
        </div>
        <div class="title_print m-b-20">
          <span class="h2">*** VACCINATION CERTIFICATE ***</span>
        </div>
        <owner-title :document="ownerlist" :refDocument="refOwner" @deleted="handleListDelete" @petCreate="createPet = $event" />        
        <span v-if="petlist">          
          <div class="columns is-mobile m-b-0">
            <div class="column is-2-mobile is-2-tablet is-2-desktop is-2-widescreen is-1-fullhd">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label has-text-left" >PetNo:</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <input class="input is-static_" v-bind:value="petlist.no" readonly>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-3-mobile is-3-tablet is-3-desktop is-2-widescreen is-2-fullhd">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label has-text-left" >PetID:</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <input class="input is-static_" v-bind:value="petlist.petId" readonly>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-7-mobile is-6-tablet is-5-desktop is-4-widescreen is-3-fullhd">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label has-text-left">名前:</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <input class="input is-static_" v-bind:value="petlist.name" readonly>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="columns is-mobile m-b-0">
            <div class="column is-3-mobile is-3-tablet is-3-desktop is-2-widescreen is-1-fullhd">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label has-text-left" style="min-width: 70px">種:</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <input class="input is-static_" v-bind:value="getSpeciesName(petlist.species)" readonly>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-8-mobile is-8-tablet is-7-desktop is-6-widescreen is-5-fullhd">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label has-text-left" style="min-width: 80px">品種:</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <input class="input is-static_" v-bind:value="petlist.breedName" readonly>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="columns is-mobile m-b-0">
            <div class="column is-3-mobile is-3-tablet is-3-desktop is-2-widescreen is-1-fullhd">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label has-text-left" style="min-width: 70px">性別:</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <input class="input is-static_" v-bind:value="getGenderName(petlist.gender)" readonly>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-3-mobile is-3-tablet is-3-desktop is-2-widescreen is-1-fullhd">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label has-text-left" style="min-width: 80px">去勢/避妊:</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <input class="input is-static_" v-bind:value="getNeuteredName(petlist.neutered)" readonly>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-5-mobile is-4-tablet is-4-desktop is-3-widescreen is-2-fullhd">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label has-text-left" style="min-width: 80px">生年月日:</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <input class="input is-static_" v-bind:value="birth_" readonly>
                    </p>
                  </div>
                </div>
              </div>
            </div> 
          </div>

          <div class="columns is-mobile m-b-0">
            <div class="column is-6-mobile is-5-tablet is-4-desktop is-3-widescreen is-3-fullhd">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label has-text-left" >項目:</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <b-select v-model="dmh.type" @input="handleSaveDmhDmsubject($event)">
                        <option v-for="value in dmsubjectList" :key="value.id" v-bind:value="value.id">
                          {{ value.name }}
                        </option>
                      </b-select>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-6-mobile is-5-tablet is-5-desktop is-4-widescreen is-3-fullhd">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label has-text-left" >内容:</label>
                </div>
                  <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <b-field>
                      <b-input type="text" :value="dmh.name" style="min-width: 120px;" @change.native="handleSaveDmhName($event.target.value)" />
                      <b-select v-model="dmh.name" style="width: 48px;" 
                        @change.native="dmh.name = getDmcontentName($event.target.value); 
                          dmh.nextDate = timest.fromMillis(dmh.condDate.toMillis() + getDmcontentCycle($event.target.value) * 3600 * 24 * 1000);
                          handleSaveDmhName(dmh.name);"
                        @focus="focusDmcontentSelect(dmh.type)" @touchstart="focusDmcontentSelect(dmh.type)">
                        <option v-for="value in dmcontentExtracted" :key="value.id" v-bind:value="value.id">
                          {{ value.name }}
                        </option>                 
                      </b-select>
                      </b-field>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="columns is-mobile m-b-0">
            <div class="column is-6-mobile is-5-tablet is-4-desktop is-3-widescreen is-2-fullhd">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label has-text-left" style="min-width: 90px">実施日:</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <b-datepicker v-if="dmh.condDate" v-bind:value="dmh.condDate.toDate()" v-on:input="handleSaveDmhCondDate($event)" :date-formatter="(date) =>  moment(date).locale(lang).format('YYYY/MM/DD')">
                      </b-datepicker>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-6-mobile is-5-tablet is-4-desktop is-3-widescreen is-2-fullhd">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label has-text-left" style="min-width: 90px">次回予定日:</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">  
                      <b-datepicker v-if="dmh.nextDate" v-bind:value="dmh.nextDate.toDate()" v-on:input="handleSaveDmhNextDate($event)" :date-formatter="(date) =>  moment(date).locale(lang).format('YYYY/MM/DD')">
                      </b-datepicker>  
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="columns m-t-0">
            <div class="column is-12-mobile is-10-tablet is-10-desktop is-8-widescreen is-7-fullhd">
              <b-field label="ワクチンの種類:" :label-position="labelPosition" type="is-light">
              <div class="subtitle is-7">
              <div class="box">
                <div class="columns is-mobile">
                  <div class="column" style="padding:0">
                    <li style="list-style: none;"><input type="checkbox" :checked="checks[1]" @input="checks[1] = !checks[1]; handleSaveDmhName(dmh.name);"> 犬ジステンパー</li>
                    <li style="list-style: none;"><input type="checkbox" :checked="checks[2]" @input="checks[2] = !checks[2]; handleSaveDmhName(dmh.name);"> 犬伝染性肝炎(A1)</li>
                    <li style="list-style: none;"><input type="checkbox" :checked="checks[3]" @input="checks[3] = !checks[3]; handleSaveDmhName(dmh.name);"> 犬伝染性喉頭気管炎(A2)</li>
                    <li style="list-style: none;"><input type="checkbox" :checked="checks[4]" @input="checks[4] = !checks[4]; handleSaveDmhName(dmh.name);"> 犬パラインフルエンザ</li>
                    <li style="list-style: none;"><input type="checkbox" :checked="checks[5]" @input="checks[5] = !checks[5]; handleSaveDmhName(dmh.name);"> 犬パルボウイルス感染症</li>
                    <li style="list-style: none;"><input type="checkbox" :checked="checks[6]" @input="checks[6] = !checks[6]; handleSaveDmhName(dmh.name);"> 犬レプトスピラ病</li>
                    <li style="list-style: none;"><input type="checkbox" :checked="checks[7]" @input="checks[7] = !checks[7]; handleSaveDmhName(dmh.name);"> 犬コロナウイルス</li>
                  </div>
                  <div class="column" style="padding:0">
                    <li style="list-style: none;"><input type="checkbox" :checked="checks[11]" @input="checks[11] = !checks[11]; handleSaveDmhName(dmh.name);"> 猫汎白血球減少症</li>
                    <li style="list-style: none;"><input type="checkbox" :checked="checks[12]" @input="checks[12] = !checks[12]; handleSaveDmhName(dmh.name);"> 猫ウイルス性鼻気管炎</li>
                    <li style="list-style: none;"><input type="checkbox" :checked="checks[13]" @input="checks[13] = !checks[13]; handleSaveDmhName(dmh.name);"> 猫カリシウイルス感染症</li>
                    <li style="list-style: none;"><input type="checkbox" :checked="checks[14]" @input="checks[14] = !checks[14]; handleSaveDmhName(dmh.name);"> 猫白血病ウイルス</li>
                    <li style="list-style: none;"><input type="checkbox" :checked="checks[15]" @input="checks[15] = !checks[15]; handleSaveDmhName(dmh.name);"> 猫クラミジア感染症</li>
                    <li style="list-style: none;"><input type="checkbox" :checked="checks[16]" @input="checks[16] = !checks[16]; handleSaveDmhName(dmh.name);"> 猫エイズウイルス</li>
                  </div>
                </div>
              </div>
              </div>
              </b-field>
            </div>
          </div>
          <div class="columns is-mobile m-b-0">
            <div class="column is-4-mobile is-3-tablet is-3-desktop is-3-widescreen is-2-fullhd">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label has-text-left" style="min-width: 70px">LotNo:</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <input class="input is-static_" v-bind:value="dmh.lotNo" readonly>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-4-mobile is-4-tablet is-3-desktop is-3-widescreen is-2-fullhd">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label has-text-left" style="min-width:90px">製造番号A:</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <input class="input is-static_" v-bind:value="dmh.productionNoA" readonly>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-4-mobile is-4-tablet is-3-desktop is-3-widescreen is-2-fullhd">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label has-text-left" style="min-width:90px">製造番号B:</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <input class="input is-static_" v-bind:value="dmh.productionNoB" readonly>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="columns is-mobile m-b-0">
            <div class="column is-12-mobile is-11-tablet is-10-desktop is-9-widescreen is-7-fullhd">
              
              <b-field label="コメント:" label-position="inside_">
              <b-input type="textarea" v-bind:value="dmh.remarks" />
              </b-field>
                    
            </div>
          </div>
          <span v-if="isOwner">
            <div class="level is-mobile">
              <div class="level-left">
                <b-button class="button is-light" icon-left="fas fa-backward" @click="handleBack">戻る</b-button>
                <b-button class="button is-light" icon-left="fas fa-print" @click="pdfPrint" style="margin-left:1rem">証明書発行(pdf)</b-button>
                <b-button class="button is-light" icon-left="fas fa-print" @click="htmlPrint" style="margin-left:1rem">証明書発行(html)</b-button>
                <b-button class="button is-light" icon-left="fas fa-print" @click="fmPrint" style="margin-left:1rem">証明書発行(fm)</b-button>
              </div>
            </div>
          </span>               
        </span>

      </div>
      <br>
      <!--<embed width="50%" height="50%" type="application/pdf" :src="preview" />-->
      <iframe :src="preview" scrolling="no"></iframe>
    </div>
  </section>
</template>


<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator"; 
import { db, firestore } from "@/scripts/firebase";
import { OwnerList, Pets, Species, Breeds, IwanBaseDocument, TodoList, Dmh } from "@/scripts/datatypes";
import OwnerTitle from "@/components/OwnerTitle.vue";
import SourceLink from "@/components/SourceLink.vue";
import moment from 'moment';
Vue.prototype.moment = moment;

import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { extend } from 'vee-validate';
import { required, email, max, numeric, regex } from 'vee-validate/dist/rules';

import JsPDF from 'jspdf';
import html2canvas from 'html2canvas';

declare global {
  interface Window { chooseFileSystemEntries: any }
  //interface Window { requestFileSystem: any }
  //interface Window { webkitRequestFileSystem: any }
}
window.chooseFileSystemEntries = window.chooseFileSystemEntries || {};
//window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;

extend('required', required);
extend('max', max);
extend('numeric', numeric);
extend('regex', regex);
extend('positive', no => {
  return no >= 0;
});

@Component({
  components: {
    SourceLink,
    OwnerTitle,
    ValidationProvider,
    ValidationObserver
  }
})
export default class IwanDmh extends Vue {
  title = "abc";
  no = "";
  ownerId = "";
  petId = "";
  dmhId = "";
  name = ""; 
  birth: Date | null = null;
  birth_ = "";
  ownerlist: OwnerList | null = null;
  petlist: Pets | null = null;
  dmh: Dmh | null = null
  //dmhItems: Array<Dmh> = [];
  detacher?: firebase.Unsubscribe;
  createPet = false;
  species: Species | null = null;
  breeds: Breeds | null = null;
  breedsExtracted: Breeds | null = null;
  breedName = '';
  speciesSelected = '';
  breedSelected = '';
  genderSelected = '';
  neuteredSelected = '';
  gender: IwanBaseDocument | null = null;
  neutered: IwanBaseDocument | null = null;
  neuteredRemarks = "";
  color = "";
  colorList: IwanBaseDocument | null = null;
  size = "";
  sizeList: IwanBaseDocument | null = null;
  since: Date | null = null;
  character = "";
  characterList: IwanBaseDocument | null = null;
  environment = "";
  environmentList: IwanBaseDocument | null = null;
  cohabitation = "";
  cohabitationList: IwanBaseDocument | null = null;
  bw ="";
  dead = "";
  deadList: IwanBaseDocument | null = null;
  deadRemarks = "";
  dmsubjectList: IwanBaseDocument | null = null;
  dmsubjectSelected = "";
  dmcontent: IwanBaseDocument | null = null;
  dmcontentExtracted: IwanBaseDocument | null = null;
  errorNo = false;
  pets: Pets | null = null;
  editMode = false;
  editModeVaccine = false;

  isActive = 1
  isActiveDefault = true;

  timest = firestore.Timestamp
  checks = [false, false, false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false, false, false, false, false]
  el = document.getElementById('target') as HTMLElement
  preview = "";

  nextDate = firestore.Timestamp.fromDate(new Date());

  async created() {
    this.ownerlist = (await this.refOwner.get()).data() as OwnerList;
    this.petlist = (await this.refPet.get()).data() as Pets;
    if (this.petlist.birth) {
      this.birth = this.petlist.birth.toDate();
      this.birth_ = this.birth.toLocaleDateString("ja-JP", {year:"numeric", month:"2-digit", day:"2-digit"});
    }
    if (this.petlist.since) this.since = this.petlist.since.toDate();
    if (this.petlist.no) this.no = this.petlist.no.toString(); 
    if (this.petlist.bw) this.bw = this.petlist.bw.toString();
    //if (this.petlist.petId) this.petId = this.petlist.petId;
    this.ownerId = this.$route.params.parentId
    this.petId = this.$route.params.petId;
    this.dmhId = this.$route.params.dmhId
    this.name = this.petlist.name;
    this.speciesSelected = this.petlist.species;
    this.breedSelected = this.petlist.breed;
    this.breedName = this.petlist.breedName;
    this.genderSelected = this.petlist.gender;
    this.neuteredSelected = this.petlist.neutered;

    this.color = this.petlist.color;
    this.size = this.petlist.size;
    this.character = this.petlist.character;
    this.environment = this.petlist.environment;
    this.cohabitation = this.petlist.cohabitation;   
    this.dead = this.petlist.dead;
    this.deadRemarks = this.petlist.deadRemarks;

    this.el = document.getElementById('target') as HTMLElement
    /*
    this.detacher = this.refDmh
      .collection("dmh")
      .where("id", "==", this.dmhId)
      .onSnapshot(snapshot => {
        this.dmhItems = snapshot.docs.map(doc => {
          return Object.assign(doc.data(), { id: this.dmhId }) as Dmh;
        });
      });
    */
    //const dmhRef = db.collection("owners").doc(this.ownerId).collection("pets").doc(this.petId).collection("dmh").doc(this.dmhId);
    this.refDmh.get().then(doc => {
      if (doc.exists) {
        this.dmh = doc.data() as Dmh
        if (this.dmh.checks) this.checks = this.dmh.checks
        if (this.dmh.nextDate) this.nextDate = this.dmh.nextDate
        //console.log("Document data:", doc.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });
    
    this.reloadCache()
    
    const speciesRef = db.collection("species");
    const breedsRef = db.collection("breeds");
    const genderRef = db.collection("gender");
    const neuteredRef = db.collection("neutered");
    const colorRef = db.collection("color");
    const sizeRef = db.collection("size");
    const characterRef = db.collection("character");
    const environmentRef = db.collection("environment");
    const cohabitationRef = db.collection("cohabitation");
    const deadRef = db.collection("dead");
    const dmsubjectRef = db.collection("dmsubject");
    const dmcontentRef = db.collection("dmcontent");

    const result: any = [];
    const resultB: any = [];
    const resultG: any = [];
    const resultN: any = [];
    const resultC: any = [];
    const resultS: any = [];
    const resultCh: any = [];
    const resultE: any = [];
    const resultCo: any = [];
    const resultD: any = [];
    const resultDs: any = [];
    const resultDc: any = [];

    await speciesRef//.where("owner", "==", this.$store.state.user.uid)
      .get({ source: 'cache' })
      .then(querySnapshot => {      
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
    // ↑ アロー関数

    await breedsRef//.where("owner", "==", this.$store.state.user.uid)
      .get({ source: 'cache' })
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultB.push(d as Breeds);
          //console.log(doc.id, " => ", d);
          const source = doc.metadata.fromCache ? "local cache" : "server";
          //console.log("Data(breeds) came from " + source);
        });
        resultB.sort(this.compare);
        this.breeds = resultB;
        this.breedsExtracted = resultB;
        // Editで品種を絞り込んでおくために必要
        this.changedSpecies();
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });

    await genderRef
      .get({ source: 'cache' })
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
      .get({ source: 'cache' })
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

    await colorRef
      .orderBy("no")
      .get({ source: 'cache' })
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

    await sizeRef
      .get({ source: 'cache'} )
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultS.push(d as IwanBaseDocument);
        });
        this.sizeList = resultS;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });   

    await characterRef
      .get({ source: 'cache' })
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
      .get({ source: 'cache' })
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

    await cohabitationRef
      .get({ source: 'cache' })
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultCo.push(d as IwanBaseDocument);
        });
        this.cohabitationList = resultCo;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });  

    await deadRef
      //.get()
      .get({ source: 'cache' })
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultD.push(d as IwanBaseDocument);
        });
        this.deadList = resultD;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });

    await dmsubjectRef
      .get()
      //.get({ source: 'cache' })
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultDs.push(d as IwanBaseDocument);
        });
        this.dmsubjectList = resultDs;
        //console.log('dmsubjectList:', this.dmsubjectList);
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });

    await dmcontentRef
      .get({ source: 'cache' })
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultDc.push(d as IwanBaseDocument);
          //console.log(doc.id, " => ", d);
          const source = doc.metadata.fromCache ? "local cache" : "server";
          //console.log("Data(breeds) came from " + source);
        });
        resultDc.sort(this.compare);
        this.dmcontent = resultDc;
        this.dmcontentExtracted = resultDc;
        // Editで品種を絞り込んでおくために必要
        //this.changedSpecies();
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    //
    //var self = this;
    
  }

  destroyed() {
    this.detacher && this.detacher();
  }

  get refOwner(): firebase.firestore.DocumentReference {
    return db.collection("owners").doc(this.$route.params.parentId);
  }
  get refPet(): firebase.firestore.DocumentReference {
    return db.collection("owners").doc(this.$route.params.parentId).collection("pets").doc(this.$route.params.petId);
  }
  get refDmh(): firebase.firestore.DocumentReference {
    return db.collection("owners").doc(this.$route.params.parentId).collection("pets").doc(this.$route.params.petId).collection("dmh").doc(this.$route.params.dmhId)
  }
  get hasUser(): boolean {
    return !!this.$store.state.user;
  }
  /*
  get itemMap(): any {
    return this.dmh.reduce((ret: any, item) => {
      ret[item.id] = item;
      return ret;
    }, {});
  }
  */
  
  /*
  async handlePost(type: string) {
    const today = new Date()
    const next = new Date(today)
    next.setDate(next.getDate() + 365)
    if (!type) type = "99"
    await this.refPet.collection("dmh").add({
      owner: this.$store.state.user.uid,
      ownerName: this.$store.state.user.displayName,
      timeCreated: firestore.FieldValue.serverTimestamp(),
      type: type,
      name: "",
      condDate: firestore.FieldValue.serverTimestamp(),
      nextDate: firestore.Timestamp.fromDate(next),
      last: true
    });

  }
  */
  /*
  refDmhItem(): firebase.firestore.DocumentReference {
    return this.refPet.collection("dmh").doc(this.dmhId);
  }
  */
  /*
  async handleCheck(id: string) {
    const item = this.itemMap[id] as Pets;
    if (this.isOwner(id)) {
      await this.refDmhItem().update({
        completed: !item.completed
      });
    }
  }
  */
  
  handleBack() {
    this.$router.go(-1);
  }
  
  isOwner(id: string): boolean {
    /*
    const user = this.$store.state.user;
    const item = this.itemMap[id] as Pets;
    return user && user.uid == item.owner;
    */
    return true
  }
  handleListDelete() {
    this.$router.push("/owner");
  }
  /*
  async delDmh(id: string) {
    console.log("handleListDelete(" + id + ")...");
    await this.refDmhItem().delete();   
  }
  */

  pdfPrint() {
    // トップに移動（しないとPDFのxがおかしくなる）
    window.scrollTo(0,0);
    // html2canvasを使い、指定した要素をCanvasに変換する処理
    html2canvas(this.el).then((canvas) => {
      
      // jspdfの初期化
      const pdf = new JsPDF('l', 'mm', 'a5', true);
      
      //const width = pdf.internal.pageSize.width;
      //const height = pdf.internal.pageSize.height;
      //console.log("w, h:", width, height)
      //let options = {
      //  pagesplit: true
      //};

      // html2canvasで取得した要素をPDFに追加する処理
      const dataURI = canvas.toDataURL("image/png", 1.0);
      //const imgProps= pdf.getImageProperties(dataURI);
      //const height = (imgProps.height * width) / imgProps.width;

      const width = pdf.internal.pageSize.getWidth()
      const height = pdf.internal.pageSize.getHeight()

      const widthRatio = width / canvas.width
      const heightRatio = height / canvas.height

      const ratio = widthRatio > heightRatio ? heightRatio : widthRatio

      pdf.addImage(dataURI, 'PNG', 10, 20, width, 0);

      //pdf.addPage();
      /*
      // Canvas要素を指定してPDFに追加する処理
      // html2canvasは不要で元からCanvasの場合はPDFに画像として貼り付けられる
      const canvasHTMLCollection = document.getElementsByTagName('canvas');
      const canvasArray = Array.prototype.slice.call(canvasHTMLCollection);
      const canvasBase64Array = canvasArray.map(x=> x.toDataURL());
      let i = canvasBase64Array.length - 1;
      for (i; i >= 0; i --) {
        pdf.addImage(canvasBase64Array[i], 'JPEG', 0, 0, width, 0);
        pdf.addPage();
      }
      */
      // PDFに「サンプルです」と文字を書くサンプル
      // ちなみに日本語フォントには対応していないので日本語を書くと文字化けします
      pdf.setFontSize(14);
      pdf.text('VACCINATION CERTIFICATE', 20, 15);

      //pdf.addJS('print({});');
      //This is a key for printing

      pdf.autoPrint();

      //pdf.autoPrint({variant: 'javascript'});
      //pdf.setProperties({
      //    title: "Report"
      //});
      
      //pdf.output('dataurlnewwindow');

      //pdf.output('datauri');
      //const blob = pdf.output('blob');
      
      //window.open(pdf.output('bloburl'), '_blank');
      //window.open(pdf.output('datauristring'));

      // JsPDFでのPDF保存
      //pdf.save('certificate.pdf');

      //const pdf_ = pdf.output('arraybuffer')

      //this.preview = pdf.output("datauristring");

      // 保存する画像の読み込み
      
      //const icon = fs.readFileSync(pdf.save('certificate.pdf'));
      // 最下部に移動
      const element = document.documentElement;
      const bottom = element.scrollHeight - element.clientHeight;
      window.scroll(0, bottom);

      // blobに変換
      const blob = firestore.Blob.fromUint8Array(new Uint8Array(pdf.output('arraybuffer')));
      //const blob = firestore.Blob.fromUint8Array(new Uint8Array([1,2,3]));
      
      // プレビュー
      const image = blob.toBase64() as string
      this.preview = "data:application/pdf;base64," + image + "#page=1?zoom=100"
      
      // firestoreに保存
      //const img = {img : blob};
      //this.refDmh.set(img, { merge: true }).catch(error => console.log(error));
      this.refDmh.update({
        img: blob
      });
      
    });
  }

  htmlPrint() {
    // 用紙サイズが無視される、ページ指定ができない等の問題あり
    //this.on('mount', function() {
    //  setTimeout(function(){
        window.print()
        window.close()
    //  }, 100)
    //})
    /*
    const image = this.dmh?.img.toBase64() as string

    this.preview = "data:application/pdf;base64," + image
    */
    //this.preview = "data:image/jpeg;base64," + image
    //this.preview = "data:image/png;base64," + image

    /*
    // Native FileSystem API サンプル
    const options = {
        accepts: [{
            mimeTypes: ['image/png', 'image/jpeg', 'image/gif']   // 画像だけ許可
        }],
    };
    
    const handle = await window.chooseFileSystemEntries(options);
    
    this.imageData = await handle.getFile();

    let img = new Image();
    img.onload = () => {

        // 画像のサイズを取得
        this.resizingWidth = img.width;
        this.resizingHeight = img.height;

    };
    img.src = this.imageContents;
    */

  }

  async fmPrint() {
    // FileMakerからPrint
    //console.log('fmp://192.168.0.60/WanPO?script=print from firebase&$petname=' + this.name + '&$no=' + this.no + '&$itemname=' + this.dmh?.name + '&$conddate=' + moment(this.dmh?.condDate.toDate()).format('YYYY/MM/DD') + '&$nextdate=' + moment(this.nextDate.toDate()).format('YYYY/MM/DD'))
    window.open('fmp://192.168.0.60/WanPO?script=print from firebase' + 
      '&$no=' + this.ownerlist?.no + '-' + this.petlist?.no +
      '&$ownername=' + this.ownerlist?.nameSei + ' ' + this.ownerlist?.nameNa + 
      '&$zip=' + this.ownerlist?.zip +
      '&$address=' + this.ownerlist?.address1 + this.ownerlist?.address2 + this.ownerlist?.address3 +
      '&$petname=' + this.petlist?.name + 
      '&$species=' + this.getSpeciesName(this.speciesSelected) + 
      '&$breed=' + this.petlist?.breedName + 
      '&$gender=' + this.getGenderName(this.genderSelected) + 
      '&$birthday=' + moment(this.petlist?.birth.toDate()).format('YYYY/MM/DD') + 
      '&$itemname=' + this.dmh?.name + 
      '&$conddate=' + moment(this.dmh?.condDate.toDate()).format('YYYY/MM/DD') + 
      '&$nextdate=' + moment(this.nextDate.toDate()).format('YYYY/MM/DD') + 
      '&$lotno1=' + this.dmh!.lotNo + 
      '&$productionno1=' + this.dmh!.productionNoA + 
      '&$check01=' + this.checks[1] + 
      '&$check02=' + this.checks[2] + 
      '&$check03=' + this.checks[3] + 
      '&$check04=' + this.checks[4] + 
      '&$check05=' + this.checks[5] + 
      '&$check06=' + this.checks[6] + 
      '&$check07=' + this.checks[7] + 
      '&$check08=' + this.checks[8] + 
      '&$check11=' + this.checks[11] + 
      '&$check12=' + this.checks[12] + 
      '&$check13=' + this.checks[13] + 
      '&$check14=' + this.checks[14] + 
      '&$check15=' + this.checks[15] + 
      '&$check16=' + this.checks[16] + 
      '&$check17=' + this.checks[17] + 
      '&$check18=' + this.checks[18] + 
      '&$facname=' + 'アイワン動物病院' + 
      '&$faczip=' + '〒593-8311' + 
      '&$facaddress=' + '大阪府堺市西区上229-1' + 
      '&$facphone=' + '072-289-6275' + 
      '&$facdr=' + '獣医師 真木康之'
      , '_blank');
  }

  data() {
    //console.log('itemMap:', this.itemMap)
    return {
      labelPosition: 'on-border',
      breedSelected: '',
      genderSelected: '',
      neuteredSelected: '',
      birth: null,
      since: null,
      lang: "ja-jp",
      isEditTable : true,
      // エラー回避のため初期値をセットしておく
      dmh: [
        {
          type: '00'
        }
      ],

      /*data: [
        { 'no': 1, 'first_name': 'Jesse', 'last_name': 'Simmons', 'date': '2016-10-15 13:43:27', 'gender': 'Male' },
        { 'no': 2, 'first_name': 'John', 'last_name': 'Jacobs', 'date': '2016-12-15 06:00:53', 'gender': 'Male' },
        { 'no': 3, 'first_name': 'Tina', 'last_name': 'Gilbert', 'date': '2016-04-26 06:26:28', 'gender': 'Female' },
        { 'no': 4, 'first_name': 'Clarence', 'last_name': 'Flores', 'date': '2016-04-10 10:28:46', 'gender': 'Male' },
        { 'no': 5, 'first_name': 'Anne', 'last_name': 'Lee', 'date': '2016-12-06 14:38:38', 'gender': 'Female' }
      ],*/
      //data: this.dmhItems,
      data: [],
      columns: [
        {
            field: 'no',
            label: 'No',
            width: '40',
            numeric: true
        },
        {
            field: 'name',
            label: '名前',
        },
        {
            field: 'condDate',
            label: '実施日',
        },
        {
            field: 'nextDate',
            label: '次回予定日',
            centered: true
        },
        {
            field: 'gender',
            label: 'Gender',
        }
      ]
    }
    
  }

  computed() {
    return {
      nextDate_: [
      ]
    }
  }

  dateFormatter(date: firebase.firestore.Timestamp) {
    try {
      return date.toDate().toLocaleDateString("ja-JP", {year:"numeric", month:"2-digit", day:"2-digit"}) 
    } catch (e) {
      //console.log(e)
      return
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
  async changedSpecies() {
    const b = this.breeds as any;
    const s = this.speciesSelected; 
    const matchData = b.filter(function(item: any, index: any){
      if (item.species == s) return true;     
    });
    this.breedsExtracted = matchData;
  }
  // #2020-08-08
  async changedDmsubject() {
    const b = this.dmcontent as any;
    const s = this.dmsubjectSelected; 
    //console.log("dmsubjectSelected:", s);
    const matchData = b.filter(function(item: any, index: any){
      if (item.type == s) return true;     
    });
    this.dmcontentExtracted = matchData;
  }

  focusDmcontentSelect(type: string) {
    //console.log("focus!", type)
    this.dmsubjectSelected = type
    this.changedDmsubject()
  }

  getSpeciesName(id: string) {
    if (!id || !this.species) return;
    const s = this.species as any;
    return s.find((x: any) => x.id === id).name;
  }

  getBreedName(id: string) {
    if (!id) return;
    const s = this.breeds as any;
    console.log(id + ": " + s.find((x: any) => x.id === id).name);
    return s.find((x: any) => x.id === id).name;
  }

  getGenderName(id: string) {
    if (!id || !this.gender) return;
    const s = this.gender as any;
    return s.find((x: any) => x.id === id).name;
  }

  getNeuteredName(id: string) {
    if (!id || !this.neutered) return;
    const s = this.neutered as any;
    return s.find((x: any) => x.id === id).name;
  }

  getDmsubjectName(id: string) {
    if (!id || !this.dmsubjectList) return;
    const s = this.dmsubjectList as any;
    //console.log('dmsubjectList:', this.dmsubjectList)
    return s.find((x: any) => x.id === id).name;
  }

  getDmcontentName(id: string) {
    if (!id || !this.dmcontent) return;
    const s = this.dmcontent as any;
    // ワクチンの種類のチェックも付ける
    this.checks = s.find((x: any) => x.id === id).checks
    return s.find((x: any) => x.id === id).name;
  }
  // Cycle
  getDmcontentCycle(id: string) {
    if (!id) return;
    const s = this.dmcontent as any;
    return s.find((x: any) => x.id === id).cycle;
  }

  searchNo(no: string) {
    if (this.no.length > 0 && !this.no.search(/^[0-9]+$/)) { 
      //console.log("Serch No...");
      this.refOwner.collection("pets")
      .where("no", "==", Number(no))
      .get()
      .then(querySnapshot => {      
        querySnapshot.forEach(doc => {         
          //console.log(doc.id, " => ", doc.data());
          if (doc.id == this.$route.params.petId) {
            this.errorNo = false;
          } else {
            this.errorNo = true;
          }
        });
        if (querySnapshot.empty) this.errorNo = false;
      })
      .catch(error => {
        console.log("Error getting documents: ", error);
        this.errorNo = false;
      });
    } else {
      this.errorNo = false;
    }
  }

  handleEdit() {
    this.editMode = true;
  }
  handleSave() {
    /*
    this.refTodoList.update({
      no: Number(this.no),
      petId: this.petId,
      name: this.name,
      species: this.speciesSelected,
      breed: this.breedSelected,
      gender: this.genderSelected,
      neutered: this.neuteredSelected,
      birth: this.birth,
      color: this.color,
      size: this.size,
      since: this.since,
      character: this.character,
      environment: this.environment,
      cohabitation: this.cohabitation,
      bw: this.bw,
      dead: this.dead,
      deadRemarks: this.deadRemarks,
    });
    */
    // 新規ペットで未作成フィールドのundifinedエラーを回避
    if (!this.color) this.color = "";
    if (!this.size) this.size = "";
    if (!this.since) this.since = new Date();
    if (!this.character) this.character = "";
    if (!this.environment) this.environment = "";
    if (!this.cohabitation) this.cohabitation = "";
    if (!this.bw) this.bw = "";
    if (!this.dead) this.dead = "";
    if (!this.deadRemarks) this.deadRemarks = "";
    // set
    this.refPet.set({
      no: Number(this.no),
      petId: this.petId,
      name: this.name,
      species: this.speciesSelected,
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
      bw: Number(this.bw),
      dead: this.dead,
      deadRemarks: this.deadRemarks,
    }, {merge: true})
      .then(function() {
        console.log("Document successfully written!");
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
    });
    this.editMode = false;
  }
  handleCancel() {
    //this.title = this.document.title;
    this.editMode = false;
    this.editModeVaccine = false;
    //this.$emit("petCreate", true);
  }
  /*
  handleOk() {
    this.editMode = false;
    this.editModeVaccine = false;
    this.setDmhLast()
  }
  */
  /*
  setDmhLast() {
    // 各Typeの最終履歴にフラグを立てる
    //const batch = db.batch();
    let dmsbj = "";
    let dmsbj_ = "";
    this.dmhItems.forEach(doc => {
      dmsbj = doc.type
      if (dmsbj == dmsbj_) {
        this.refPet.collection("dmh").doc(doc.id).update({
          last: false 
        });
      } else {
        this.refPet.collection("dmh").doc(doc.id).update({
          last: true 
        });
      }
      dmsbj_ = doc.type 
    })
    */
    /*
    // 一括書き込みサンプル for Android
    // 1000件のサンプルデータ 
    val cityList: MutableList<City> = getSampleCityList()
    val db = FirebaseFirestore.getInstance()

    // 1. 一括書き込み開始
    var batch: WriteBatch = db.batch()
    cityList.forEachIndexed { index, city ->
        val ref: DocumentReference = db.collection("cities").document(city.name!!)
        batch.set(ref, city)
        if ((index + 1) % 500 == 0 || index == cityList.lastIndex) {

            // 2. オペレーションが500件に達したらコミット
            batch.commit().addOnCompleteListener {
                Log.d(TAG, "batch commit isSuccess: ${it.isSuccessful}")

            }
            // 3. 新たに一括書き込みを開始する
            batch = db.batch()
        }
    }
    
  }*/
  
  async handleSaveDmhName(name: string) {
      await this.refDmh.update({
        name: name,
        checks: this.checks
      });
  }

  async handleSaveDmhCondDate(date: firebase.firestore.Timestamp) {
      await this.refDmh.update({
        condDate: date 
      });
  }

  async handleSaveDmhNextDate(date: firebase.firestore.Timestamp) {
      await this.refDmh.update({
        nextDate: date 
      });
  }

  async handleSaveDmhDmsubject(type: string) {
      await this.refDmh.update({
        type: type 
      });
  }
  
  get isChanged() {
    return true;
  }

  changeTab(num: number) {
    this.isActive = num
    this.isActiveDefault = false
  }

  handleEditVaccine() {
    this.editModeVaccine = true;
  }

  // キャッシュが空のデータはサーバーから取得する
  async reloadCache() {
    // dmsubject
    const dmsubject = db.collection("dmsubject");
    const snapshot = await dmsubject.get({ source: 'cache' })
    if (snapshot.empty || this.$store.state.masterNocache == true) dmsubject.get()
    // dmcontent
    const dmcontent = db.collection("dmcontent");
    const snapshotD = await dmcontent.get({ source: 'cache' })
    if (snapshotD.empty || this.$store.state.masterNocache == true) dmcontent.get()
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
.table {
  border: 1px solid #aaa;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 6px;
  overflow: hidden;
}
.table th {  
  border-right: none;
}
.table td {  
  border-left: none;
  min-width: 120px;
}

@media screen {
  .title_print {
    display: none;
  }
  body_ {
    background: #eee;
  }
  .section_ {
    background: white; /* 背景を白く */
    box-shadow: 0 .5mm 2mm rgba(0,0,0,.3); /* ドロップシャドウ */
    margin: 5mm;
  }
}

@media print {
  .sheets > :not(.sheet) {
    display: none;
  }
  .title_screen {
    display: none;
  }
  .navbar, .button {
    display: none;
  }

}

@page { 
  size: A5 landscape;
  margin: 0;
}
</style>