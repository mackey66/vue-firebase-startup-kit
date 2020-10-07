<template>
  <div class="m-b-10">
    <span class="icon has-text-info"><i class="fas fa-user"></i></span>
    <span class="h2">オーナー</span>
    <div class="m-b-20"></div>
    <div v-if="editMode">
      <div class="m-b-15">
        <table class="table m-b-10" style="border: 0px">
          <tbody>
            <tr>
              <th>No</th>
              <td>{{ no }}</td>
            </tr>
          </tbody>
        </table>
        <div class="columns m-b-5">
          <div class="column is-grouped is-12-mobile is-8-tablet is-6-desktop is-4-widescreen is-4-fullhd">
            <b-field label="飼主名" :label-position="labelPosition">
              <b-input v-model="nameSei" placeholder="姓" ></b-input> 
              <b-input v-model="nameNa" placeholder="名" ></b-input>
            </b-field>
          </div>
        </div>
        <div class="columns m-b-5">
          <div class="column is-grouped is-12-mobile is-8-tablet is-6-desktop is-4-widescreen is-4-fullhd">
            <b-field label="飼主名カナ" :label-position="labelPosition">
              <b-input v-model="nameSeiKana" placeholder="姓カナ" ></b-input> 
              <b-input v-model="nameNaKana" placeholder="名カナ" ></b-input>
            </b-field>
          </div>
        </div>
      </div>
      <div class="columns m-b-5">    
        <div class="column is-4-mobile is-3-tablet is-2-desktop is-2-widescreen is-2-fullhd">
          <ValidationProvider rules="max:7">
            <div slot-scope="ProviderProps">
              <b-field label="郵便番号" :label-position="labelPosition"
                :type="{
                  'is-danger': ProviderProps.errors[0],
                }"
                :message="{
                  '最大文字数(7)を超えています': ProviderProps.failedRules['max']
                }"
              >
                <b-input v-model="zip" @keyup.native="searchAddress"></b-input>
              </b-field>
            </div>
          </ValidationProvider>
        </div>
      </div>
      <div class="columns m-b-5">
        <div class="column">
          <b-field label="市区町村" :label-position="labelPosition">
            <b-input v-model="address1" name="住所" ></b-input>
          </b-field>
        </div>
        <div class="column">
          <b-field label="番地" :label-position="labelPosition">
            <b-input v-model="address2"></b-input>
          </b-field>
        </div>
        <div class="column">
          <b-field label="マンション" :label-position="labelPosition">
            <b-input v-model="address3"></b-input>
          </b-field>
        </div>
      </div>
      <div class="columns m-b-5">
        <div class="column is-6-mobile is-3-tablet is-3-desktop is-2-widescreen is-2-fullhd">
          <b-field label="電話番号1" :label-position="labelPosition">
            <b-input v-model="phone1"></b-input>
          </b-field>
        </div>
        <div class="column is-6-mobile is-3-tablet is-3-desktop is-2-widescreen is-2-fullhd">
          <b-field label="電話番号2" :label-position="labelPosition">
            <b-input v-model="phone2"></b-input>
          </b-field>
        </div>
        <div class="column is-6-mobile is-3-tablet is-3-desktop is-2-widescreen is-2-fullhd">
          <b-field label="電話番号3" :label-position="labelPosition">
            <b-input v-model="phone3"></b-input>
          </b-field>
        </div>
      </div>
      <div class="columns m-b-5">
        <div class="column is-10-mobile is-8-tablet is-6-desktop is-4-widescreen is-3-fullhd">
          <b-field label="職業" :label-position="labelPosition">
            <b-input v-model="occupation"></b-input>
          </b-field>
        </div> 
      </div>

      <div class="level is-mobile">
        <div class="level-left">
          <b-button
            @click="handleSave"
            :disabled="!isChanged"
            type="is-primary"
            icon-left="fas fa-save"
          >Save</b-button>
          <b-button
            @click="handleCancel"
            icon-left="fas fa-window-close"
            style="margin-left:1rem"
          >Cancel</b-button>
        </div>
        <div class="level-right">
          <b-button @click="handleDelete" type="is-danger" icon-left="fas fa-trash">Delete</b-button>
        </div>
      </div>
    </div>
    <h2 v-else>
      <!--<div class="columns m-b-0">
        <div class="column is-2">
          <b-field label="No" />
          <input class="input" readonly>
        </div>
        <div class="column is-2">
          <b-field label="飼主名" />
          <input class="input" readonly>
        </div>
      </div>-->
      <div class="columns is-mobile m-b-0">
        <div class="column is-3-mobile is-3-tablet is-3-desktop is-2-widescreen is-1-fullhd">
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label has-text-left">No:</label>
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
      </div>
      <div class="columns m-b-0">
        <div class="column is-12-mobile is-10-tablet is-8-desktop is-6-widescreen is-4-fullhd">
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label has-text-left" style="min-width: 70px">住所:</label>
            </div>
            <input class="input is-static_" v-bind:value="address" readonly>
          </div>
        </div>
      </div>
      <div class="columns m-b-0 is-mobile">
        <div class="column is-4-mobile is-4-tablet is-4-desktop is-4-widescreen is-3-fullhd">
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label has-text-left" style="min-width: 80px">電話番号1:</label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control">
                  <input class="input is-static_" v-bind:value="phone1" readonly>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-4-mobile is-4-tablet is-4-desktop is-4-widescreen is-3-fullhd">
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label has-text-left" style="min-width: 80px">電話番号2:</label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control">
                  <input class="input is-static_" v-bind:value="phone2" readonly>
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="column is-4-mobile is-4-tablet is-4-desktop is-4-widescreen is-3-fullhd">
          <div class="field is-horizontal">
            <div class="field-label is-normal">
              <label class="label has-text-left" style="min-width: 80px">電話番号3:</label>
            </div>
            <div class="field-body">
              <div class="field">
                <p class="control">
                  <input class="input is-static_" v-bind:value="phone3" readonly>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!--<table class="table is-bordered">
        <tbody>
          <tr>
            <th>No</th>
            <td>{{ no }}</td>
            <th>飼主名</th>
            <td>{{ name }}</td>
          </tr>
          <tr>
            <th>住所</th>
            <td colspan="3">{{ address }}</td>
          </tr>
          <tr>
            <th>電話番号</th>
            <td>{{ phone1 }}</td>
            <td>{{ phone2 }}</td>
            <td>{{ phone3 }}</td>
          </tr>
        </tbody>
      </table>-->
      <span v-if="isOwner">
        <b-button class="button is-light" icon-left="fas fa-edit" @click="handleEdit">Edit</b-button>
      </span>
    </h2>
    
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import { Component, Prop } from "vue-property-decorator"
import { BaseDocument } from "../scripts/datatypes"
import { OwnerList, Pets } from "../scripts/datatypes"
import KenAll from 'ken-all';
import { ValidationProvider, ValidationObserver } from 'vee-validate'


