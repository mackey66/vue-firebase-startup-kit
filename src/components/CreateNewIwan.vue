	


<template>
  <div >
    <!--<h2 class="h2">飼主新規登録</h2>-->
    <p class="subtitle is-7">※必須項目</p>
    <ValidationObserver ref="obs" v-slot="ObserverProps">
      <form class="h-adr">
        <span class="p-country-name" style="display:none;">Japan</span>
        
        <div class="columns m-b-5">
          <div class="column is-6-mobile is-4-tablet is-4-desktop is-4-widescreen is-3-fullhd">
            <ValidationProvider rules="required|max:8|numeric">
              <div slot-scope="ProviderProps">
                <b-field label="カルテNo（飼主No）※" :label-position="labelPosition"
                  :type="{
                    'is-danger': ProviderProps.errors[0] || errorNo,
                  }"
                  :message="{
                    '必須項目です': ProviderProps.failedRules['required'],
                    '最大文字数(8)を超えています': ProviderProps.failedRules['max'],
                    '数字以外は使用できません': ProviderProps.failedRules['numeric'],
                    '同じカルテNoがあります': errorNo,
                  }">
                  <b-input v-model="no" @keyup.native="searchNo" ></b-input>
                </b-field>
              </div>
            </ValidationProvider>
          </div>
        </div>
        <div class="columns is-mobile m-b-5">
          <div class="column is-6-mobile is-4-tablet is-4-desktop is-4-widescreen is-3-fullhd">
            <ValidationProvider rules="required|max:8">
              <div slot-scope="ProviderProps">
                <b-field label="飼主名※" :label-position="labelPosition"
                  :type="{
                    'is-danger': ProviderProps.errors[0] || errorNo,
                  }"
                  :message="{
                    '必須項目です': ProviderProps.failedRules['required'],
                  }"
                >
                  <b-input v-model="nameSei" placeholder="姓" @keyup.native="searchName"></b-input>
                </b-field>
              </div>
            </ValidationProvider>
          </div>
          <div class="column is-6-mobile is-4-tablet is-4-desktop is-4-widescreen is-3-fullhd">
            <b-field
              :type="{
                'is-danger': errorName,
              }"
              :message="{
                '同じ名前があります': errorName,
              }"
            >
              <b-input v-model="nameNa" placeholder="名" @keyup.native="searchName"></b-input>
            </b-field>
          </div>
          
        </div>
        <div class="columns m-b-5">
          <div class="column is-5-mobile is-4-tablet is-4-desktop is-4-widescreen is-3-fullhd">
            <ValidationProvider rules="max:7|numeric">
              <div slot-scope="ProviderProps">
                <b-field label="郵便番号" :label-position="labelPosition"
                  :type="{
                    'is-danger': ProviderProps.errors[0],
                  }"
                  :message="{
                    '数字以外は使用できません': ProviderProps.failedRules['numeric'],
                    '最大文字数(7)を超えています': ProviderProps.failedRules['max']
                  }"
                >
                  <b-input v-model="zip" @keyup.native="searchZip"></b-input>
                </b-field>
              </div>
            </ValidationProvider>
          </div>
        </div>
        <div class="columns m-b-5">
          <div class="column">
            <b-field label="市区町村" :label-position="labelPosition">
              <b-input v-model="address1" name="住所" ></b-input>
            </b-field>
          </div>
          <div class="column">
            <b-field label="番地" :label-position="labelPosition"
              :type="{
                'is-danger': errorAddress,
              }"
              :message="{
                '同じ住所があります': errorAddress,
              }"
            >
              <b-input v-model="address2" @keyup.native="searchAddress"></b-input>
            </b-field>
          </div>
          <div class="column">
            <b-field label="マンション" :label-position="labelPosition">
              <b-input v-model="address3"></b-input>
            </b-field>
          </div>
          
        </div>
        <div class="columns m-b-5">
          <div class="column is-6-mobile is-4-tablet is-4-desktop is-3-widescreen is-3-fullhd">
            <ValidationProvider :rules="{regex: /^[0-9\-]+$/}">
              <div slot-scope="ProviderProps">
                <b-field label="電話番号1" :label-position="labelPosition" @keyup.native="searchPhone(phone1,'1')"
                  :type="{
                    'is-danger': ProviderProps.errors[0] || errorPhone1,
                  }"
                  :message="{
                    '数字とハイフン(-)以外は使用できません': ProviderProps.failedRules['regex'],
                    '同じ電話番号があります': errorPhone1,
                  }"
                >
                  <b-input v-model="phone1"></b-input>
                </b-field>
              </div>
            </ValidationProvider>
          </div> 
          <div class="column is-6-mobile is-4-tablet is-4-desktop is-3-widescreen is-3-fullhd">
            <ValidationProvider :rules="{regex: /^[0-9\-]+$/}">
              <div slot-scope="ProviderProps">
                <b-field label="電話番号2" :label-position="labelPosition" @keyup.native="searchPhone(phone2,'2')"
                  :type="{
                    'is-danger': ProviderProps.errors[0] || errorPhone2,
                  }"
                  :message="{
                    '数字とハイフン(-)以外は使用できません': ProviderProps.failedRules['regex'],
                    '同じ電話番号があります': errorPhone2,
                  }"
                >
                  <b-input v-model="phone2"></b-input>
                </b-field>
              </div>
            </ValidationProvider>
          </div>
          <div class="column is-6-mobile is-4-tablet is-4-desktop is-3-widescreen is-3-fullhd">
            <ValidationProvider :rules="{regex: /^[0-9\-]+$/}">
              <div slot-scope="ProviderProps">
                <b-field label="電話番号3" :label-position="labelPosition" @keyup.native="searchPhone(phone3,'3')"
                  :type="{
                    'is-danger': ProviderProps.errors[0] || errorPhone3,
                  }"
                  :message="{
                    '数字とハイフン(-)以外は使用できません': ProviderProps.failedRules['regex'],
                    '同じ電話番号があります': errorPhone3,
                  }"
                >
                  <b-input v-model="phone3"></b-input>
                </b-field>
              </div>
            </ValidationProvider>
          </div>           
        </div>
        <div class="columns m-b-5">
          <div class="column is-12-mobile is-8-tablet is-6-desktop is-5-widescreen is-4-fullhd">
            <b-field label="備考" :label-position="labelPosition">
              <b-input v-model="remarks"></b-input>
            </b-field>
          </div> 
        </div>
        <b-button class="button is-light" icon-left="fas fa-backward" @click="handleBack" style="margin-right:1rem">戻る</b-button>  
        <b-button type="is-primary" @click="handleCreate" :disabled="ObserverProps.invalid || errorNo">Create Owner</b-button>
      </form>
    </ValidationObserver>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { db, firestore } from "@/scripts/firebase";
