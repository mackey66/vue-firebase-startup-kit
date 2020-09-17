<template>
  <div>
    <div class="m-l-20">
      <b-button class="button is-light" icon-left="fas fa-window-close" @click="close">閉じる</b-button>
      <b-button class="button is-light" icon-left="fas fa-print" @click="print" style="margin-left:1rem">印刷</b-button>
    </div>
    <div v-for="item in articles" :key="item.id">
      <section class="sheet">
        <p class="郵便番号">{{item.zip}}</p>
        <p class="住所">{{item.address1}}<br />{{item.address2}}</p>
        <div class="宛名">
          <p>{{item.ownerFullname}} 様</p>
          <p>    {{item.petName}} 様</p>
        </div>
        <div class="差出人住所氏名">
          <p class="差出人住所">大阪府堺市西区上<br />229-1-302</p>
          <p class="差出人">アイワン株式会社</p>
          <p class="差出人">    真木</p>
        </div>
        <p class="差出人郵便番号">5938311</p>
      </section>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { db } from "@/scripts/firebase";
import { Dmh } from "../scripts/datatypes";

@Component({
  components: {
  }
})


export default class Postcard extends Vue {
  //@Prop() readonly articles!: Array<Dmh>

  refCollection = db.collectionGroup(`dmh`);
  articles: Array<Dmh> = [];

  created() {  
    try {
      this.articles = JSON.parse(localStorage.getItem('articles')!) as Array<Dmh>;
    } catch(e) {
      localStorage.removeItem('articles');
    }
    console.log("articles:", this.articles) 
  }

  mounted() {
    print()
  }

  handleCreated(id: string) {
    this.$router.push(`/dmh/${id}`);
  }

  close() {
    window.close()
  }
  
  print() {
    window.print()
    window.close()
  }

  data() {
    return {
      lang: "ja-jp"
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

@page {size:100mm 147mm; margin:0; padding:0;}
/*
@page { 
  size: Postcard portrait;
  //margin: 0;
}
*/

body {margin: 0; padding: 0;}

.sheet {
  width:100mm; height:147mm;
  margin: 0;
  padding:0;
  position: relative;
  page-break-after: always;
}

p {
  margin:0;
  padding:0;
}

.郵便番号 {
  font-size:12pt;
  font-family:"IPAmj明朝"; //IPAmj明朝で文字間等を調整している
  margin:0;
  padding:0;
  position: absolute; top: 14mm; left: 46mm; //ズレる場合は位置調整
  letter-spacing: 4.4mm; //文字間
}

.住所 {
  font-family: "IPAmj明朝"; 
  font-size:14pt;
  margin-left:0px;
  padding-top:0px;
  line-height:1.5em;
  writing-mode: vertical-rl;
  -webkit-writing-mode: vertical-rl;
  text-orientation: upright;
  -webkit-text-orientation: upright;
  position:absolute; top:30mm; right:10mm;
}

.宛名 {
  font-family:"IPAmj明朝" ;
  font-size:22pt; 
  letter-spacing: 0.1em;
  position: absolute;
  top: 30%;
  left: 50%;
  -webkit-transform: translateY(-10%) translateX(-50%);
  transform: translateY(-10%) translateX(-50%);
  writing-mode: vertical-rl;
  -webkit-writing-mode: vertical-rl;
  text-orientation: upright;
  -webkit-text-orientation: upright;
}

.差出人住所氏名 {
  position:absolute; top:70mm; left:10mm;
  writing-mode: vertical-rl;
  -webkit-writing-mode: vertical-rl;
  text-orientation: upright;
  -webkit-text-orientation: upright;
}

.差出人住所 {
  font-family:"IPAmj明朝" ;
  font-size:10pt; 
  margin:0;
  padding-left:0.5em;
}

.差出人 {
  font-family:"IPAmj明朝" ;
  font-size:14pt; 
  letter-spacing: 0.1em;
  margin:0;
  padding-top:0.5em;
}

.差出人郵便番号 {
  font-size:10pt;
  font-family:"IPAmj明朝"; /* IPAmj明朝で文字間等を調整している */
  margin:0;
  padding:0;
  position:absolute; top:124mm; left:6mm; /* ズレる場合は位置調整 */
  letter-spacing: 1.8mm; /* 文字間 */
}

/** For screen preview **/
@media screen {
  body { background: #e0e0e0 }
  .sheet {
  background: white;
  box-shadow: 0 .5mm 2mm rgba(0,0,0,.3);
  margin: 5mm;
  }
  .navbar {
    display: none;
  }
}

@media print {
  body {
    width:100mm; height:148mm; /* needed for Chrome */
  }
  .navbar, .button {
    display: none;
  }
}

</style>