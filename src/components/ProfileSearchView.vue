	


<template>
  <div class="title_screen">
    <span class="p-country-name" style="display:none;">Japan</span>
    <ValidationObserver ref="obs" v-slot="ObserverProps">

        <b-field label="検索条件:"/>    
          <div class="columns is-mobile">
            <div class="column is-12-mobile is-10-tablet is-8-desktop is-7-widescreen is-6-fullhd">
              <ValidationProvider rules="required">
                <div slot-scope="ProviderProps">
                  <b-field
                    :type="{
                      'is-danger': ProviderProps.errors[0],
                    }"
                    :message="{
                      '検索するキーワードを入力してください': ProviderProps.failedRules['required'],
                    }">
                    <b-input placeholder="Search..."
                      type="search"
                      icon-pack="fas"
                      icon="search"
                      v-model="$store.state.keyword" 
                      @keyup.enter.native="handleSearch"
                    >
                    </b-input>
                  </b-field>
                </div>
              </ValidationProvider>
            </div>
          </div>                    
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

export default class ProfileSearchView extends Vue {
  keyword = ""
  @Prop() readonly refCollection!: firebase.firestore.CollectionReference;

  handleSearch() {
    //this.$store.commit('setKeyword', this.$store.state.keyword) // 不要
    eventBus.$emit("searchProfile", this.$store.state.keyword);
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
