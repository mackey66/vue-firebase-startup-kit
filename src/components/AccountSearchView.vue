	


<template>
  <div class="title_screen">
    <ValidationObserver ref="obs" v-slot="ObserverProps">

        <span class="p-country-name" style="display:none;">Japan</span>
        <!--<p class="subtitle is-7">※検索条件</p>-->
        <b-field label="検索する日付:"/>
        <div class="columns m-b-5">         
          <div class="column is-6-mobile is-5-tablet is-4-desktop is-4-widescreen is-3-fullhd">
            <ValidationProvider>
              <b-field label="開始日" :label-position="labelPosition">
                <b-datepicker
                  v-model="$store.state.dateFrom" 
                  :date-formatter="(date) =>  moment(date).locale(lang).format('YYYY-MM-DD')"
                  :show-week-number="false"
                  placeholder="Click to select..."
                  icon="calendar-alt"
                  trap-focus
                  @input="$store.commit('setDateFrom', $event)"
                  style="max-width: 200px;">
                  <button class="button is-primary"
                    @click="fromDate = new Date()">
                    <b-icon icon="calendar-alt"></b-icon>
                    <span>Today</span>
                  </button>
                </b-datepicker>
              </b-field>
            </ValidationProvider>
          </div>
          <div class="column is-6-mobile is-5-tablet is-4-desktop is-4-widescreen is-3-fullhd">
            <ValidationProvider>
              <b-field label="終了日" :label-position="labelPosition">
                <b-datepicker
                  v-model="$store.state.dateTo" 
                  :date-formatter="(date) =>  moment(date).locale(lang).format('YYYY-MM-DD')"
                  :show-week-number="false"
                  placeholder="Click to select..."
                  icon="calendar-alt"
                  trap-focus
                  @input="$store.commit('setDateTo', $event)"
                  style="max-width: 200px;">
                  <button class="button is-primary"
                    @click="toDate = new Date()">
                    <b-icon icon="calendar-alt"></b-icon>
                    <span>Today</span>
                  </button>
                </b-datepicker>
              </b-field>
            </ValidationProvider>
          </div>  
        </div>
        <b-button class="button is-light" icon-left="fas fa-backward" @click="handleBack" style="margin-right:1rem">戻る</b-button>
        <b-button type="is-primary" @click="handleSearch" :disabled="ObserverProps.invalid">検索実行</b-button>
        <keep-alive>
      <!--<component :is="fDate"></component>-->
    </keep-alive>
    </ValidationObserver>
  </div>
</template>


<script lang="ts">
import Vue from "vue";
import { Component, Prop, Watch } from "vue-property-decorator";
import { db, firestore } from "@/scripts/firebase";
//import { BaseDocument } from "../scripts/datatypes";
import { DmSubject } from "../scripts/datatypes";
import { eventBus } from "../main"; // 子 → 子 受け渡し用
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { extend } from 'vee-validate';
import { required, email, max, numeric, regex } from 'vee-validate/dist/rules';
//import * as rules from 'vee-validate/dist/rules';
import moment from 'moment';
Vue.prototype.moment = moment;


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



export default class AccountSearchView extends Vue {
  dmsubjectList: DmSubject | null = null
  fromDate: Date | null = null
  toDate: Date | null = null
  searchDate = ""
  alert = ""
  @Prop() readonly refCollection!: firebase.firestore.CollectionReference;

  mounted() {
    this.searchDate = "next"
    this.setNextMonth()
  }

  async handleSearch() {
    // 結果リスト用
    eventBus.$emit("searchAccounth", this.$store.state.dateFrom, this.$store.state.dateTo);
  }

  handleBack() {
    this.$router.go(-1);
  }

  data() {
    return {
      labelPosition: 'on-border',
      lang: "ja-jp",
      //fDate: this.fromDate
    }
  }

  setThisMonth() {
    const today = new Date();
    this.fromDate = firestore.Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), 1)).toDate()
    this.toDate = firestore.Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth() + 1, 0)).toDate()
  }

  setNextMonth() {
    const today = new Date();
    this.fromDate = firestore.Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth() + 1, 1)).toDate()
    this.toDate = firestore.Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth() + 2, 0)).toDate()
  }

  setPrevMonth() {
    const today = new Date();
    this.fromDate = firestore.Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)).toDate()
    this.toDate = firestore.Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), 0)).toDate()
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
  size: A4 landscape;
  //margin: 0;
}
</style>
