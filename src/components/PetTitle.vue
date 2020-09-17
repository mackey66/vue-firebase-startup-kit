<template>
  <div class="m-b-10">  
    <div class="columns is-mobile m-b-0">
      <div class="column is-2-mobile is-2-tablet is-2-desktop is-2-widescreen is-1-fullhd">
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label has-text-left" >PetNo:</label>
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
      <div class="column is-3-mobile is-3-tablet is-3-desktop is-2-widescreen is-2-fullhd">
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label has-text-left" >PetID:</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control">
                <input class="input is-static_" v-bind:value="petId" readonly>
              </p>
            </div>
          </div>
        </div>
      </div>
      <div class="column is-7-mobile is-6-tablet is-5-desktop is-4-widescreen is-3-fullhd">
        <div class="field is-horizontal">
          <div class="field-label is-normal">
            <label class="label has-text-left">名前:</label>
          </div>
          <div class="field-body">
            <div class="field">
              <p class="control">
                <input class="input is-static_" v-bind:value="name" readonly>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { BaseDocument } from "../scripts/datatypes";
import { Pets } from "../scripts/datatypes";

@Component
export default class PetTitle extends Vue {
  no = ""
  petId = ""
  name = "";
  @Prop() document!: Pets;
  @Prop() refDocument!: firebase.firestore.DocumentReference;
  mounted() {
    if (this.document.no) this.no = this.document.no.toString()
    this.petId = this.document.petId
    this.name = this.document.name
  }
  get isOwner() {
    return (
      this.$store.state.user &&
      this.document.owner === this.$store.state.user.uid
    );
  }
  get isChanged() {
    return 1
  }
  handleEdit() {
    this.$emit('gotoOwner', true);
  }
  handleSave() {
    //
  }
  handleCancel() {
    //
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
