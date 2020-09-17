<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-5">
        Hello
        {{userName}}
      </h1>
      <div v-if="hasUser">
        <p>Welcome to the play ground!</p>
        <ul>
          <li>
            <router-link to="/chat">Chat</router-link>
          </li>
          <li>
            <router-link to="/blog">Blog</router-link>
          </li>
          <li>
            <router-link to="/todo">Todo</router-link>
          </li>
          <li>
            <!--<router-link to="/master">-</router-link>-->
          </li>
        </ul>
        <div class="tile">
          <div class="tile is-parent is-vertical">
            <div class="buttons">
              <b-button type="is-primary" icon-left="fas fa-address-card" outlined expanded @click="goProfileEntry">プロフィール登録</b-button>
              <b-button type="is-primary" icon-left="fas fa-search" outlined expanded @click="goProfileSearch">プロフィール検索</b-button>
              <b-button type="is-primary" icon-left="fas fa-envelope" outlined expanded @click="goDmSearch">DM管理</b-button>
              <b-button type="is-primary" icon-left="fas fa-credit-card" outlined expanded @click="goAccounth">会計履歴</b-button>
            </div>
          </div>
          <div class="tile is-parent is-vertical">
            <div class="buttons">
              <b-button type="is-primary" icon-left="fas fa-dog" outlined expanded >Dummy</b-button>
              <b-button type="is-primary" icon-left="fas fa-image" outlined expanded >Dummy</b-button>
              <b-button type="is-primary" icon-left="fas fa-syringe" outlined expanded >Dummy</b-button>
              <b-button type="is-primary" icon-left="fas fa-chart-bar" outlined expanded >Dummy</b-button>
            </div>
          </div>
          <div class="tile is-parent is-vertical">
            <div class="buttons">
              <b-button type="is-primary" icon-left="fas fa-map-marker-alt" outlined expanded >Dummy</b-button>
              <b-button type="is-primary" icon-left="fas fa-pills" outlined expanded >Dummy</b-button>
              <b-button type="is-primary" icon-left="fas fa-user" outlined expanded >Dummy</b-button>
              <b-button type="is-primary" icon-left="fas fa-cog" outlined expanded >Dummy</b-button>
            </div>
          </div>
        </div>
        <div class="subtitle is-7">
          <b-checkbox v-model="$store.state.masterNocache" @input="$store.commit('setMasterNocache')">
            マスタのキャッシュを使用しない
          </b-checkbox>
        </div>
      </div>
      <div v-else>
        <p>Please Sign-in to see various features!</p>
      </div>
    </div>
    <source-link path="views/Home.vue" />
  </section>
</template>

<script lang="ts">
import Vue from "vue";
import { Component } from "vue-property-decorator";
import SourceLink from "@/components/SourceLink.vue";

@Component({
  components: {
    SourceLink
  }
})
export default class Home extends Vue {
  get userName(): string {
    if (this.$store.state.user) {
      return this.$store.state.user.displayName;
    }
    return "";
  }
  get hasUser(): boolean {
    return !!this.$store.state.user;
  }

  goProfileEntry() {
    this.$router.push(`/profile`);
  }
  goProfileSearch() {
    this.$router.push(`/search`);
  }
  goDmSearch() {
    this.$router.push(`/dm`);
  }
  goAccounth() {
    this.$router.push(`/account`);
  }
}
</script>