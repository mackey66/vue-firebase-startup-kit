<template>
  <section class="section">
    <div class="container is-mobile is-fullhd" id="target" v-if="ownerlist">
      <div class="box_">
        <div class="title_screen m-b-20">
          <span class="icon has-text-info"><i class="fab fa-amazon-pay"></i></span>
          <span class="h2">会計</span>
        </div>
        <div class="title_print m-b-20">
          <span class="h2">*** 診療明細書 ***</span>
        </div>

        <owner-title :document="ownerlist" :refDocument="refOwner" @deleted="handleListDelete" @petCreate="createPet = $event" />
        <div v-if="petlist">
          <pet-title :document="petlist" :refDocument="refPet" @deleted="handleListDelete" @petCreate="createPet = $event" />       
        </div>
         
        <div v-if="editMode">

          <div v-if="accounth" class="columns is-mobile m-b-0">
            <div class="column is-6-mobile is-5-tablet is-4-desktop is-3-widescreen is-3-fullhd">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label has-text-left" >日付:</label>
                </div>
                <div class="field-body">
                  <div class="field" >
                    <p class="control" style="width: 200px">
                      <b-datetimepicker v-if="accounth.condDate" 
                      v-bind:value="accounth.condDate.toDate()" 
                      v-on:input="saveAccounthCondDate($event)" 
                      :locale="locale" editable
                      >
                      </b-datetimepicker>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-6-mobile is-5-tablet is-4-desktop is-3-widescreen is-3-fullhd">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label has-text-left" >保険:</label>
                </div>
                <div class="field-body">
                  <div class="field" >
                    <p class="control" >
                      <b-select v-model="accounth.insRate" @input="saveAccounthInsRate($event)">
                        <option value="0.5">50%</option>
                        <option value="0.7">70%</option>
                      </b-select>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- TableヘッダとsubheadingはeditModeとelse（列数含め）どちらも同じようにしないとthis.name is not a functionエラーになるので注意! -->
          <b-table :data="accountdItems" :mobile-cards="false" narrowed :selected.sync="selected" focusable>
            <template slot-scope="p">
              <b-table-column field="no" class="subtitle is-7" style="vertical-align: middle;" label="" width="30">{{ p.index + 1 }}</b-table-column>
              <b-table-column field="date" label="日付" width="80">
                <template slot="subheading">
                  合計:
                </template>
                <p class="control" >
                  <b-datepicker v-if="p.row.condDate" 
                  v-bind:value="p.row.condDate.toDate()" 
                  v-on:input="saveAccountdDate(p.row.id, $event)" 
                  locale="en_US" editable
                  :date-formatter="formatter"
                  tabindex="-1"
                  >
                  </b-datepicker>
                  <b-datepicker v-else 
                  v-on:input="saveAccountdDate(p.row.id, $event)" 
                  locale="en_US" editable
                  :date-formatter="formatter"
                  tabindex="-1"
                  >
                  </b-datepicker>
                </p>
              </b-table-column>
              <b-table-column field="itemCd" label="コード" width="90">
                <b-input type="text" :value="p.row.itemCd" @change.native="saveAccountdItemCd(p.row.id, $event.target.value)" />
              </b-table-column>
              <b-table-column field="mtsubject" label="科目" width="110">
                <b-select v-model="p.row.mtsubject" tabindex="-1"
                  @input="saveAccountdMtsubject(p.row.id, $event); p.row.mtclass=''" 
                >
                  <option v-for="value in mtsubjectList" :key="value.id" v-bind:value="value.id">
                    {{ value.name }}
                  </option>
                </b-select>
              </b-table-column>
              <b-table-column field="mtclass" label="" width="140">
                <b-field>
                  <b-input type="text" :value="getMtclassName(p.row.mtclass)" tabindex="-1" style="width: 90px;" readonly />
                  <b-select v-model="p.row.mtclass" tabindex="-1" style="width: 48px;"
                    @input="saveAccountdMtclass(p.row.id, $event);"
                    @focus="focusMtclassSelect(p.row.mtsubject, p.row.mtclass)" @touchstart="focusMtclassSelect(p.row.mtsubject, p.row.mtclass)"
                  >
                    <option v-for="value in mtclassExtracted" :key="value.id" v-bind:value="value.id">
                      {{ value.name }}
                    </option>
                  </b-select>
                </b-field>
              </b-table-column>
              <b-table-column field="item" label="内容" width="280">
                <b-field>
                  <b-input type="text" :value="p.row.item" @change.native="saveAccountdItem(p.row.id, $event.target.value)" tabindex="-1" style="min-width: 220px;"/>
                  <b-input type="text" :value="p.row.itemId" tabindex="-1" style="width: 0px;"/>
                  <b-select v-model="p.row.itemId" style="width: 48px;" tabindex="-1"
                    @change.native="p.row.itemCd = getChargeItemCd($event.target.value); saveAccountdItemCd(p.row.id, p.row.itemCd);"
                    @focus="focusChargemSelect(p.row.mtsubject, p.row.mtclass)" @touchstart="focusChargemSelect(p.row.mtsubject, p.row.mtclass)" 
                  >
                    <option v-for="value in chargemExtracted" :key="value.id" v-bind:value="value.id">
                      {{ value.itemCd }} {{ value.item }} {{ numberFormatterCurrency(value.unitPrice) }}
                    </option>                 
                  </b-select>
                </b-field>
              </b-table-column>
              <b-table-column field="unitPrice" label="単価" width="100" numeric>
                <b-input type="number" :value="p.row.unitPrice" @change.native="saveAccountdUnitPrice(p.row.id, $event.target.value); saveAccountdAmount(p.row.id, $event.target.value * p.row.quantity);" />
              </b-table-column>
              <b-table-column field="quantity" label="数量" width="70" numeric>
                <template slot="subheading">
                  <br>税込
                </template>
                <b-input type="number" tabindex="-1" :value="p.row.quantity" @change.native="saveAccountdQuantity(p.row.id, $event.target.value); saveAccountdAmount(p.row.id, $event.target.value * p.row.unitPrice);" />
              </b-table-column>
              <b-table-column field="amount" label="金額" width="90" numeric>
                <template slot="subheading">
                  {{ numberFormatterCurrency(sum) }}<br>{{ numberFormatterCurrency(Number(sum) + Number(taxEx)) }}
                </template>
                <div v-if="amountEditable">
                  <b-input type="number" :value="p.row.amount" @change.native="saveAccountdAmount(p.row.id, $event.target.value)" tabindex="-1"/>
                </div>
                <div style="padding-top: 7px" v-else>
                  {{ numberFormatterCurrency(p.row.amount) }}
                </div>
              </b-table-column>
              <b-table-column field="tax" style="padding-top: 11px" label="税" width="140">
                <template slot="subheading" style="font-weight: normal;">
                  (内:{{ numberFormatterCurrency(taxIn) }})<br>(外:{{ numberFormatterCurrency(taxEx) }})
                </template>
                <section>
                  <div class="block" >
                    <b-radio v-model="p.row.tax" native-value="1" size="is-small" @change.native="saveAccountdTax(p.row.id, p.row.tax)">外</b-radio>
                    <b-radio v-model="p.row.tax" native-value="2" size="is-small" @change.native="saveAccountdTax(p.row.id, p.row.tax)">内</b-radio>
                    <b-radio v-model="p.row.tax" native-value="3" size="is-small" @change.native="saveAccountdTax(p.row.id, p.row.tax)">非</b-radio>
                  </div>
                </section>
              </b-table-column>
              <b-table-column field="insurance" style="padding-top: 11px" label="保険" width="120">
                <template slot="subheading">
                  保:{{ numberFormatterCurrency(insExpense) }}<br>請:{{ numberFormatterCurrency(ownerExpense) }}
                </template>
                <b-checkbox v-model="p.row.insurance" @change.native="saveAccountdInsurance(p.row.id, p.row.insurance)"></b-checkbox>
              </b-table-column>
              <b-table-column label="" width="50">
                <div class="level-right" style="margin-top:0px; margin-bottom:0px">
                  <b-button @click="delAccountd(p.row.id)" type="is-danger" icon-left="fas fa-trash" style="margin-left:4px" tabindex="-1"/>
                </div>
              </b-table-column>
            </template>
            <template slot="footer">
              <nav class="level">
                <div class="level-left">                 
                </div>
                <!--<div class="level-right" style="margin-right:15.5rem">
                  <div class="m-l-20">合計(税込): {{ numberFormatterCurrency(Number(sum) + Number(taxEx)) }}</div>
                </div>-->
                <!--<div class="level-right" style="margin-right:4.3rem">
                  <div class="m-l-20">合計: {{ numberFormatterCurrency(sum) }}</div>
                  <div class="m-l-20" style="font-weight: normal;">外:{{ numberFormatterCurrency(taxEx) }} 内:{{ numberFormatterCurrency(taxIn) }}</div>
                </div>-->              
              </nav>
            </template>
          </b-table>

          <span v-if="isOwner">
            <div class="level is-mobile">
              <div class="level-left m-t-15">
                <b-button class="button is-light" icon-left="fas fa-backward" @click="handleBack">戻る</b-button>
                <b-button
                  @click="handleAddLine()"
                  type="is-primary"
                  icon-left="fas fa-plus"
                  style="margin-left:1rem"
                >追加</b-button>
                <b-button
                  @click="handleEdit()"
                  type="is-light"
                  icon-left="fas fa-credit-card"
                  style="margin-left:1rem"
                >決済のみ</b-button>
                <b-button class="button is-light" icon-left="fas fa-print" @click="fmPrint" style="margin-left:1rem">決済/発行</b-button>
              </div>
            </div>
          </span> 
        </div>

        <div v-else>

          <div v-if="accounth" class="columns is-mobile m-b-0">
            <div class="column is-6-mobile is-5-tablet is-4-desktop is-3-widescreen is-3-fullhd">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label has-text-left" >日付:</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <input class="input is-static_" v-bind:value="datetimeFormatter(accounth.condDate)" readonly style="width: 160px">
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="column is-6-mobile is-5-tablet is-4-desktop is-3-widescreen is-3-fullhd">
              <div class="field is-horizontal">
                <div class="field-label is-normal">
                  <label class="label has-text-left" >保険:</label>
                </div>
                <div class="field-body">
                  <div class="field">
                    <p class="control">
                      <input class="input is-static_" v-bind:value="(accounth.insRate * 100) + '%'" readonly style="width: 60px">
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <b-table :data="accountdItems" :mobile-cards="false" :selected.sync="selected" narrowed focusable>
            <template slot-scope="p">
              <b-table-column field="no" class="subtitle is-7" style="vertical-align: middle;" label="" width="30">{{ p.index + 1 }}</b-table-column>
              <b-table-column field="date" label="日付" width="60">
                <template slot="subheading">
                  合計:
                </template>
                {{ dateFormatterMd(p.row.condDate) }}
              </b-table-column>
              <b-table-column field="itemCd" label="コード" width="80">{{ p.row.itemCd }}</b-table-column>
              <b-table-column field="mtsubject" label="科目" width="80">{{ getMtsubjectName(p.row.mtsubject) }}</b-table-column>
              <b-table-column field="mtclass" label=" " width="80">{{ getMtclassName(p.row.mtclass) }}</b-table-column>
              <b-table-column field="item" label="内容" width="290">{{ p.row.item }}</b-table-column>
              <b-table-column field="unitPrice" class="has-text-right" label="単価" width="90" numeric>{{ numberFormatterCurrency(p.row.unitPrice) }}</b-table-column>
              <b-table-column field="quantity" class="has-text-right" label="数量" width="50" numeric>
                <template slot="subheading">
                  <br>税込
                </template>
                {{ numberFormatter(p.row.quantity) }}
              </b-table-column>
              <b-table-column field="amount" class="has-text-right" label="金額" width="90" numeric>
                <template slot="subheading">
                  {{ numberFormatterCurrency(sum) }}<br>{{ numberFormatterCurrency(Number(sum) + Number(taxEx)) }}
                </template>
                {{ numberFormatterCurrency(p.row.amount) }}
              </b-table-column>
              <b-table-column field="tax" label="税" width="140">
                <template slot="subheading" style="font-weight: normal;">
                  (内:{{ numberFormatterCurrency(taxIn) }})<br>(外:{{ numberFormatterCurrency(taxEx) }})
                </template>
                <div class="block">
                  <b-radio v-model="p.row.tax" native-value="1" disabled size="is-small">外</b-radio>
                  <b-radio v-model="p.row.tax" native-value="2" disabled size="is-small">内</b-radio>
                  <b-radio v-model="p.row.tax" native-value="3" disabled size="is-small">非</b-radio>
                </div>
              </b-table-column>
              <b-table-column field="insurance" label="保険" width="120">
                <template slot="subheading">
                  保:{{ numberFormatterCurrency(insExpense) }}<br>請:{{ numberFormatterCurrency(ownerExpense) }}
                </template>
                <b-checkbox v-model="p.row.insurance" disabled></b-checkbox>
              </b-table-column>
              <b-table-column width="0" />
            </template>
            <template slot="footer">
              <nav class="level">
                <div class="level-left">                 
                </div>
                <!--<div class="level-right" style="margin-right:15.5rem">
                  <div class="m-l-20">合計(税込): {{ numberFormatterCurrency(Number(sum) + Number(taxEx)) }}</div>
                </div>-->             
              </nav>
            </template>
          </b-table>

          <span v-if="isOwner">
            <div class="level is-mobile">
              <div class="level-left m-t-15">
                <b-button class="button is-light" icon-left="fas fa-backward" @click="handleBack">戻る</b-button>
                <b-button
                  @click="handleEdit()"
                  type="is-light"
                  icon-left="fas fa-edit"
                  style="margin-left:1rem"
                >再入力</b-button>
                <b-button class="button is-light" icon-left="fas fa-print" @click="fmPrint" style="margin-left:1rem">再発行</b-button>
              </div>
            </div>
          </span> 
        </div>  

                      

      </div>
      <br>
      <pre>{{ selected }}</pre>
      <iframe :src="preview" scrolling="no"></iframe>
    </div>
  </section>
