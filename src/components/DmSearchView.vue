	


<template>
  <div class="title_screen">
    <ValidationObserver ref="obs" v-slot="ObserverProps">

        <span class="p-country-name" style="display:none;">Japan</span>
        <!--<p class="subtitle is-7">※検索条件</p>-->
        <b-field label="検索する日付:"/>
        <div class="columns m-b-5">
          <div class="column is-12-mobile is-12-tablet is-12-desktop is-12-widescreen is-12-fullhd">
            <section>
              <div class="block">
                <b-radio v-model="$store.state.searchDate" @input="$store.commit('setSearchDate', $event)"
                    name="target"
                    native-value="cond">
                    実施日
                </b-radio>
                <b-radio v-model="$store.state.searchDate" @input="$store.commit('setSearchDate', $event)"
                    name="target"
                    native-value="next">
                    次回予定日
                </b-radio>
              </div>
            </section>
            <b-button type="is-light" @click="setThisMonth">今月</b-button>
            <b-button type="is-light" @click="setNextMonth" style="margin-left:1rem">来月</b-button>
            <b-button type="is-light" @click="setPrevMonth" style="margin-left:1rem">前月</b-button>
          </div>
        </div>
        <div class="columns m-b-5">         
          <div class="column is-6-mobile is-5-tablet is-4-desktop is-4-widescreen is-3-fullhd">
            <ValidationProvider>
              <b-field label="開始日" :label-position="labelPosition">
                <b-datepicker
                  v-model="$store.state.dmDateFrom" 
                  :date-formatter="(date) =>  moment(date).locale(lang).format('YYYY-MM-DD')"
                  :show-week-number="false"
                  placeholder="Click to select..."
                  icon="calendar-alt"
                  trap-focus
                  @input="$store.commit('setDmDateFrom', $event)"
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
                  v-model="$store.state.dmDateTo" 
                  :date-formatter="(date) =>  moment(date).locale(lang).format('YYYY-MM-DD')"
                  :show-week-number="false"
                  placeholder="Click to select..."
                  icon="calendar-alt"
                  trap-focus
                  @input="$store.commit('setDmDateTo', $event)"
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
        <b-field label="検索する項目:"/>
        <div v-if="dmsubjectList">       
          <div class="columns is-mobile">
            <div class="column is-6-mobile is-5-tablet is-4-desktop is-4-widescreen is-3-fullhd">
              <li v-for="item in dmsubjectList.slice(0,7)" :key="item.id" style="list-style: none;">
                <b-checkbox v-model="$store.state.dmCheck[item.no]"
                  @input="$store.commit('setDmCheck', $store.state.dmCheck)"
                >
                  {{item.name}}
                </b-checkbox>
              </li>
            </div>
            <div class="column is-6-mobile is-5-tablet is-4-desktop is-4-widescreen is-3-fullhd">
              <li v-for="item in dmsubjectList.slice(7,14)" :key="item.id" style="list-style: none;">
                <b-checkbox v-model="$store.state.dmCheck[item.no]"
                  @input="$store.commit('setDmCheck', $store.state.dmCheck)"
                >
                  {{item.name}}
                </b-checkbox>
              </li>
            </div>
          </div> 
        </div>
        <p class="subtitle is-7">※一つもチェックがない場合は全ての項目が対象になります。 <font color="red">{{alert}}</font></p>     
        <div class="m-b-15"></div>
        <b-button class="button is-light" icon-left="fas fa-backward" @click="handleBack" style="margin-right:1rem">戻る</b-button>
        <b-button type="is-primary" @click="handleSearch" :disabled="ObserverProps.invalid">検索実行</b-button>

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



export default class DmSearchView extends Vue {
  dmsubjectList: DmSubject | null = null
  fromDate: Date | null = null
  toDate: Date | null = null
  searchDate = ""
  check: boolean[] = [false, false, false, false, false, false, false, false, false, false, 
    false, false, false, false, false, false, false, false, false ,false] 
  alert = ""
  @Prop() readonly refCollection!: firebase.firestore.CollectionReference;
  
  @Watch("$store.state.dmCheck", { immediate: true })
    finishCount(newVal: number[], oldVal: boolean[]): void {
      
      const result = newVal.reduce(function (accumulator, currentValue, currentIndex, newVal) {
        return Number(accumulator) + Number(currentValue);
      });
      if (result > 10) {   
        // oldValとnewValは同じ値で元に戻せないのでAlertダイアログではなく警告表示にする  
        //alert("チェックは10個までです");
        this.alert = "チェックは10個までです。"
      } else {
        this.alert = ""
      }
    }

  mounted() {
    const dmsubjectRef = db.collection("dmsubject");
    const result: any = [];
    dmsubjectRef
      //.get()
      .get({ source: 'cache' })
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          result.push(d as DmSubject);
        });
        this.dmsubjectList = result;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    // 以下Storeに変更
    //this.searchDate = "next"
    //this.setNextMonth()
  }

  async handleSearch() {
    // 検索実行
    eventBus.$emit("searchDmh", this.$store.state.dmDateFrom, this.$store.state.dmDateTo, this.$store.state.searchDate, this.$store.state.dmCheck);
  }

  handleBack() {
    this.$router.go(-1);
  }

  data() {
    return {
      labelPosition: 'on-border',
      lang: "ja-jp",
    }
  }

  setThisMonth() {
    const today = new Date();
    this.$store.state.dmDateFrom = firestore.Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), 1)).toDate()
    this.$store.state.dmDateTo = firestore.Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth() + 1, 0)).toDate()
  }

  setNextMonth() {
    const today = new Date();
    this.$store.state.dmDateFrom = firestore.Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth() + 1, 1)).toDate()
    this.$store.state.dmDateTo = firestore.Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth() + 2, 0)).toDate()
  }

  setPrevMonth() {
    const today = new Date();
    this.$store.state.dmDateFrom = firestore.Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth() - 1, 1)).toDate()
    this.$store.state.dmDateTo = firestore.Timestamp.fromDate(new Date(today.getFullYear(), today.getMonth(), 0)).toDate()
  }

  //checkChanged() {
  //  console.log("check =", this.check);
  //}
  
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
