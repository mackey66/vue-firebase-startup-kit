<template>
  <div>
    <div class="title_print m-b-0">
      <span class="h2">*** Account List ***</span>
    </div>
    <!--<div class="columns m-b-0">
      <div class="column is-12-mobile is-12-tablet is-11-desktop is-10-widescreen is-8-fullhd">-->
        <div id="print_target" class="container">
          <b-table :data="$store.state.accounth" :mobile-cards="true">
            <template slot-scope="p">
              <b-table-column field="condDate" label="日付" width="150">{{ datetimeFormatter(p.row.condDate) }}</b-table-column>
              <b-table-column field="no" label="No" width="80">{{ p.row.no + "-" + p.row.petNo }}</b-table-column>
              <b-table-column field="ownerName" label="飼主名" width="100">{{ p.row.ownerFullname }}</b-table-column>
              <b-table-column field="petName" label="ペット名" width="90">{{ p.row.petName }}</b-table-column>  
              <b-table-column field="sum" label="税込合計" numeric width="100">{{ numberFormatterCurrency(p.row.sum + p.row.taxEx) }}</b-table-column>
              <b-table-column field="insExpense" label="保険" numeric width="100">{{ numberFormatterCurrency(p.row.insExpense) }}</b-table-column>
              <b-table-column field="ownerExpense" label="請求額" numeric width="100">{{ numberFormatterCurrency(p.row.ownerExpense) }}</b-table-column>
              <b-table-column width="60">
                <div class="level-right">
                  <router-link :to="`/accounth/${p.row.id}/${p.row.petId}/${p.row.ownerId}`">
                    <b-button type="is-light" icon-left="fas fa-sticky-note" size="is-small" >Edit</b-button>
                  </router-link>
                </div>
              </b-table-column>
            </template>
          </b-table>
        </div>
      <!--</div>  
    </div>-->
    <span v-if="articles.length > 0">
      <!--<b-button class="button is-light" icon-left="fas fa-print" @click="printList">リスト印刷</b-button>
      <b-button class="button is-light" icon-left="fas fa-print" @click="printPostcard" style="margin-left:1rem">ハガキ印刷</b-button>-->

    </span>
    <!--<br><br>
    <iframe :src="preview" scrolling="no"></iframe>-->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { db, firestore } from "@/scripts/firebase";
import { IwanBaseDocument, Accounth } from "../scripts/datatypes";
import { eventBus } from "../main"; // 子 → 子 受け渡し用
import moment from 'moment';
Vue.prototype.moment = moment;
import JsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component
export default class ListViewIwanAccounth extends Vue {
  @Prop() readonly refCollection!: firebase.firestore.CollectionReference;
  @Prop() readonly path!: string;
  detacher?: firebase.Unsubscribe;
  articles: Array<Accounth> = [];
  dmsubjectList: IwanBaseDocument | null = null;
  el = document.getElementById('print_target') as HTMLElement
  //el = document.querySelector("#print_target") as HTMLElement
  preview = ""

  created() {
    eventBus.$on("searchAccounth", this.accounthList);
  }

  destroyed() {
    this.detacher && this.detacher();
  }

  accounthList(from: Date, to: Date) {
    this.detacher = this.refCollection
    .orderBy('condDate', 'asc').startAt(from).endAt(to)
    //.where("owner", "==", this.$store.state.user.uid)
    .onSnapshot(snapshot => {
      this.$store.state.accounth = snapshot.docs.map(doc => {
        //console.log(doc.id, " => ", doc.data());
        return Object.assign(doc.data(), { id: doc.id as unknown}) as Accounth;
      });
    });  
    // ウインドウ最下部に移動して検索が実行されたことがわかるようにする
    const element = document.documentElement;
    const bottom = element.scrollHeight - element.clientHeight;
    window.scroll(0, bottom);
  }

  handleBack() {
    this.$router.go(-1);
  }

  dateFormatter(date: firebase.firestore.Timestamp) {
    try {
      return date.toDate().toLocaleDateString("ja-JP", {year:"numeric", month:"2-digit", day:"2-digit"}) 
    } catch (e) {
      console.log(e)
      return date
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

  pdfPrint() {
    // トップに移動（しないとPDFのxがおかしくなる）
    window.scrollTo(0,0);
    // html2canvasを使い、指定した要素をCanvasに変換する処理
    html2canvas(document.querySelector("#print_target") as HTMLElement, {scale: 3}).then((canvas) => {
      
      // jspdfの初期化
      const pdf = new JsPDF('l', 'mm', 'a4', true);

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

      pdf.setFontSize(14);
      pdf.text('DM List', 15, 15);

      pdf.autoPrint();

      // 最下部に移動
      const element = document.documentElement;
      const bottom = element.scrollHeight - element.clientHeight;
      window.scroll(0, bottom);

      // blobに変換
      const blob = firestore.Blob.fromUint8Array(new Uint8Array(pdf.output('arraybuffer')));
      
      // プレビュー
      const image = blob.toBase64() as string
      this.preview = "data:application/pdf;base64," + image + "#page=1?zoom=100"
      
      // firestoreに保存
      //this.refDmh.update({
      //  img: blob
      //});
      
    });
  }

  htmlPrint() {
    // 用紙サイズが無視される、ページ指定ができない等の問題あり
    window.print()
    window.close()
  }

  printList() {
    // 印刷データをlocalStrageに保存
    const parsed = JSON.stringify(this.articles);
    localStorage.setItem('articles', parsed);
    // リスト印刷用ウインドウを開く
    window.open("dmlist", '_blank')
  }

  printPostcard() {
    // 印刷データをlocalStrageに保存
    const parsed = JSON.stringify(this.articles);
    localStorage.setItem('articles', parsed);
    // はがき印刷用ウインドウを開く
    window.open("postcard", '_blank')
    //const routeData = this.$router.resolve({name: 'postcard', params: {articles: "articles"}});
    //window.open(routeData.href, '_blank');
  }

  data() {
    return {
      lang: "ja-jp"
    }
  }
}
</script>

<style lang="scss" scoped>
.listview {
  margin-top: 8px;
}

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
  .navbar {
    display: none;
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