</template>


<script lang="ts">
import Vue from "vue";
//import Buefy from 'buefy'
//import 'buefy/dist/buefy.css'
import { Component, Prop, Watch } from "vue-property-decorator"; 
import { db, firestore } from "@/scripts/firebase";
import { OwnerList, Pets, Species, Breeds, IwanBaseDocument, TodoList, Dmh, Accounth, Accountd } from "@/scripts/datatypes";
import OwnerTitle from "@/components/OwnerTitle.vue";
import PetTitle from "@/components/PetTitle.vue";
//import SourceLink from "@/components/SourceLink.vue";
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
    OwnerTitle,
    PetTitle,
    ValidationProvider,
    ValidationObserver
  }
})
export default class IwanAccounth extends Vue {
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
  accounth: Accounth | null = null
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
  mtsubjectList: IwanBaseDocument | null = null;
  mtsubjectSelected = "";
  chargem: IwanBaseDocument | null = null;
  chargemExtracted: IwanBaseDocument | null = null;
  mtclassList: IwanBaseDocument | null = null;
  mtclassSelected = "";
  mtclassExtracted: IwanBaseDocument | null = null;
  errorNo = false;
  pets: Pets | null = null;
  editMode = false;
  amountEditable = false

  isActive = 1
  isActiveDefault = true;

