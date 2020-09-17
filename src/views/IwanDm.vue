<template>
  <section class="section">
    <div class="container is-desktop">
      <div class="box_">
        <span class="icon has-text-info title_screen"><i class="fas fa-envelope"></i></span>
        <span class="h2 title_screen">DM管理</span>
        <div class="m-b-20 title_screen"></div>
        <dm-search-view :refCollection="refCollection" @created="handleCreated" />
        <hr />
        <list-view-search :refCollection="refCollection" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { db } from "@/scripts/firebase";
import DmSearchView from "@/components/DmSearchView.vue";
import ListViewSearch from "@/components/ListViewIwanDmh.vue";

@Component({
  components: {
    DmSearchView,
    ListViewSearch
  }
})
export default class IwanDm extends Vue {
  refCollection = db.collectionGroup(`dmh`);

  handleCreated(id: string) {
    this.$router.push(`/dmh/${id}`);
  }

  //get refDocument(): firebase.firestore.DocumentReference {
  //  return db.doc(`dmsubject/${this.$route.params.listId}`);
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