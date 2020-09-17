<template>
  <div class="m-b-10">  
    <div class="columns is-mobile m-b-0">
        <div class="column is-3-mobile is-3-tablet is-3-desktop is-2-widescreen is-1-fullhd">
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label has-text-left" >No:</label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control">
                  <input class="input is-static_" v-bind:value="no" readonly>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-6-mobile is-6-tablet is-5-desktop is-5-widescreen is-4-fullhd">
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label has-text-left" style="min-width: 60px">飼主名:</label>
            </div>
            <input class="input is-static_" v-bind:value="name" readonly>
          </div>
        </div>
        <!--<div class="column">
          <b-button class="button is-light" icon-left="fas fa-edit" @click="handleEdit">Edit</b-button>
        </div>-->
      </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { BaseDocument } from "../scripts/datatypes";
import { OwnerList } from "../scripts/datatypes";

@Component
export default class OwnerTitle extends Vue {
  title = "abc";
  address = "";
  no = 0;
  nameSei = "";
  nameNa = "";
  name = "";
  zip = "";
  address1 = "";
  address2 = "";
  address3 = "";
  phone1 = "";
  phone2 = "";
  phone3 = "";
  editMode = false;
  @Prop() document!: OwnerList;
  @Prop() refDocument!: firebase.firestore.DocumentReference;
  mounted() {
    //this.title = this.document.title;
    this.title = this.document.no + ": " + this.document.nameSei + this.document.nameNa;
    this.address = this.document.address1 + this.document.address2 + this.document.address3;
    this.no = this.document.no;
    this.nameSei = this.document.nameSei;
    this.nameNa = this.document.nameNa;
    this.name = this.document.nameSei + " " + this.document.nameNa;
    this.zip = this.document.zip;
    this.address1 = this.document.address1;
    this.address2 = this.document.address2;
    this.address3 = this.document.address3;
    this.phone1 = this.document.phone[0];
    
  }
  get isOwner() {
    return (
      this.$store.state.user &&
      this.document.owner === this.$store.state.user.uid
    );
  }
  get isChanged() {
    return this.title !== this.document.title;
  }
  handleEdit() {
    this.$emit('gotoOwner', true);
  }
  handleSave() {
    this.refDocument.update({
      //title: this.title
      nameSei: this.nameSei,
      nameNa: this.nameNa,
      zip: this.zip,
      address1: this.address1,
      address2: this.address2,
      address3: this.address3,
      phone: [this.phone1, this.phone2, this.phone3],
    });
    //this.document.title = this.title;
    this.title = this.document.no + ": " + this.nameSei + this.nameNa;
    this.address = this.zip + " " + this.address1 + this.address2 + this.address3;
    this.document.nameSei = this.nameSei;
    this.document.nameNa = this.nameNa;
    this.document.zip = this.zip;
    this.document.address1 = this.address1;
    this.document.address2 = this.address2;
    this.document.address3 = this.address3;
    this.document.phone = [this.phone1, this.phone2, this.phone3];
    this.editMode = false;
  }
  handleCancel() {
    //this.title = this.document.title;
    this.editMode = false;
    //this.$emit("petCreate", true);
  }
  async handleDelete() {
    console.log("handleDelete");
    await this.refDocument.delete();
    this.$emit("deleted");
  }

  data() {
    return {
      labelPosition: 'on-border'
    }
  }

  
}
</script>
