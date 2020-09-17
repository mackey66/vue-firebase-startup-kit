<template>
  <div>
    <div class="m-l-20">
      <b-button class="button is-light" icon-left="fas fa-window-close" @click="close">閉じる</b-button>
      <b-button class="button is-light" icon-left="fas fa-print" @click="print" style="margin-left:1rem">印刷</b-button>
    </div>
    <div class="section is-size-7 p-t-20 p-b-15">
      <h6 class="title is-6 m-b-5 m-l-15">DM List</h6>
      <b-table :data="articles" :mobile-cards="false" :narrowed="true">
        <template slot-scope="p">
          <b-table-column field="no" label="No">{{ p.row.no + "-" + p.row.petNo }}</b-table-column>
          <b-table-column field="ownerName" label="飼主名">{{ p.row.ownerFullname }}</b-table-column>
          <b-table-column field="petName" label="ペット名">{{ p.row.petName }}</b-table-column>
          <b-table-column field="zip" label="郵便番号">{{ p.row.zip }}</b-table-column>
          <b-table-column field="address1" label="住所">{{ p.row.address1 }}</b-table-column>
          <b-table-column field="address2" label="">{{ p.row.address2 }}</b-table-column>
          <b-table-column field="type" label="項目">{{ p.row.type }}</b-table-column>
          <b-table-column field="name" label="内容">{{ p.row.name }}</b-table-column>
          <b-table-column field="condDate" label="実施日" >{{ p.row.condDate }}</b-table-column>
          <b-table-column field="nextDate" label="次回予定日" >{{ p.row.nextDate }}</b-table-column>
        </template>
        <template slot="footer">
          <div class="has-text-right">
              <!--{{ (new Date()).toLocaleDateString("ja-JP", {year:"numeric", month:"2-digit", day:"2-digit"}) }}-->
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { db } from "@/scripts/firebase";
import { IwanBaseDocument, Dmh } from "../scripts/datatypes";

@Component({
  components: {
  }
})

export default class Postcard extends Vue {
  refCollection = db.collectionGroup(`dmh`);
  articles: Array<Dmh> = [];
  dmsubjectList: IwanBaseDocument | null = null;

  created() {  
    try {
      this.articles = JSON.parse(localStorage.getItem('articles')!) as Array<Dmh>;
    } catch(e) {
      localStorage.removeItem('articles');
    }
    console.log("articles:", this.articles) 
  }

  mounted() {
    // Tableのヘッダが描画される前に呼び出されてしまうのでWaitを入れる
    setTimeout(print, 1000);
  }

  updated() {
    //print()
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
  /*
  getDmsubjectName(id: string) {
    if (!id || !this.dmsubjectList) return;
    const s = this.dmsubjectList as any;
    return s.find((x: any) => x.id === id).name;
  }

  dateFormatter(date: firebase.firestore.Timestamp) {
    try {
      return date.toDate().toLocaleDateString("ja-JP", {year:"numeric", month:"2-digit", day:"2-digit"}) 
    } catch (e) {
      return
    }
  }
  */
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

//@page {size:100mm 147mm; margin:0; padding:0;}

@page { 
  size: A4 landscape;
  //margin: 0;
}

//body {margin: 0; padding: 0;}

/** For screen preview **/
@media screen {
  body { background: #e0e0e0 }
  .section {
    background: white; /* 背景を白く */
    box-shadow: 0 .5mm 2mm rgba(0,0,0,.3); /* ドロップシャドウ */
    margin: 5mm;
  }
  .navbar {
    display: none;
  }
}

@media print {
  /*
  body {
    width:100mm; height:148mm; //needed for Chrome
  }
  */
  .navbar, .button {
    display: none;
  }
}

</style>