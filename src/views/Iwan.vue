<template>
  <section class="section">
    <div class="container is-desktop">
      <div class="box_">
        <span class="icon has-text-info"><i class="fas fa-user-plus"></i></span>
        <span class="h2">プロフィール登録</span>
        <div class="m-b-20"></div>
        <create-new-iwan :refCollection="refCollection" @created="handleCreated" />
        <hr />
        <list-view-search :refCollection="refCollection" path="iwan" />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import { db } from "@/scripts/firebase";
import CreateNewIwan from "@/components/CreateNewIwan.vue";
//import ListView from "@/components/ListViewIwan.vue";
import ListViewSearch from "@/components/ListViewIwanOwner.vue";

@Component({
  components: {
    CreateNewIwan,
    ListViewSearch
  }
})
export default class Iwan extends Vue {
  refCollection = db.collection(`owners`);

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