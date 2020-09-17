<template>
  <ul class="listview">
    <!--<li v-for="article in articles" :key="article.id">
      <router-link :to="`/owner/${article.id}`">{{article.no + ": " + article.nameSei + " " + article.nameNa + " " + article.address1 + article.address2 + article.address3 + " " + article.phone[0]}}</router-link>
    </li>-->
    <b-table :data="articles" :mobile-cards="true" :narrowed="true">
      <template slot-scope="p">
        <b-table-column field="no" label="No" width="90">
          <router-link :to="`/owner/${p.row.id}`">
            {{ p.row.no }}
          </router-link>
        </b-table-column>
        <b-table-column field="ownerName" label="飼主名" style="min-width: 100px;">{{ p.row.nameSei }} {{ p.row.nameNa }}</b-table-column>
        <b-table-column field="address" label="住所" >{{ p.row.address1 }}{{ p.row.address2 }}{{ p.row.address3 }}</b-table-column>
        <b-table-column field="phone" label="電話番号" >{{ p.row.phone[0] }}</b-table-column>
      </template>
    </b-table>
  </ul>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { BaseDocument } from "../scripts/datatypes";
import { eventBus } from "../main"; // 子 → 子 受け渡し用

@Component
export default class ListViewIwanOwner extends Vue {
  @Prop() readonly refCollection!: firebase.firestore.CollectionReference;
  @Prop() readonly path!: string;
  detacher?: firebase.Unsubscribe;
  articles: Array<BaseDocument> = [];
  //@Prop() propsNo!: string;

  created() {
    eventBus.$on("noWasChanged", this.noList);
    eventBus.$on("nameWasChanged", this.nameList);
    eventBus.$on("addressWasChanged", this.addressList);
    eventBus.$on("phoneWasChanged", this.phoneList);
    /*
    this.detacher = this.refCollection
      .orderBy("timeCreated", "desc")
      .where("owner", "==", this.$store.state.user.uid)
      .where("no", "==", this.no)
      .onSnapshot(snapshot => {
        this.articles = snapshot.docs.map(doc => {
          return Object.assign(doc.data(), { id: doc.id }) as BaseDocument;
        });
      });
    */
  }
  destroyed() {
    this.detacher && this.detacher();
  }
  noList(no: string) {
    //console.log('hoge...:', no);
    //this.no = no;
    this.detacher = this.refCollection
      .orderBy("timeCreated", "desc")
      .where("owner", "==", this.$store.state.user.uid)
      .where("no", "==", Number(no))
      .onSnapshot(snapshot => {
        this.articles = snapshot.docs.map(doc => {
          return Object.assign(doc.data(), { id: doc.id }) as BaseDocument;
        });
      });
  }
  nameList(nameSei: string, nameNa: string) {
    this.detacher = this.refCollection
      .orderBy("timeCreated", "desc")
      .where("owner", "==", this.$store.state.user.uid)
      .where("nameSei", "==", nameSei)
      .where("nameNa", "==", nameNa)
      .onSnapshot(snapshot => {
        this.articles = snapshot.docs.map(doc => {
          return Object.assign(doc.data(), { id: doc.id }) as BaseDocument;
        });
      });
  }
  addressList(address1: string, address2: string) {
    this.detacher = this.refCollection
      .orderBy("timeCreated", "desc")
      .where("owner", "==", this.$store.state.user.uid)
      .where("address1", "==", address1)
      .where("address2", "==", address2)
      .onSnapshot(snapshot => {
        this.articles = snapshot.docs.map(doc => {
          return Object.assign(doc.data(), { id: doc.id }) as BaseDocument;
        });
      });
  }
  phoneList(phone: string) {
    this.detacher = this.refCollection
      .orderBy("timeCreated", "desc")
      .where("owner", "==", this.$store.state.user.uid)
      .where("phone", "==", phone)
      .onSnapshot(snapshot => {
        this.articles = snapshot.docs.map(doc => {
          return Object.assign(doc.data(), { id: doc.id }) as BaseDocument;
        });
      });
  }
}
</script>

<style scoped>
.listview {
  margin-top: 8px;
}
</style>