import KenAll from 'ken-all';
import { eventBus } from "../main"; // 子 → 子 受け渡し用
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { extend } from 'vee-validate';
import { required, email, max, numeric, regex } from 'vee-validate/dist/rules';
//import * as rules from 'vee-validate/dist/rules';

extend('required', required);
extend('max', max);
extend('numeric', numeric);
//extend('regex', regex);

@Component({
  components: {
    ValidationProvider,
    ValidationObserver
  }
})

export default class CreateNew extends Vue {
  title = "";
  no = "";
  nameSei = "";
  nameNa = "";
  zip = "";
  address1 = "";
  address2 = "";
  address3 = "";
  phone1 = "";
  phone2 = "";
  phone3 = "";
  phone4 = "";
  occupation = "";
  remarks = "";
  errorNo = false;
  errorName = false;
  errorPhone1 = false;
  errorPhone2 = false;
  errorPhone3 = false;
  errorAddress = false;
  @Prop() readonly refCollection!: firebase.firestore.CollectionReference;

  async handleCreate() {
    //const doc = 
    await this.refCollection.add({
      owner: this.$store.state.user.uid,
      ownerName: this.$store.state.user.displayName,
      timeCreated: firestore.FieldValue.serverTimestamp(),
      no: Number(this.no),
      nameSei: this.nameSei,
      nameNa: this.nameNa,
      zip: this.zip,
      address1: this.address1,
      address2: this.address2,
      address3: this.address3,
      phone: [this.phone1, this.phone2, this.phone3, this. phone4],
      occupation: this.occupation,
      remarks: this.remarks,
    })
    .then(docRef => {
      console.log("Document written with ID: ", docRef.id);
      this.$router.push("/owner/" + docRef.id);
    })
    .catch(error => {
      console.error("Error adding document: ", error);
      alert("Error adding document: " + error);
    });
    //this.$emit("created", doc.id);
  }

  handleBack() {
    this.$router.go(-1);
  }

  data() {
    return {
      labelPosition: 'on-border'
    }
  }

  searchZip() {
    if (this.zip.length === 7) {
      KenAll(this.zip).then(res => {
        if (res.length === 0) {
          this.address1 = '該当する住所はありません';
        } else {
          this.address1 = res[0].join('');
        }
      });
    }
    //alert('You wanna make a search?');
  }
  
  async searchNo() {
    // Alert用
    let result = false;
    if (this.no.length > 0 && !this.no.search(/^[0-9]+$/)) {   
      await db.collection("owners")
        .where("owner", "==", this.$store.state.user.uid)
        .where("no", "==", Number(this.no))
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            // doc.data() is never undefined for query doc snapshots
            //console.log(doc.id, " => ", doc.data());
            //console.log('同じカルテNoがあります');
            result = true;
          });
        })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    }
    this.errorNo = result;
    // 結果リスト用
    eventBus.$emit("noWasChanged", this.no);
  }

  async searchName() {
    // Alert用
    let result = false;
    if (this.nameSei.length > 0) {   
      await db.collection("owners")
        .where("owner", "==", this.$store.state.user.uid)
        .where("nameSei", "==", this.nameSei).where("nameNa", "==", this.nameNa)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            result = true;
          });
        })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
      
    }
    this.errorName = result;
    // 結果リスト用
    eventBus.$emit("nameWasChanged", this.nameSei, this.nameNa);
  }

  async searchPhone(phone: string, no: string) {
    // Alert用
    let result = false;
    if (phone.length > 0) {   
      await db.collection("owners")
        .where("owner", "==", this.$store.state.user.uid)
        .where("phone", "array-contains", phone)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            result = true;
          });
        })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
      
    }
    if (no == '1') {
      this.errorPhone1 = result;
    } else if (no == '2') {
      this.errorPhone2 = result;
    } else {
      this.errorPhone3 = result;
    }
    // 結果リスト用
    //eventBus.$emit("phoneWasChanged", this.phone);
  }

  async searchAddress() {
    // Alert用
    let result = false;
    if (this.address2.length > 0) {   
      await db.collection("owners")
        .where("owner", "==", this.$store.state.user.uid)
        .where("address1", "==", this.address1).where("address2", "==", this.address2)
        .get()
        .then(function(querySnapshot) {
          querySnapshot.forEach(function(doc) {
            result = true;
          });
        })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
      
    }
    this.errorAddress = result;
    // 結果リスト用
    eventBus.$emit("addressWasChanged", this.address1, this.address2);
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