  timest = firestore.Timestamp
  checks = [false, false, false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false, false, false, false, false]
  el = document.getElementById('target') as HTMLElement
  preview = "";

  nextDate = firestore.Timestamp.fromDate(new Date());
  //condDate: any
  accountdItems: Array<Accountd> = [];
  sum = "0"
  taxIn = "0"
  taxEx = "0"
  insRate = "0"
  insExpense = "0"
  ownerExpense = "0"
  selected: Accountd | null = null
  /*
  selectedId = ""
  @Watch('selected.insurance')
    onChangedInsurance(newValue: boolean, oldValue: boolean) {
      // CheckBox, Radioボタンは値を変える度にTable(sync)の行選択が解除されチラつくので
      // Watchで行選択時にDBをupdateする方式に変更
      
      if (this.selected!.id == this.selectedId && oldValue != newValue) {
        console.log("ins:", newValue)
        this.saveAccountdInsurance(this.selectedId, newValue)
      }     
      //this.saveAccountdTax(newValue.id, newValue.tax)
    }
  @Watch('selected.id')
    onChangedSelected(newValue: string, oldValue: string) {      
      this.selectedId = newValue
    }
  */

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

    this.refAccounth.get().then(doc => {
      if (doc.exists) {
        this.accounth = doc.data() as Accounth
        this.sum = this.accounth.sum.toString()
        this.taxIn = this.accounth.taxIn.toString()
        this.taxEx = this.accounth.taxEx.toString()
        this.insRate = this.accounth.insRate.toString()
        this.insExpense = this.accounth.insExpense.toString()
        this.ownerExpense = this.accounth.ownerExpense.toString()
        //this.condDate = this.accounth.condDate.toDate()
        //console.log("Document data:", doc.data());
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
    }).catch(function(error) {
      console.log("Error getting document:", error);
    });

    

    this.detacher = this.refAccounth
      .collection("accountd")
      .orderBy('condDate').orderBy('mtorder').orderBy('timeCreated')
      .onSnapshot(snapshot => {
        this.accountdItems = snapshot.docs.map(doc => {          
          return Object.assign(doc.data(), { id: doc.id }) as Accountd;
        });
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
    const chargemRef = db.collection("chargem");
    const mtsubjectRef = db.collection("mtsubject");
    const mtclassRef = db.collection("mtclass");

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
    const resultCm: any = [];
    const resultMs: any = [];
    const resultMc: any = [];

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
          const source = doc.metadata.fromCache ? "local cache" : "server";
        });
        resultDc.sort(this.compare);
        this.dmcontent = resultDc;
        this.dmcontentExtracted = resultDc;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });

    await mtsubjectRef
      .get({ source: 'cache' })
      //.get()
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          if (d.name) resultMs.push(d as IwanBaseDocument);
          //const source = doc.metadata.fromCache ? "local cache" : "server";
        });
        //resultDc.sort(this.compare);
        this.mtsubjectList = resultMs;
        //this.dmcontentExtracted = resultCm;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    
    await mtclassRef
      .get({ source: 'cache' })
      //.get()
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          if (d.name) resultMc.push(d as IwanBaseDocument);
          //const source = doc.metadata.fromCache ? "local cache" : "server";
        });
        resultMc.sort(this.compare);
        this.mtclassList = resultMc;
        this.mtclassExtracted = resultMc;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });

    await chargemRef
      .get({ source: 'cache' })
      //.get()
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultCm.push(d as IwanBaseDocument);
          //const source = doc.metadata.fromCache ? "local cache" : "server";
        });
        resultDc.sort(this.compare);
        this.chargem = resultCm;
        this.chargemExtracted = resultCm;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      }); 
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
  get refAccounth(): firebase.firestore.DocumentReference {
    return db.collection("owners").doc(this.$route.params.parentId).collection("pets").doc(this.$route.params.petId).collection("accounth").doc(this.$route.params.accounthId)
  }
  get hasUser(): boolean {
    return !!this.$store.state.user;
  }
  get itemMap(): any {
    return this.accountdItems.reduce((ret: any, item) => {
      ret[item.id] = item;
      return ret;
    }, {});
  }
  
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

  async handleAddLine() {
    const today = new Date()
    today.setHours(0,0,0,0)
    let mts = ""
    let mtc = ""
    if (this.selected) mts = this.selected!.mtsubject
    if (this.selected) mtc = this.selected!.mtclass
    await this.refAccounth.collection("accountd").add({
      owner: this.$store.state.user.uid,
      ownerName: this.$store.state.user.displayName,
      timeCreated: firestore.FieldValue.serverTimestamp(),
      condDate: firestore.Timestamp.fromDate(today),
      itemCd: "",
      mtsubject: mts,
      mtclass: mtc, 
      mtorder: Number(mts),
      item: "",
      quantity: 1     
    });
  }

  refAccountdItem(id: string): firebase.firestore.DocumentReference {
    return this.refAccounth.collection("accountd").doc(id);
  }
  saveAccounthCondDate(date: firebase.firestore.Timestamp) {
    this.refAccounth.update({
        condDate: date
      });
    //return date
    //this.accounth!.condDate = date as firebase.firestore.Timestamp
  }
  saveAccounthInsRate(value: number) {
    this.refAccounth.update({
        insRate: value
      });
  }
  saveAccountdDate(id: string, value: string) {
    this.refAccountdItem(id).update({
      condDate: value
    });
  }
  saveAccountdItemCd(id: string, value: string) {
    // update itemCd
    const item = this.itemMap[id] as Accountd;
    this.refAccountdItem(id).update({
      itemCd: value
    });
    const itemId = this.getChargeItemId(value)
    // ChargeMに該当データがなければクリア
    if (!itemId) {
      // set item
      this.saveAccountdItem(id, "")
      // set unitPrice
      this.saveAccountdUnitPrice(id, 0)
      //this.saveAccountdQuantity(id, 1)
      // amount
      this.saveAccountdAmount(id, 0)
      // mtsubject
      //this.saveAccountdMtsubject(id, 0)
    } else {    
      // set itemId     
      this.saveAccountdItemId(id, itemId)     
    }  
  }
  saveAccountdItemId(id: string, value: string) {
    const item = this.itemMap[id] as Accountd;
    this.refAccountdItem(id).update({
      itemId: value
    });
    // mtsubject
    this.saveAccountdMtsubject(id, this.getChargeMtsubject(value).toString())
    // set item
    this.saveAccountdItem(id, this.getChargeItem(value))    
    // set unitPrice
    this.saveAccountdUnitPrice(id, this.getChargeUnitPrice(value))
    // quantity
    if (item.quantity == null) item.quantity = 1
    this.saveAccountdQuantity(id, Number(item.quantity))
    // amount
    this.saveAccountdAmount(id, this.getChargeUnitPrice(value) * Number(item.quantity))
    
  }
  saveAccountdItem(id: string, value: string) {
    //const item = this.itemMap[id] as Accountd;
    this.refAccountdItem(id).update({
      item: value
    });
  }
  saveAccountdUnitPrice(id: string, value: number) {
    const item = this.itemMap[id] as Accountd;
    this.refAccountdItem(id).update({
      unitPrice: value
    });
  }
  saveAccountdQuantity(id: string, value: number) {
    const item = this.itemMap[id] as Accountd;
    this.refAccountdItem(id).update({
      quantity: value
    });
  }
  // asyncにしないとsumが更新されない
  async saveAccountdAmount(id: string, value: number) {
    const item = this.itemMap[id] as Accountd;
    await this.refAccountdItem(id).update({
      amount: value
    });
    
    this.calcAndSaveAccountdTax(id)
    // async await にしないと以下のwaitが必要
    setTimeout(this.calculateSum, 100);
    //this.calculateSum()
  }
  saveAccountdMtsubject(id: string, value: string) {
    //const item = this.itemMap[id] as Accountd;
    this.refAccountdItem(id).update({
      mtsubject: value,
      mtorder: Number(value),
      //mtclass: null
    });
  }
  saveAccountdMtclass(id: string, value: string) {
    this.refAccountdItem(id).update({
      mtclass: value 
    });
  }
  async saveAccountdInsurance(id: string, value: boolean) {
    const item = this.itemMap[id] as Accountd;
    let ins = 0
    if (value) {
      ins = Number(item.amount) * Number(this.insRate)
    }
    await this.refAccountdItem(id).update({
      insurance: value,
      ins: ins
    });
    setTimeout(this.calculateSum, 100);
  }
  async saveAccountdTax(id: string, value: string) {
    //const item = this.itemMap[id] as Accountd;
    //console.log("saveAccountdTax... insurance=", item.insurance)
    await this.refAccountdItem(id).update({
      tax: value,
    });
    this.calcAndSaveAccountdTax(id)
    setTimeout(this.calculateSum, 100);
    //this.calculateSum()
  }

  calcAndSaveAccountdTax(id: string) {
    const item = this.itemMap[id] as Accountd;
    let taxIn, taxEx, ins = 0
    if (item.tax == '1') {
      taxIn = 0
      taxEx = Number(item.amount) * 10 / 100
    } else if (item.tax == '2') {
      taxIn = Number(item.amount) * 10 / 110
      taxEx = 0
    } else {
      taxIn = 0
      taxEx = 0
    }
    if (item.insurance) ins = Number(item.amount) * Number(this.insRate)
    console.log('Accountd.taxEx =', taxEx, 'ins =', ins)
    this.refAccountdItem(id).update({
      taxIn: taxIn,
      taxEx: taxEx,
      ins: ins
    });
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

  getMtsubjectName(id: string) {
    if (!id || !this.mtsubjectList) return;
    const s = this.mtsubjectList as any;
    return s.find((x: any) => x.id === id).name;
  }
  getMtclassName(id: string) {
    if (!id || !this.mtclassList) return;
    const s = this.mtclassList as any;
    return s.find((x: any) => x.id === id).name;
  }
  getChargeItemId(cd: string) {
    if (!cd || !this.chargem) return;
    const s = this.chargem as any;   
    try {
      return s.find((x: any) => x.itemCd === cd).id
    } catch (e) {
      return
    }
  }
  getChargeItemCd(id: string) {
    if (!id || !this.chargem) return;
    const s = this.chargem as any;   
    try {
      return s.find((x: any) => x.id === id).itemCd
    } catch (e) {
      return
    }
  }
  getChargeItem(id: string) {
    if (!id || !this.chargem) return;
    const s = this.chargem as any;
    try {
      return s.find((x: any) => x.id === id).item
    } catch (e) {
      return
    }
  }
  getChargeItemFromId(id: string) {
    if (!id || !this.chargem) return;
    const s = this.chargem as any;
    return s.find((x: any) => x.id === id).item;
  }
  getChargeUnitPrice(id: string) {
    if (!id || !this.chargem) return;
    const s = this.chargem as any;
    return s.find((x: any) => x.id === id).unitPrice;
  }
  getChargeMtsubject(id: string) {
    if (!id || !this.chargem) return;
    const s = this.chargem as any;
    return s.find((x: any) => x.id === id).mtsubject;
  }
  calculateSum() {   
    let s: any = 0
    let ti: any = 0
    let te: any = 0
    let ins: any = 0
    this.accountdItems.forEach(doc => {
      if (doc.amount != null) s = s + doc.amount
      if (doc.amount != null && doc.taxIn != null) ti = ti + doc.taxIn
      if (doc.amount != null && doc.taxEx != null) te = te + doc.taxEx
      if (doc.amount != null && doc.ins != null) ins = ins + doc.ins
      console.log('ins', ins)
    })
    this.sum = s
    this.taxIn = ti
    this.taxEx = te
    this.insExpense = ins
    this.ownerExpense = (s + te - ins).toString()
    this.refAccounth.update({
        sum: this.sum,
        taxIn: this.taxIn,
        taxEx: this.taxEx,
        insExpense: Number(this.insExpense),
        ownerExpense: Number(this.ownerExpense)
      });
  }
  async delAccountd(id: string) {
    await this.refAccountdItem(id).delete()
    this.calculateSum()
  }

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
      this.refAccounth.update({
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

      '&$nextdate=' + moment(this.nextDate.toDate()).format('YYYY/MM/DD') + 

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
      //lang: "ja-jp",
      locale: undefined, // Browser locale
      isEditTable : true,

      /*data: [
        { 'no': 1, 'first_name': 'Jesse', 'last_name': 'Simmons', 'date': '2016-10-15 13:43:27', 'gender': 'Male' },
        { 'no': 2, 'first_name': 'John', 'last_name': 'Jacobs', 'date': '2016-12-15 06:00:53', 'gender': 'Male' },
        { 'no': 3, 'first_name': 'Tina', 'last_name': 'Gilbert', 'date': '2016-04-26 06:26:28', 'gender': 'Female' },
        { 'no': 4, 'first_name': 'Clarence', 'last_name': 'Flores', 'date': '2016-04-10 10:28:46', 'gender': 'Male' },
        { 'no': 5, 'first_name': 'Anne', 'last_name': 'Lee', 'date': '2016-12-06 14:38:38', 'gender': 'Female' }
      ],*/
      //data: this.dmhItems,
      data: [],
      columnsEdit: [
        {
          field: 'no',
          width: '30'
        },
        {
          field: 'date',
          label: '日付',
          width: '80',
        },
        {
          field: 'itemCd',
          label: 'コード',
          width: '90'  
        },
        {
          field: 'mtsubject',
          label: '科目',
          width: '110'  
        },
        {
          field: 'mtclass',
          label: "",
          width: '140'  
        },
        {
          field: 'item',
          label: '内容',
          width: '280'
        },
        {
          field: 'unitPrice',
          label: '単価',
          numeric: true,
          width: '120'
        },
        {
          field: 'quantity',
          label: '数量',
          numeric: true,
          width: '70'
        },
        {
          field: 'amount',
          label: '金額',
          numeric: true,
          width: '90'
        },
        {
          label: '保険',
          width: '60'
        },
        {
          label: '税',
          width: '140'
        },
        {
          label: '',
          width: '50'
        },
      ],
      columns: [
        {
          field: 'no',
          width: '30'
        },
        {
          field: 'date',
          label: '日付',
          width: '60'
        },
        {
          field: 'mtsubject',
          label: '科目',
          width: '100'  
        },
        {
          field: 'item',
          label: '内容',
          width: '250'
        },
        {
          field: 'unitPrice',
          label: '単価',
          numeric: true,
          width: '90'
        },
        {
          field: 'quantity',
          label: '数量',
          numeric: true,
          width: '50'
        },
        {
          field: 'amount',
          label: '金額',
          numeric: true,
          width: '90'
        },
        {
          label: '保険',
          width: '60'
        },
        {
          label: '税',
          width: '140'
        },
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

  dateFormatterMd(date: firebase.firestore.Timestamp) {
    try {
      return date.toDate().toLocaleDateString("ja-JP", {month:"numeric", day:"numeric"}) 
    } catch (e) {
      //console.log(e)
      return
    }
  }

  datetimeFormatter(date: firebase.firestore.Timestamp) {
    try {
      return date.toDate().toLocaleDateString("ja-JP", {year:"numeric", month:"2-digit", day:"2-digit"}) + " " + date.toDate().toLocaleTimeString("ja-JP", { hour: '2-digit', minute: '2-digit' })
    } catch (e) {
      return
    }
  }

  numberFormatterCurrency(num: string) {
    const formatter = new Intl.NumberFormat('ja-JP', {
      style: 'currency',
      currency: 'JPY'
    })
    if (num) {
      return formatter.format(Number(num)) 
    } else {
      return
    }
  }

  numberFormatter(num: string) {
    const formatter = new Intl.NumberFormat('ja-JP')
    if (num) {
      return formatter.format(Number(num)) 
    } else {
      return
    }
  }

  formatter (d: any) {
    return d.toLocaleDateString("ja-JP", {month:"numeric", day:"numeric"})
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

  focusDmcontentSelect(type: string) {
    //console.log("focus!", type)
    this.dmsubjectSelected = type
    this.changedDmsubject()
  }
  async changedDmsubject() {
    const b = this.dmcontent as any;
    const s = this.dmsubjectSelected; 
    //console.log("dmsubjectSelected:", s);
    const matchData = b.filter(function(item: any, index: any){
      if (item.type == s) return true;     
    });
    this.dmcontentExtracted = matchData;
  }

  focusMtclassSelect(value: string, value2: string) {
    this.mtsubjectSelected = value
    this.mtclassSelected = value2
    this.changedMtsubject()
  }
  focusChargemSelect(value: string, value2: string) {
    this.mtsubjectSelected = value
    if (value2) {
      this.mtclassSelected = value2
    } else {
      this.mtclassSelected = ""
    }
    this.changedMtsubject()
  }
  async changedMtsubject() {
    const b = this.chargem as any
    const s = this.mtsubjectSelected
    const c = this.mtclassSelected
    const matchData = b.filter(function(item: any, index: any){
      if (item.mtsubject == s && item.mtclass == c) return true;     
    });
    const matchData2 = b.filter(function(item: any, index: any){
      if (item.mtsubject == s) return true;     
    });
    if (this.mtclassSelected) {
      this.chargemExtracted = matchData;
    } else {
      this.chargemExtracted = matchData2;
    }
    //
    const b_ = this.mtclassList as any;
    const s_ = this.mtsubjectSelected; 
    const matchData3 = b_.filter(function(item: any, index: any){
      if (item.mtsubject == s_) return true;     
    });
    
    this.mtclassExtracted = matchData3;
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
    this.editMode = !this.editMode;
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
    //this.$emit("petCreate", true);
  }

  
  get isChanged() {
    return true;
  }

  changeTab(num: number) {
    this.isActive = num
    this.isActiveDefault = false
  }

  // キャッシュが空のデータはサーバーから取得する
  async reloadCache() {
    //console.log("masterNocache:",this.$store.state.masterNocache)
    // mtsubject
    const mtsubject = db.collection("mtsubject");
    const snapshot = await mtsubject.get({ source: 'cache' })
    if (snapshot.empty || this.$store.state.masterNocache == true) mtsubject.get()
    // mtclass
    const mtclass = db.collection("mtclass");
    const snapshotM = await mtclass.get({ source: 'cache' })
    if (snapshotM.empty || this.$store.state.masterNocache == true) mtclass.get()
    // chargem
    const chargem = db.collection("chargem");
    const snapshotC = await chargem.get({ source: 'cache' })
    if (snapshotC.empty || this.$store.state.masterNocache == true) chargem.get() 
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
  min-width: 20px;
}

input[type=number] {text-align: right;}

table {table-layout: fixed;}

/*
table {
  counter-reset: rowCount;
}

table > tbody > tr {
  counter-increment: rowCount;
}

table > tbody > tr > td:first-child::before {
  content: counter(rowCount)  " ";
}
*/
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