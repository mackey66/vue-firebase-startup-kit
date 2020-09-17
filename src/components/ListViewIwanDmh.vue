<template>
  <div>
    <div class="title_print m-b-0">
      <span class="h2">*** DM List ***</span>
    </div>
    <div class="columns m-b-0">
      <div class="column is-12-mobile is-12-tablet is-11-desktop is-10-widescreen is-8-fullhd">
        <div id="print_target" class="container">
          <b-table :data="$store.state.dmh" :mobile-cards="true">
            <template slot-scope="p">
              <b-table-column field="no" label="No">{{ p.row.no + "-" + p.row.petNo }}</b-table-column>
              <b-table-column field="ownerName" label="飼主名" width="120">{{ p.row.ownerFullname }}</b-table-column>
              <b-table-column field="petName" label="ペット名" width="90">{{ p.row.petName }}</b-table-column>
              <b-table-column field="type" label="項目">{{ p.row.type }}</b-table-column>
              <b-table-column field="name" label="内容">{{ p.row.name }}</b-table-column>
              <b-table-column field="condDate" label="実施日" >{{ p.row.condDate }}</b-table-column>
              <b-table-column field="nextDate" label="次回予定日" >{{ p.row.nextDate }}</b-table-column>
            </template>
          </b-table>
        </div>
      </div>  
    </div>
    <span v-if="articles.length > 0">
      <b-button class="button is-light" icon-left="fas fa-print" @click="printList">リスト印刷</b-button>
      <b-button class="button is-light" icon-left="fas fa-print" @click="printPostcard" style="margin-left:1rem">ハガキ印刷</b-button>

    </span>
    <!--<br><br>
    <iframe :src="preview" scrolling="no"></iframe>-->
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { db, firestore } from "@/scripts/firebase";
import { IwanBaseDocument, Dmh } from "../scripts/datatypes";
import { eventBus } from "../main"; // 子 → 子 受け渡し用
import moment from 'moment';
Vue.prototype.moment = moment;
import JsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component
export default class ListViewIwanDmh extends Vue {
  @Prop() readonly refCollection!: firebase.firestore.CollectionReference;
  @Prop() readonly path!: string;
  detacher?: firebase.Unsubscribe;
  articles: Array<Dmh> = [];
  dmsubjectList: IwanBaseDocument | null = null;
  el = document.getElementById('print_target') as HTMLElement
  //el = document.querySelector("#print_target") as HTMLElement
  preview = ""

  created() {
    eventBus.$on("searchDmh", this.dmhList);

    /*
    this.detacher = this.refCollection
      //.orderBy("timeCreated", "desc")
      //.where("owner", "==", this.$store.state.user.uid)
      .onSnapshot(snapshot => {
        this.articles = snapshot.docs.map(doc => {
          return Object.assign(doc.data(), { id: doc.id }) as Dmh;
        });
      });
    */
    const dmsubjectRef = db.collection("dmsubject")
    const result: any = []
    dmsubjectRef
      //.get()
      .get({ source: 'cache' })
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data()
          d.id = doc.id
          result.push(d as IwanBaseDocument)
        });
        this.dmsubjectList = result
        //console.log('dmsubjectList:', this.dmsubjectList);
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error)
      });
  }

  destroyed() {
    this.detacher && this.detacher();
  }

  dmhList(from: Date, to: Date, target: string, type: []) {
    //console.log("from:", from, "to:", to)
    // convert [true, true, false, true, false...] to ["01", "02", "04"...]  
    //const type__ = Array.from(type, (_,i) => ("0" + i).substring(("0" + i).length - 2)).slice(1, 10)
    let type_ = type.map( function( value, index, array ) {
      if (value) {
        return ("0" + index).substring(("0" + index).length - 2)
      } else {
        return
      }
    });
    // undefinedを削除して10個までに絞る（FirebaseのIN句は10個までの制限あり）
    type_ = type_.filter(v => v)
    type_ = type_.slice(0, 10)
    //console.log("type:", type)
    //console.log("type_:", type_)
    if (type_.length == 0) {
      // Type条件がない場合は全てのTypeが対象
      if (target == "cond") {
        this.detacher = this.refCollection
        .orderBy('condDate', 'asc').startAt(from).endAt(to)
        //.where("owner", "==", this.$store.state.user.uid)
        .onSnapshot(snapshot => {
          this.$store.state.dmh = snapshot.docs.map(doc => {
            //console.log(doc.id, " => ", doc.data());
            return Object.assign(doc.data(), { id: doc.id, type: this.getDmsubjectName(doc.data().type), condDate: this.dateFormatter(doc.data().condDate) as unknown, nextDate: this.dateFormatter(doc.data().nextDate) as unknown }) as Dmh;
          });
        });
      } else {
        this.detacher = this.refCollection
        .orderBy('nextDate', 'asc').startAt(from).endAt(to)
        //.where("owner", "==", this.$store.state.user.uid)
        .where("last", "==", true)
        .onSnapshot(snapshot => {
          this.$store.state.dmh = snapshot.docs.map(doc => {
            //console.log(doc.id, " => ", doc.data());
            return Object.assign(doc.data(), { id: doc.id, type: this.getDmsubjectName(doc.data().type), condDate: this.dateFormatter(doc.data().condDate) as unknown, nextDate: this.dateFormatter(doc.data().nextDate) as unknown }) as Dmh;
          });
        });
      }
    } else {
      if (target == "cond") {
        this.detacher = this.refCollection
        .orderBy('condDate', 'asc').startAt(from).endAt(to)
        .where("type", "in", type_)
        //.where("owner", "==", this.$store.state.user.uid)
        .onSnapshot(snapshot => {
          this.$store.state.dmh = snapshot.docs.map(doc => {
            //console.log(doc.id, " => ", doc.data());
            return Object.assign(doc.data(), { id: doc.id, type: this.getDmsubjectName(doc.data().type), condDate: this.dateFormatter(doc.data().condDate) as unknown, nextDate: this.dateFormatter(doc.data().nextDate) as unknown }) as Dmh;
          });
        });
      } else {
        this.detacher = this.refCollection
        .orderBy('nextDate', 'asc').startAt(from).endAt(to)
        .where("type", "in", type_).where("last", "==", true)
        //.where("owner", "==", this.$store.state.user.uid)
        .onSnapshot(snapshot => {
          this.$store.state.dmh = snapshot.docs.map(doc => {
            //console.log(doc.id, " => ", doc.data());
            return Object.assign(doc.data(), { id: doc.id, type: this.getDmsubjectName(doc.data().type), condDate: this.dateFormatter(doc.data().condDate) as unknown, nextDate: this.dateFormatter(doc.data().nextDate) as unknown }) as Dmh;
          });
        });
      }
    }
    
    // ウインドウ最下部に移動して検索が実行されたことがわかるようにする
    const element = document.documentElement;
    const bottom = element.scrollHeight - element.clientHeight;
    window.scroll(0, bottom);
  }

  handleBack() {
    this.$router.go(-1);
  }

  getDmsubjectName(id: string) {
    if (!id || !this.dmsubjectList) return;
    const s = this.dmsubjectList as any;
    return s.find((x: any) => x.id === id).name;
  }

  dateFormatter(date: firebase.firestore.Timestamp) {
    try {
      return date.toDate().toLocaleDateString("ja-JP", {year:"numeric", month:"2-digit", day:"2-digit"}) 
    } catch (e) {
      console.log(e)
      return date
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