@Component({
  components: {
    ValidationProvider,
    ValidationObserver
  }
})

export default class EditableTitle extends Vue {
  title = "abc"
  address = ""
  no = 0
  nameSei = ""
  nameNa = ""
  nameSeiKana = ""
  nameNaKana = ""
  name = ""
  zip = ""
  address1 = ""
  address2 = ""
  address3 = ""
  phone1 = ""
  phone2 = ""
  phone3= ""
  occupation = ""
  editMode = false
  @Prop() document!: OwnerList
  @Prop() petItems!: Array<Pets>
  @Prop() refOwner!: firebase.firestore.DocumentReference
  mounted() {
    //this.title = this.document.title;
    this.title = this.document.no + ": " + this.document.nameSei + this.document.nameNa;
    this.address = this.document.address1 + this.document.address2 + this.document.address3;
    this.no = this.document.no;
    this.nameSei = this.document.nameSei;
    this.nameNa = this.document.nameNa;
    this.nameSeiKana = this.document.nameSeiKana;
    this.nameNa = this.document.nameNaKana;
    this.name = this.document.nameSei + " " + this.document.nameNa;
    this.zip = this.document.zip;
    this.address1 = this.document.address1;
    this.address2 = this.document.address2;
    this.address3 = this.document.address3;
    this.phone1 = this.document.phone[0];
    this.phone2 = this.document.phone[1];
    this.phone3 = this.document.phone[2];
    this.occupation = this.document.occupation;
    
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
    this.editMode = true;
    //this.$emit("petCreate", false);
  }
  handleSave() {
    this.refOwner.update({
      //title: this.title
      nameSei: this.nameSei,
      nameNa: this.nameNa,
      zip: this.zip,
      address1: this.address1,
      address2: this.address2,
      address3: this.address3,
      phone: [this.phone1, this.phone2, this.phone3],
    });
    this.title = this.document.no + ": " + this.nameSei + this.nameNa;
    this.address = this.zip + " " + this.address1 + this.address2 + this.address3;
    this.document.nameSei = this.nameSei;
    this.document.nameNa = this.nameNa;
    this.document.nameSeiKana = this.nameSeiKana;
    this.document.nameNaKana = this.nameNaKana;
    this.document.zip = this.zip;
    this.document.address1 = this.address1;
    this.document.address2 = this.address2;
    this.document.address3 = this.address3;
    this.document.phone = [this.phone1, this.phone2, this.phone3];
    this.editMode = false;
    // SubCollection情報の書き換え
    this.petItems.forEach(doc => {
      // pet
      let spname = doc.speciesName
      if (!spname) spname = ""
      let brname = doc.breedName
      let brname_: string[] = ["","",""]
      if (!brname) {
        brname = ""
      } else {
        brname = brname.replace(/・/g, ' ')
        brname_ = brname.split(' ')
        //if (!brname_[0]) brname_[0] = ""
        if (!brname_[1]) brname_[1] = ""
        if (!brname_[2]) brname_[2] = ""
      }
      console.log("spname =", spname)
      this.refOwner.collection("pets").doc(doc.id).update({
        ownerNo: this.no,
        ownerId: this.$route.params.listId,
        ownerFullname: this.nameSei + " " + this.nameNa,
        ownerNameSei: this.nameSei,
        ownerNameNa: this.nameNa,
        ownerNameSeiKana: this.nameSeiKana,
        ownerNameNaKana: this.nameNaKana,
        keywords: [String(this.no), this.nameSei, this.nameNa, doc.name, spname, brname_[0], brname_[1], brname_[2]]
      });
      // dmh
      this.refOwner.collection("pets").doc(doc.id).collection("dmh").get().
        then(sub => {
          if (sub.docs.length > 0) {
            sub.forEach(subdoc => {
              this.refOwner.collection("pets").doc(doc.id).collection("dmh").doc(subdoc.id).update({
                no: this.no,
                ownerFullname: this.nameSei + " " + this.nameNa,
                zip: this.zip,
                address1: this.address1 + this.address2,
                address2: this.address3,
                phone: this.document.phone 
              });
            })
          }
        });          
    })
  }
  handleCancel() {
    //this.title = this.document.title;
    this.editMode = false;
    //this.$emit("petCreate", true);
  }
  async handleDelete() {
    console.log("handleDelete");
    await this.refOwner.delete();
    this.$emit("deleted");
    this.$router.push("/iwan/");
  }

  data() {
    return {
      labelPosition: 'on-border'
    }
  }

  searchAddress() {
    if (this.zip.length === 7) {
      KenAll(this.zip).then(res => {
        if (res.length === 0) {
          this.address1 = '該当する住所はありません';
        } else {
          this.address1 = res[0].join('');
        }
      });
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

.table {
  border: 1px solid #aaa;
  border-collapse: separate;
  border-spacing: 0;
  border-radius: 6px;
  overflow: hidden;
}
.table th {  
  border-right: none;
}
.table td {  
  border-left: none;
  min-width: 120px;
}
</style>