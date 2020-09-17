<template>
  <section class="section">
    <div class="container is-mobile">
      <div class="box_">
        <span class="icon has-text-info"><i class="fas fa-search"></i></span>
        <span class="h2">プロフィール検索</span>
        <div class="m-b-20"></div>
        <profile-search-view :refCollection="refCollection" @created="handleCreated" />
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
import ProfileSearchView from "@/components/ProfileSearchView.vue";
import ListViewSearch from "@/components/ListViewIwanSearch.vue";

@Component({
  components: {
    ProfileSearchView,
    ListViewSearch
  }
})
export default class Iwan extends Vue {
  refCollection = db.collectionGroup(`pets`);

  handleCreated(id: string) {
    this.$router.push(`/iwan/${id}`);
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