<template>
  <section class="section">
    <div class="container is-desktop" v-if="ownerlist">
      <div class="box_">
        <span class="icon has-text-info"><i class="fas fa-dog"></i></span>
        <span class="h2">プロフィール</span>
        <div class="m-b-20"></div>
        <owner-title :document="ownerlist" :refDocument="refOwner" @deleted="handleListDelete" @petCreate="createPet = $event" @gotoOwner="gotoOwner"/>
        
        <span v-if="petlist"> 
          <div v-if="editMode">
            <div v-if="hasUser" class="m-b-5">
              <ValidationObserver ref="obs" v-slot="ObserverProps">
                <div class="columns is-mobile m-b-5">
                  <div class="column is-2-mobile is-2-tablet is-1-desktop is-1-widescreen is-1-fullhd">
                    <ValidationProvider rules="required|max:3|numeric">
                      <div slot-scope="ProviderProps">
                        <b-field label="PetNo" :label-position="labelPosition"
                          :type="{
                            'is-danger': ProviderProps.errors[0] || errorNo,
                          }"
                          :message="{
                            '必須項目です': ProviderProps.failedRules['required'],
                            '最大文字数(3)を超えています': ProviderProps.failedRules['max'],
                            '数字（整数）以外は使用できません': ProviderProps.failedRules['numeric'],
                            '同じNoがあります': errorNo,
                          }"
                        >
                          <b-input v-model="no" @keyup.native="searchNo(no)" class="m-b-4" ></b-input>
                        </b-field>
                      </div>
                    </ValidationProvider>
                  </div>
                  <div class="column is-4-mobile is-2-tablet is-2-desktop is-2-widescreen is-2-fullhd">
                    <b-field label="PetID" :label-position="labelPosition" type="is-light">
                      <b-input v-model="petId"></b-input>
                    </b-field>
                  </div>
                  <div class="column is-6-mobile is-5-tablet is-4-desktop is-3-widescreen is-3-fullhd">
                    <ValidationProvider rules="required">
                      <div slot-scope="ProviderProps">
                        <b-field label="名前（ペット名）" :label-position="labelPosition" 
                          :type="{
                            'is-danger': ProviderProps.errors[0],
                          }"
                          :message="{
                            '必須項目です': ProviderProps.failedRules['required']
                          }"
                        >              
                          <b-input v-model="name" style="max-width: 300px;"></b-input> 
                        </b-field>
                      </div>
                    </ValidationProvider>
                  </div>
                </div>
                <div class="columns is-mobile">
                  <div class="column is-3-mobile is-3-tablet is-3-desktop is-2-widescreen is-2-fullhd">
                    <ValidationProvider rules="required">
                      <b-field label="動物種" :label-position="labelPosition">
                        <b-select v-model="speciesSelected" @input="changedSpecies">
                          <option v-for="value in species" :key="value.id" v-bind:value="value.id">
                            {{ value.name }}
                          </option>
                        </b-select>
                      </b-field>
                    </ValidationProvider>
                  </div>
                  <div class="column is-9-mobile is-9-tablet is-9-desktop is-10-widescreen is-10-fullhd">
                    <b-field label="品種" :label-position="labelPosition" >
                      <ValidationProvider>
                        <b-input :value="breedName" @change.native="breedName = $event.target.value" style="min-width: 270px;"></b-input>
                      </ValidationProvider>
                      <ValidationProvider>
                        <b-select v-model="breedSelected" style="width: 48px;" @change.native="breedName = getBreedName($event.target.value)">
                          <option v-for="value in breedsExtracted" :key="value.id" v-bind:value="value.id">
                            {{ value.name }}
                          </option>                 
                        </b-select>
                      </ValidationProvider>
                    </b-field>
                  </div>
                </div>
                <div class="columns is-mobile m-b-5">
                  <div class="column is-3-mobile is-3-tablet is-3-desktop is-2-widescreen is-2-fullhd">
                    <ValidationProvider rules="required">
                      <b-field label="性別" :label-position="labelPosition">
                        <b-select v-model="genderSelected">
                          <option v-for="value in gender" :key="value.id" v-bind:value="value.id">
                            {{ value.name }}
                          </option>                 
                        </b-select>
                      </b-field>
                    </ValidationProvider>
                  </div>
                  <div class="column is-4-mobile is-3-tablet is-3-desktop is-2-widescreen is-2-fullhd">
                    <ValidationProvider rules="required">
                      <b-field label="去勢/避妊" :label-position="labelPosition">
                        <b-select v-model="neuteredSelected">
                          <option v-for="value in neutered" :key="value.id" v-bind:value="value.id">
                            {{ value.name }}
                          </option>                 
                        </b-select>
                      </b-field>
                    </ValidationProvider>
                  </div>
                  <div class="column is-5-mobile is-4-tablet is-3-desktop is-2-widescreen is-2-fullhd">
                    <b-field label="去勢/避妊備考" :label-position="labelPosition">
                      <b-input v-model="neuteredRemarks" style="max-width: 300px;"></b-input>
                    </b-field>
                  </div>
                </div>     
                <div class="columns is-mobile m-b-5">
                  <div class="column is-5-mobile is-3-tablet is-3-desktop is-2-widescreen is-2-fullhd">
                    <ValidationProvider rules="required">
                      <b-field label="生年月日" :label-position="labelPosition">
                        <b-datepicker
                          v-model="birth" 
                          :date-formatter="(date) =>  moment(date).locale(lang).format('YYYY-MM-DD')"
                          :show-week-number="false"
                          placeholder="Click to select..."
                          icon="calendar-alt"
                          trap-focus
                          style="max-width: 200px;">
                          <button class="button is-primary"
                            @click="birth = new Date()">
                            <b-icon icon="calendar-alt"></b-icon>
                            <span>Today</span>
                          </button>
                          <button class="button is-danger m-l-10"
                            @click="birth = null">
                            <b-icon icon="times"></b-icon>
                            <span>Clear</span>
                          </button>
                        </b-datepicker>
                      </b-field>
                    </ValidationProvider>
                  </div>
                  <div class="column is-4-mobile is-2-tablet is-2-desktop is-2-widescreen is-2-fullhd">
                    <div>歳ヶ月</div>
                  </div>
                  <div class="column is-3-mobile is-3-tablet is-3-desktop is-2-widescreen is-2-fullhd">
                    <ValidationProvider>
                      <b-field label="Since" :label-position="labelPosition">
                        <b-datepicker
                          v-model="since" 
                          :date-formatter="(date) =>  moment(date).locale(lang).format('YYYY-MM-DD')"
                          :show-week-number="false"
                          placeholder="Click to select..."
                          icon="calendar-alt"
                          trap-focus
                          style="max-width: 200px;">
                          <button class="button is-primary"
                            @click="since = new Date()">
                            <b-icon icon="calendar-alt"></b-icon>
                            <span>Today</span>
                          </button>
                          <button class="button is-danger m-l-10"
                            @click="since = null">
                            <b-icon icon="times"></b-icon>
                            <span>Clear</span>
                          </button>
                        </b-datepicker>
                      </b-field>
                    </ValidationProvider>
                  </div>    
                </div>
                <div class="columns is-mobile m-b-5">
                  <div class="column is-3-mobile is-2-tablet is-2-desktop is-1-widescreen is-1-fullhd">
                    <ValidationProvider :rules="{regex: /^\d*\.?\d*$/}">
                      <div slot-scope="ProviderProps">
                        <b-field label="体重(kg)" :label-position="labelPosition"
                          :type="{
                            'is-danger': ProviderProps.errors[0],
                          }"
                          :message="{
                            '数字以外は使用できません': ProviderProps.failedRules['regex'],
                          }"
                        >
                          <b-input v-model="bw" style="max-width: 100px;"></b-input>
                        </b-field>
                      </div>
                    </ValidationProvider>
                  </div>
                  <div class="column is-4-mobile is-3-tablet is-3-desktop is-2-widescreen is-2-fullhd">
                    <b-field label="体格" :label-position="labelPosition">
                      <b-select v-model="size">
                        <option v-for="value in sizeList" :key="value.id" v-bind:value="value.name">
                          {{ value.name }}
                        </option>                 
                      </b-select>
                    </b-field>
                  </div>
                  <div class="column is-5-mobile is-5-tablet is-4-desktop is-3-widescreen is-3-fullhd">
                    <b-field label="毛色" :label-position="labelPosition">
                      <ValidationProvider>
                        <b-input v-model="color" style="max-width: 300px;"></b-input>
                      </ValidationProvider>
                      <ValidationProvider>
                        <b-select v-model="color" style="width: 48px;">
                          <option v-for="value in colorList" :key="value.id" v-bind:value="value.name">
                            {{ value.name }}
                          </option>                 
                        </b-select>
                      </ValidationProvider>
                    </b-field>
                  </div>
                </div>
                <div class="columns is-mobile">
                  <div class="column is-4-mobile is-3-tablet is-3-desktop is-2-widescreen is-2-fullhd">
                    <b-field label="性格" :label-position="labelPosition">
                      <ValidationProvider>
                        <b-input v-model="character" style="max-width: 300px;"></b-input>
                      </ValidationProvider>
                      <ValidationProvider>
                        <b-select v-model="character" style="width: 48px;">
                          <option v-for="value in characterList" :key="value.id" v-bind:value="value.name">
                            {{ value.name }}
                          </option>                 
                        </b-select>
                      </ValidationProvider>
                    </b-field>
                  </div>
                  <div class="column is-4-mobile is-3-tablet is-2-desktop is-2-widescreen is-2-fullhd">
                    <ValidationProvider>
                      <b-field label="環境" :label-position="labelPosition">
                        <b-select v-model="environment" expanded>
                          <option v-for="value in environmentList" :key="value.id" v-bind:value="value.id">
                            {{ value.name }}
                          </option>                 
                        </b-select>
                      </b-field>
                    </ValidationProvider>
                  </div>
                  <div class="column is-4-mobile is-4-tablet is-4-desktop is-3-widescreen is-2-fullhd">
                    <ValidationProvider>
                      <b-field label="同居" :label-position="labelPosition">
                        <b-input v-model="cohabitation" ></b-input>
                      </b-field>
                    </ValidationProvider>
                  </div>
                </div>  
                <div class="columns is-mobile m-b-5">
                  <div class="column is-3-mobile is-3-tablet is-3-desktop is-2-widescreen is-2-fullhd">
                    <ValidationProvider rules="required">
                      <div slot-scope="ProviderProps">
                        <b-field label="生存" :label-position="labelPosition"
                          :type="{
                              'is-danger': ProviderProps.errors[0],
                            }"
                            :message="{
                              '必須項目です': ProviderProps.failedRules['required']
                            }"
                        >
                          <b-select v-model="dead">
                            <option v-for="value in deadList" :key="value.id" v-bind:value="value.id">
                              {{ value.name }}
                            </option>                 
                          </b-select>
                        </b-field>
                      </div>
                    </ValidationProvider>
                  </div>
                  <div class="column is-9-mobile is-7-tablet is-6-desktop is-4-widescreen is-3-fullhd">
                    <ValidationProvider>
                        <b-field label="生存備考" :label-position="labelPosition">
                          <b-input v-model="deadRemarks" ></b-input>
                        </b-field>
                    </ValidationProvider>
                  </div>
                </div>
                <div class="level is-mobile">
                  <div class="level-left">
                    <b-button
                      @click="handleSave"
                      :disabled="ObserverProps.invalid || ObserverProps.untouched"
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
              </ValidationObserver>
            </div>
          </div>
          <h2 v-else>
            <!--<table class="table is-bordered">
              <tbody>
                <tr>
                  <th>Pet No</th>
                  <td>{{ petlist.no }}</td>
                  <th>Pet ID</th>
                  <td>{{ petlist.petId }}</td>
                  <th>名前</th>
                  <td>{{ petlist.name }}</td>
                </tr>
                <tr>
                  <th>種</th>
                  <td>{{ petlist.speciesSelected }}</td>
                  <th>品種</th>
                  <td colspan="3">{{ petlist.breedName }}</td>               
                </tr>
                <tr>
                  <th>性別</th>
                  <td>{{ petlist.genderSelected }}</td>
                  <th>去勢/避妊</th>
                  <td>{{ petlist.neuteredSelected }}</td>
                  <th>生年月日</th>
                  <td>{{ birth_ }}</td>
                </tr>
              </tbody>
            </table>-->
            <div class="columns is-mobile m-b-0">
              <div class="column is-2-mobile is-2-tablet is-2-desktop is-2-widescreen is-1-fullhd">
                <div class="field is-horizontal">
                  <div class="field-label is-normal">
                    <label class="label has-text-left" >PetNo:</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <p class="control">
                        <input class="input is-static_" v-bind:value="petlist.no" readonly>
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
                        <input class="input is-static_" v-bind:value="petlist.petId" readonly>
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
                        <input class="input is-static_" v-bind:value="petlist.name" readonly>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="columns is-mobile m-b-0">
              <div class="column is-3-mobile is-3-tablet is-3-desktop is-2-widescreen is-1-fullhd">
                <div class="field is-horizontal">
                  <div class="field-label is-normal">
                    <label class="label has-text-left" style="min-width: 70px">種:</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <p class="control">
                        <input class="input is-static_" v-bind:value="getSpeciesName(petlist.species)" readonly>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="column is-8-mobile is-8-tablet is-7-desktop is-6-widescreen is-5-fullhd">
                <div class="field is-horizontal">
                  <div class="field-label is-normal">
                    <label class="label has-text-left" style="min-width: 80px">品種:</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <p class="control">
                        <input class="input is-static_" v-bind:value="petlist.breedName" readonly>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="columns is-mobile m-b-0">
              <div class="column is-3-mobile is-3-tablet is-3-desktop is-2-widescreen is-1-fullhd">
                <div class="field is-horizontal">
                  <div class="field-label is-normal">
                    <label class="label has-text-left" style="min-width: 70px">性別:</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <p class="control">
                        <input class="input is-static_" v-bind:value="getGenderName(petlist.gender)" readonly>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="column is-3-mobile is-3-tablet is-3-desktop is-2-widescreen is-1-fullhd">
                <div class="field is-horizontal">
                  <div class="field-label is-normal">
                    <label class="label has-text-left" style="min-width: 80px">去勢/避妊:</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <p class="control">
                        <input class="input is-static_" v-bind:value="getNeuteredName(petlist.neutered)" readonly>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="column is-5-mobile is-4-tablet is-4-desktop is-3-widescreen is-2-fullhd">
                <div class="field is-horizontal">
                  <div class="field-label is-normal">
                    <label class="label has-text-left" style="min-width: 80px">生年月日:</label>
                  </div>
                  <div class="field-body">
                    <div class="field">
                      <p class="control">
                        <input class="input is-static_" v-bind:value="birth_" readonly>
                      </p>
                    </div>
                  </div>
                </div>
              </div> 
            </div>
            <span v-if="isOwner">
              <b-button class="button is-light" icon-left="fas fa-backward" @click="handleBack" style="margin-right:1rem">戻る</b-button>
              <b-button class="button is-light" icon-left="fas fa-edit" @click="handleEdit">編集</b-button>
            </span>
            <hr>
            <div class="tabs is-boxed">
              <ul>
                <li v-on:click="changeTab('1')" v-bind:class="{'is-active': isActive === '1' || isActiveDefault}">
                  <a>
                    <span class="icon is-small"><i class="fas fa-syringe" aria-hidden="true"></i></span>
                    <span>予防</span>
                  </a>
                </li>
                <li v-on:click="changeTab('2')" v-bind:class="{'is-active': isActive === '2'}">
                  <a>
                    <span class="icon is-small"><i class="fas fa-file-alt" aria-hidden="true"></i></span>
                    <span>カルテ</span>
                  </a>
                </li>
                <li v-on:click="changeTab('3')" v-bind:class="{'is-active': isActive === '3'}">
                  <a>
                    <span class="icon is-small"><i class="fab fa-amazon-pay" aria-hidden="true"></i></span>
                    <span>会計</span>
                  </a>
                </li>
                <li v-on:click="changeTab('4')" v-bind:class="{'is-active': isActive === '4'}">
                  <a>
                    <span class="icon is-small"><i class="fas fa-user-md" aria-hidden="true"></i></span>
                    <span>その他</span>
                  </a>
                </li>
              </ul>
            </div>
            <ul class="contents">
              <li v-if="isActive === '2'">コンテンツ2</li>
              <li v-else-if="isActive === '3'">
                <div>                    
                  <b-table :data="accounthItems" :mobile-cards="true">
                    <template slot-scope="p">
                      <b-table-column field="date" label="日付" width="155px">{{ datetimeFormatter(p.row.condDate) }}</b-table-column>
                      <b-table-column field="sum" label="合計" numeric>{{ numberFormatterCurrency(p.row.sum) }}</b-table-column>
                      <b-table-column field="payment" label="支払" numeric>{{ numberFormatterCurrency(p.row.payment) }}</b-table-column>
                      <b-table-column field="debt" label="未収" numeric>{{ numberFormatterCurrency(p.row.debt) }}</b-table-column>
                      <b-table-column field="deposit" label="前受" numeric>{{ numberFormatterCurrency(p.row.deposit) }}</b-table-column>
                      <b-table-column width="40px">
                        <router-link :to="`/accounth/${p.row.id}/${petId}/${ownerId}`">
                          <b-button type="is-light" icon-left="fas fa-sticky-note" size="is-small" style="margin-left:4px">詳細</b-button>
                        </router-link>
                      </b-table-column>                  
                    </template>
                  </b-table>
                </div>
                <div class="level-left">
                  <b-button
                    @click="handleNewAccount()"
                    type="is-primary"
                    icon-left="fas fa-plus"
                  >追加</b-button>
                </div>
              </li>
              <li v-else-if="isActive === '4'">コンテンツ4</li>
              <li v-else>
                <div v-if="editModeVaccine">
                  <div>                   
                    <div id="app" class="container">                    
                      <b-table :data="dmhAll?dmhItems:dmhItemsLast" :mobile-cards="true" :narrowed="true">
                        <template slot-scope="p">                 
                          <b-table-column field="type" label="項目">
                            <b-select v-model="p.row.type" @input="handleSaveDmhDmsubject(p.row.id, $event)">
                              <option v-for="value in dmsubjectList" :key="value.id" v-bind:value="value.id">
                                {{ value.name }}
                              </option>
                            </b-select>
                          </b-table-column>
                          <b-table-column field="name" label="内容">
                            <b-field>
                              <b-input type="text" :value="p.row.name" style="min-width: 120px;" @change.native="handleSaveDmhName(p.row.id, $event.target.value)" />
                              <b-select v-model="p.row.name" style="width: 48px;" 
                                @change.native="p.row.name = getDmcontentName($event.target.value); 
                                  p.row.nextDate = timest.fromMillis(p.row.condDate.toMillis() + getDmcontentCycle($event.target.value) * 3600 * 24 * 1000);
                                  handleSaveDmhName(p.row.id, p.row.name, p.row.nextDate);"
                                @focus="focusDmcontentSelect(p.row.type)" @touchstart="focusDmcontentSelect(p.row.type)">
                                <option v-for="value in dmcontentExtracted" :key="value.id" v-bind:value="value.id">
                                  {{ value.name }}
                                </option>                 
                              </b-select>
                            </b-field>
                          </b-table-column>
                          <!--<b-table-column field="name" label="内容"><div v-if="!isEditTable" @dblclick="isEditTable = true">{{ p.row.name }}</div><div v-else><b-input type="text" v-model="p.row.name" v-on:blur="isEditTable=false" /></div></b-table-column>-->
                          <b-table-column field="condDate" label="実施日" width="140">
                            <b-datepicker v-if="p.row.condDate" v-bind:value="p.row.condDate.toDate()" v-on:input="handleSaveDmhCondDate(p.row.id, $event)" :date-formatter="(date) =>  moment(date).locale(lang).format('YYYY/MM/DD')">
                            </b-datepicker>
                          </b-table-column>
                          <b-table-column field="nextDate" label="次回予定日" width="140">
                            <b-datepicker v-if="p.row.nextDate" v-bind:value="p.row.nextDate.toDate()" v-on:input="handleSaveDmhNextDate(p.row.id, $event)" :date-formatter="(date) =>  moment(date).locale(lang).format('YYYY/MM/DD')">
                            </b-datepicker>
                          </b-table-column>
                          <!--<b-button @click="edit(p)"> Edit </b-button>-->
                          <b-table-column width="80px">
                            <!--<div class="level is-mobile" style="margin-top:0px; margin-bottom:0px">-->
                            <div class="level-right" style="margin-top:0px; margin-bottom:0px">
                              <b-button v-if="p.row.last" @click="handlePost(p.row.type)" type="is-primary" icon-left="fas fa-plus" />
                              <b-button @click="delDmh(p.row.id)" type="is-danger" icon-left="fas fa-trash" style="margin-left:4px" />
                            </div>
                            <!--</div>-->
                          </b-table-column>
                        </template>
                      </b-table>
                      <div class="field m-b-10">
                        <input type="checkbox"
                          :checked="dmhAll"
                          @input="dmhAll = !dmhAll"> 全履歴
                      </div>
                    </div>
                    <div class="level is-mobile">
                      <div class="level-left">
                        <b-button
                          @click="handlePost()"
                          type="is-primary"
                          icon-left="fas fa-plus"
                        >追加</b-button>
                        <!--<b-button
                          @click="handleSaveDmh"
                          icon-left="fas fa-save"  
                          style="margin-left:1rem"    
                        >OK</b-button>-->
                        <b-button
                          @click="handleOk"
                          icon-left="fas fa-window-close"  
                          style="margin-left:1rem"    
                        >OK</b-button>
                      </div>
                    </div>
                  </div>
                </div>
                <h2 v-else>
                  <div>
                    <div id="app" class="container">
                      <b-table :data="dmhAll?dmhItems:dmhItemsLast" :mobile-cards="true">
                        <template slot-scope="p">
                          <b-table-column field="type" label="項目">{{ getDmsubjectName(p.row.type) }}</b-table-column>
                          <b-table-column field="name" label="内容">{{ p.row.name }}</b-table-column>
                          <!--<b-table-column field="condDate" label="実施日" >{{ p.row.condDate.toDate().toLocaleDateString("ja-JP", {year:"numeric", month:"2-digit", day:"2-digit"}) }}</b-table-column>-->
                          <b-table-column field="condDate" label="実施日" >{{ dateFormatter(p.row.condDate) }}</b-table-column>
                          <b-table-column field="nextDate" label="次回予定日" >{{ dateFormatter(p.row.nextDate) }}</b-table-column>
                          <b-table-column width="40px">
                            <div class="level-right">
                              <router-link :to="`/dmh/${p.row.id}/${petId}/${ownerId}`">
                                <b-button type="is-light" icon-left="fas fa-print" size="is-small" style="margin-left:4px">Edit</b-button>
                              </router-link>
                            </div>
                          </b-table-column>
                        </template>
                      </b-table>
                      <div class="field m-b-10">
                        <input type="checkbox"
                          :checked="dmhAll"
                          @input="dmhAll = !dmhAll"> 全履歴
                      </div>
                    </div>
                    <span v-if="isOwner">
                      <b-button class="button is-light" icon-left="fas fa-edit" @click="handleEditVaccine" >編集</b-button>
                    </span>
                  </div>
                </h2>
              </li>
            </ul>
          </h2>
        </span>
      </div>
    </div>
    <div >
      <!--<b-loading active />-->
    </div>
  </section>
</template>



<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator"; 
import { db, firestore } from "@/scripts/firebase";
import { OwnerList, Pets, Species, Breeds, IwanBaseDocument, TodoList, Dmh, Accounth } from "@/scripts/datatypes";
import OwnerTitle from "@/components/OwnerTitle.vue";
import SourceLink from "@/components/SourceLink.vue";
import moment from 'moment';
Vue.prototype.moment = moment;

import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { extend } from 'vee-validate';
import { required, email, max, numeric, regex } from 'vee-validate/dist/rules';

extend('required', required);
extend('max', max);
extend('numeric', numeric);
extend('regex', regex);
extend('positive', no => {
  return no >= 0;
});

@Component({
  components: {
    SourceLink,
    OwnerTitle,
    ValidationProvider,
    ValidationObserver
  }
})
export default class IwanPet extends Vue {
  title = "abc";
  no = "";
  ownerId = "";
  //ownerId_ = ""
  petId = "";
  name = ""; 
  birth: Date | null = null;
  birth_ = "";
  ownerlist: OwnerList | null = null;
  petlist: Pets | null = null;
  dmhItems: Array<Dmh> = [];
  dmhItemsLast: Array<Dmh> = [];
  accounthItems: Array<Accounth> = [];
  detacher?: firebase.Unsubscribe;
  detacher2?: firebase.Unsubscribe;
  detacher3?: firebase.Unsubscribe;
  createPet = false;
  species: Species | null = null;
  breeds: Breeds | null = null;
  breedsExtracted: Breeds | null = null;
  breedName = '';
  speciesSelected = '';
  breedSelected = '';
  genderSelected = '';
  neuteredSelected = '';
  gender: IwanBaseDocument | null = null;
  neutered: IwanBaseDocument | null = null;
  neuteredRemarks = "";
  color = "";
  colorList: IwanBaseDocument | null = null;
  size = "";
  sizeList: IwanBaseDocument | null = null;
  since: Date | null = null;
  character = "";
  characterList: IwanBaseDocument | null = null;
  environment = "";
  environmentList: IwanBaseDocument | null = null;
  cohabitation = "";
  cohabitationList: IwanBaseDocument | null = null;
  bw ="";
  dead = "";
  deadList: IwanBaseDocument | null = null;
  deadRemarks = "";
  dmsubjectList: IwanBaseDocument | null = null;
  dmsubjectSelected = "";
  dmcontent: IwanBaseDocument | null = null;
  dmcontentExtracted: IwanBaseDocument | null = null;
  errorNo = false;
  pets: Pets | null = null;
  editMode = false;
  editModeVaccine = false;
  //selectedSpeciesName = '';
  //@Prop() document!: Pets;
  //@Prop() refDocument!: firebase.firestore.DocumentReference;
  isActive = this.$store.state.isActive
  isActiveDefault = false;

  timest = firestore.Timestamp
  dmhAll = false
  checks = [false, false, false, false, false, false, false, false, false, false, 
		false, false, false, false, false, false, false, false, false, false]

  async created() {
    this.ownerlist = (await this.refOwner.get()).data() as OwnerList;
    this.petlist = (await this.refPet.get()).data() as Pets;
    if (this.petlist.birth) {
      this.birth = this.petlist.birth.toDate();
      this.birth_ = this.birth.toLocaleDateString("ja-JP", {year:"numeric", month:"2-digit", day:"2-digit"});
    }
    if (this.petlist.since) this.since = this.petlist.since.toDate();
    if (this.petlist.no) this.no = this.petlist.no.toString(); 
    if (this.petlist.bw) this.bw = this.petlist.bw.toString();
    //if (this.petlist.petId) this.petId = this.petlist.petId;
    this.petId = this.$route.params.petId;
    this.ownerId = this.$route.params.parentId
    //this.ownerId_ = this.petlist.parentId
    this.name = this.petlist.name;
    this.speciesSelected = this.petlist.species;
    this.breedSelected = this.petlist.breed;
    this.breedName = this.petlist.breedName;
    this.genderSelected = this.petlist.gender;
    this.neuteredSelected = this.petlist.neutered;
    //this.selectedSpeciesName = await this.getSpeciesName(this.petlist.species);
    this.color = this.petlist.color;
    this.size = this.petlist.size;
    this.character = this.petlist.character;
    this.environment = this.petlist.environment;
    this.cohabitation = this.petlist.cohabitation;   
    this.dead = this.petlist.dead;
    this.deadRemarks = this.petlist.deadRemarks;
    //this.changeTab(1)
    this.detacher = this.refPet
      .collection("dmh")
      .orderBy('type').orderBy('condDate', "desc")
      .onSnapshot(snapshot => {
        this.dmhItems = snapshot.docs.map(doc => {          
          return Object.assign(doc.data(), { id: doc.id, parentId: this.$route.params.petId }) as Dmh;
        });
      });
    this.detacher2 = this.refPet
      .collection("dmh")
      .where("last", "==", true)
      .orderBy('type').orderBy('condDate', "desc")
      .onSnapshot(snapshot => {
        this.dmhItemsLast = snapshot.docs.map(doc => {       
          return Object.assign(doc.data(), { id: doc.id, parentId: this.$route.params.petId }) as Dmh;
        });
      });
    this.detacher3 = this.refPet
      .collection("accounth")
      .orderBy('condDate', "desc")
      .onSnapshot(snapshot => {
        this.accounthItems = snapshot.docs.map(doc => {          
          return Object.assign(doc.data(), { id: doc.id, parentId: this.$route.params.petId }) as Accounth;
        });
      });
    this.reloadCache()
    
    const speciesRef = db.collection("species");
    const breedsRef = db.collection("breeds");
    const genderRef = db.collection("gender");
    const neuteredRef = db.collection("neutered");
    const colorRef = db.collection("color");
    const sizeRef = db.collection("size");
    const characterRef = db.collection("character");
    const environmentRef = db.collection("environment");
    const cohabitationRef = db.collection("cohabitation");
    const deadRef = db.collection("dead");
    const dmsubjectRef = db.collection("dmsubject");
    const dmcontentRef = db.collection("dmcontent");

    const result: any = [];
    const resultB: any = [];
    const resultG: any = [];
    const resultN: any = [];
    const resultC: any = [];
    const resultS: any = [];
    const resultCh: any = [];
    const resultE: any = [];
    const resultCo: any = [];
    const resultD: any = [];
    const resultDs: any = [];
    const resultDc: any = [];
    
    //const petsRef = db.collectionGroup("pets");

    await speciesRef//.where("owner", "==", this.$store.state.user.uid)
      .get({ source: 'cache' })
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          // doc.data() is never undefined for query doc snapshots 
          const d = doc.data();
          d.id = doc.id; // idをセット
          result.push(d as Species);
          //console.log(doc.id, " => ", d);
        });
        result.sort(this.compare);
        this.species = result;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    // ↑ アロー関数

    await breedsRef//.where("owner", "==", this.$store.state.user.uid)
      .get({ source: 'cache' })
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultB.push(d as Breeds);
          //console.log(doc.id, " => ", d);
          const source = doc.metadata.fromCache ? "local cache" : "server";
          //console.log("Data(breeds) came from " + source);
        });
        resultB.sort(this.compare);
        this.breeds = resultB;
        this.breedsExtracted = resultB;
        // Editで品種を絞り込んでおくために必要
        this.changedSpecies();
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });

    await genderRef
      .get({ source: 'cache' })
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultG.push(d as IwanBaseDocument);
          //console.log(doc.id, " => ", d);
        });
        this.gender = resultG;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    

    await neuteredRef
      .get({ source: 'cache' })
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultN.push(d as IwanBaseDocument);
          //console.log(doc.id, " => ", d);
        });
        this.neutered = resultN;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });

    await colorRef
      .orderBy("no")
      .get({ source: 'cache' })
      //.get()
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultC.push(d as IwanBaseDocument);
        });
        this.colorList = resultC;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });

    await sizeRef
      .get({ source: 'cache'} )
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultS.push(d as IwanBaseDocument);
        });
        this.sizeList = resultS;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });   

    await characterRef
      .get({ source: 'cache' })
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultCh.push(d as IwanBaseDocument);
        });
        this.characterList = resultCh;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    
    await environmentRef
      .get({ source: 'cache' })
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultE.push(d as IwanBaseDocument);
        });
        this.environmentList = resultE;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });   

    await cohabitationRef
      .get({ source: 'cache' })
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultCo.push(d as IwanBaseDocument);
        });
        this.cohabitationList = resultCo;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });  

    await deadRef
      //.get()
      .get({ source: 'cache' })
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultD.push(d as IwanBaseDocument);
        });
        this.deadList = resultD;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });

    await dmsubjectRef
      .get()
      //.get({ source: 'cache' })
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultDs.push(d as IwanBaseDocument);
        });
        this.dmsubjectList = resultDs;
        //console.log('dmsubjectList:', this.dmsubjectList);
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });

    await dmcontentRef
      .get({ source: 'cache' })
      .then(querySnapshot => {      
        querySnapshot.forEach(function(doc) {         
          const d = doc.data();
          d.id = doc.id;
          resultDc.push(d as IwanBaseDocument);
          //console.log(doc.id, " => ", d);
          const source = doc.metadata.fromCache ? "local cache" : "server";
          //console.log("Data(breeds) came from " + source);
        });
        resultDc.sort(this.compare);
        this.dmcontent = resultDc;
        this.dmcontentExtracted = resultDc;
        // Editで品種を絞り込んでおくために必要
        //this.changedSpecies();
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
    //
    //var self = this;
    
  }

  destroyed() {
    this.detacher && this.detacher();
    this.detacher2 && this.detacher2();
    this.detacher3 && this.detacher3();
  }

  get refOwner(): firebase.firestore.DocumentReference { 
    return db.collection("owners").doc(this.$route.params.parentId);
  }
  get refPet(): firebase.firestore.DocumentReference {
    return db.collection("owners").doc(this.$route.params.parentId).collection("pets").doc(this.$route.params.petId);
  }
  get hasUser(): boolean {
    return !!this.$store.state.user;
  }
  get itemMap(): any {
    return this.dmhItems.reduce((ret: any, item) => {
      ret[item.id] = item;
      return ret;
    }, {});
  }
  
  async handlePost(type: string) {
    const today = new Date()
    const next = new Date(today)
    next.setDate(today.getDate() + 365)
    if (!type) type = "99"
    await this.refPet.collection("dmh").add({
      owner: this.$store.state.user.uid,
      ownerName: this.$store.state.user.displayName,
      timeCreated: firestore.FieldValue.serverTimestamp(),
      type: type,
      name: "",
      condDate: firestore.FieldValue.serverTimestamp(),
      nextDate: firestore.Timestamp.fromDate(next),
      last: true,
      petId: this.petId,
      ownerId: this.ownerId,
      no: this.ownerlist!.no,
      ownerFullname: this.ownerlist!.nameSei + " " + this.ownerlist!.nameNa,
      petNo: this.no,
      petName: this.name,
      zip: this.ownerlist!.zip,
      address1: this.ownerlist!.address1 + this.ownerlist!.address2,
      address2: this.ownerlist!.address3,
      phone: this.ownerlist!.phone
      
    });
    /*
    this.no = "";
    this.name = "";
    this.createPet = false;
    */
  }
  
  refDmhItem(id: string): firebase.firestore.DocumentReference {
    return this.refPet.collection("dmh").doc(id);
  }
  async handleCheck(id: string) {
    const item = this.itemMap[id] as Pets;
    if (this.isOwner(id)) {
      await this.refDmhItem(id).update({
        completed: !item.completed
      });
    }
  }
  
  async handleDelete() {
    await this.refPet.delete();
    //this.$router.push("/owner");
    this.$router.go(-1);
  }

  handleBack() {
    this.$router.go(-1);
  }
  
  isOwner(id: string): boolean {
    const user = this.$store.state.user;
    const item = this.itemMap[id] as Pets;
    return user && user.uid == item.owner;
  }
  handleListDelete() {
    this.$router.push("/owner");
  }

  async delDmh(id: string) {
    console.log("handleListDelete(" + id + ")...");
    await this.refDmhItem(id).delete();   
  }

  gotoOwner(vale: boolean) {
    this.$router.push(`/owner/${this.ownerId}`)
  }

  async handleNewAccount() {
    //this.$router.push(`/account/${this.petId}`)
    const today = new Date()
    const next = new Date(today)
    await this.refPet.collection("accounth").add({
      owner: this.$store.state.user.uid,
      ownerName: this.$store.state.user.displayName,
      timeCreated: firestore.FieldValue.serverTimestamp(),
      condDate: firestore.FieldValue.serverTimestamp(),
      nextDate: firestore.Timestamp.fromDate(next),
      sum: 0,
      payment: 0,
      debt: 0,
      deposit: 0,
      petId: this.petId,
      ownerId: this.ownerId,
      no: this.ownerlist!.no,
      ownerFullname: this.ownerlist!.nameSei + " " + this.ownerlist!.nameNa,
      petNo: this.no,
      petName: this.name,
      zip: this.ownerlist!.zip,
      address1: this.ownerlist!.address1 + this.ownerlist!.address2,
      address2: this.ownerlist!.address3,
      phone: this.ownerlist!.phone  
    });
  }

  data() {
    //console.log('itemMap:', this.itemMap)
    return {
      labelPosition: 'on-border',
      breedSelected: '',
      genderSelected: '',
      neuteredSelected: '',
      birth: null,
      since: null,
      lang: "ja-jp",
      isEditTable : true,
      /*data: [
        { 'no': 1, 'first_name': 'Jesse', 'last_name': 'Simmons', 'date': '2016-10-15 13:43:27', 'gender': 'Male' },
        { 'no': 2, 'first_name': 'John', 'last_name': 'Jacobs', 'date': '2016-12-15 06:00:53', 'gender': 'Male' },
        { 'no': 3, 'first_name': 'Tina', 'last_name': 'Gilbert', 'date': '2016-04-26 06:26:28', 'gender': 'Female' },
        { 'no': 4, 'first_name': 'Clarence', 'last_name': 'Flores', 'date': '2016-04-10 10:28:46', 'gender': 'Male' },
        { 'no': 5, 'first_name': 'Anne', 'last_name': 'Lee', 'date': '2016-12-06 14:38:38', 'gender': 'Female' }
      ],*/
      //data: this.dmhItems,
      data: [],
      columns: [
        {
            field: 'no',
            label: 'No',
            width: '40',
            numeric: true
        },
        {
            field: 'name',
            label: '名前',
        },
        {
            field: 'condDate',
            label: '実施日',
        },
        {
            field: 'nextDate',
            label: '次回予定日',
            centered: true
        },
        {
            field: 'gender',
            label: 'Gender',
        }
      ]
    }
    
  }

  computed() {
    return {
      nextDate_: [
      ]
    }
  }

  dateFormatter(date: firebase.firestore.Timestamp) {
    try {
      return date.toDate().toLocaleDateString("ja-JP", {year:"numeric", month:"2-digit", day:"2-digit"}) 
    } catch (e) {
      //console.log(e)
      return
    }
  }

  timeFormatter(date: firebase.firestore.Timestamp) {
    try {
      return date.toDate().toLocaleTimeString('ja-JP')
    } catch (e) {
      return
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

  numberFormatter(num: string) {
    const formatter = new Intl.NumberFormat('ja-JP')
    if (num) {
      return formatter.format(Number(num)) 
    } else {
      return
    }
  }

  compare(a: any, b: any) {
    let r = 0;
    if (a.order < b.order) { 
      r = -1;
    } else if ( a.order > b.order ) { 
      r = 1; 
    }
    return r;
  }
  async changedSpecies() {
    const b = this.breeds as any;
    const s = this.speciesSelected; 
    const matchData = b.filter(function(item: any, index: any){
      if (item.species == s) return true;     
    });
    this.breedsExtracted = matchData;
  }
  // #2020-08-08
  async changedDmsubject() {
    const b = this.dmcontent as any;
    const s = this.dmsubjectSelected; 
    //console.log("dmsubjectSelected:", s);
    const matchData = b.filter(function(item: any, index: any){
      if (item.type == s) return true;     
    });
    this.dmcontentExtracted = matchData;
  }

  focusDmcontentSelect(type: string) {
    //console.log("focus!", type)
    this.dmsubjectSelected = type
    this.changedDmsubject()
  }

  getSpeciesName(id: string) {
    if (!id || !this.species) return;
    const s = this.species as any;
    return s.find((x: any) => x.id === id).name;
  }

  getBreedName(id: string) {
    if (!id) return;
    const s = this.breeds as any;
    console.log(id + ": " + s.find((x: any) => x.id === id).name);
    return s.find((x: any) => x.id === id).name;
  }

  getGenderName(id: string) {
    if (!id || !this.gender) return;
    const s = this.gender as any;
    return s.find((x: any) => x.id === id).name;
  }

  getNeuteredName(id: string) {
    if (!id || !this.neutered) return;
    const s = this.neutered as any;
    return s.find((x: any) => x.id === id).name;
  }

  getDmsubjectName(id: string) {
    if (!id || !this.dmsubjectList) return;
    const s = this.dmsubjectList as any;
    //console.log('dmsubjectList:', this.dmsubjectList)
    return s.find((x: any) => x.id === id).name;
  }

  getDmcontentName(id: string) {
    if (!id || !this.dmcontent) return;
    const s = this.dmcontent as any;
    // ワクチン種類のチェックも付ける
    this.checks = s.find((x: any) => x.id === id).checks
    return s.find((x: any) => x.id === id).name;
  }
  // Cycle
  getDmcontentCycle(id: string) {
    if (!id) return;
    const s = this.dmcontent as any;
    return s.find((x: any) => x.id === id).cycle;
  }

  searchNo(no: string) {
    if (this.no.length > 0 && !this.no.search(/^[0-9]+$/)) { 
      //console.log("Serch No...");
      this.refOwner.collection("pets")
      .where("no", "==", Number(no))
      .get()
      .then(querySnapshot => {      
        querySnapshot.forEach(doc => {         
          //console.log(doc.id, " => ", doc.data());
          if (doc.id == this.$route.params.petId) {
            this.errorNo = false;
          } else {
            this.errorNo = true;
          }
        });
        if (querySnapshot.empty) this.errorNo = false;
      })
      .catch(error => {
        console.log("Error getting documents: ", error);
        this.errorNo = false;
      });
    } else {
      this.errorNo = false;
    }
  }

  handleEdit() {
    this.editMode = true;
  }
  handleSave() {
    // 新規ペットで未作成フィールドのundifinedエラーを回避
    if (!this.color) this.color = "";
    if (!this.size) this.size = "";
    if (!this.since) this.since = new Date();
    if (!this.character) this.character = "";
    if (!this.environment) this.environment = "";
    if (!this.cohabitation) this.cohabitation = "";
    if (!this.bw) this.bw = "";
    if (!this.dead) this.dead = "";
    if (!this.deadRemarks) this.deadRemarks = "";
    let spname = this.getSpeciesName(this.speciesSelected)
    if (!spname) spname = ""
    let brname = this.breedName
    let brname_: string[] = ["","",""]
    if (!brname) {
      brname = ""
    } else {
      brname = brname.replace(/・/g, ' ')
      brname_ = brname.split(' ')
      if (!brname_[1]) brname_[1] = ""
      if (!brname_[2]) brname_[2] = ""
    }
    // set
    this.refPet.set({
      no: Number(this.no),
      petId: this.petId,
      ownerId: this.ownerId,
      name: this.name,
      species: this.speciesSelected,
      speciesName: spname,
      breed: this.breedSelected,
      breedName: this.breedName,
      gender: this.genderSelected,
      neutered: this.neuteredSelected,
      birth: this.birth,
      color: this.color,
      size: this.size,
      since: this.since,
      character: this.character,
      environment: this.environment,
      cohabitation: this.cohabitation,
      bw: Number(this.bw),
      dead: this.dead,
      deadRemarks: this.deadRemarks,
      keywords: [String(this.ownerlist!.no), this.ownerlist!.nameSei, this.ownerlist!.nameNa, this.name, spname, brname_[0], brname_[1], brname_[2]]
    }, {merge: true})
      .then(function() {
        console.log("Document successfully written!");
      })
      .catch(function(error) {
        console.error("Error writing document: ", error);
    });
    this.editMode = false;
    // SubCollection情報の書き換え
    // dmh
    if (this.dmhItems.length > 0) {
      this.dmhItems.forEach(doc => {
        this.refPet.collection("dmh").doc(doc.id).update({
          petId: this.petId,
          ownerId: this.ownerId,
          //no: this.ownerlist!.no,
          //ownerFullname: this.ownerlist!.nameSei + " " + this.ownerlist!.nameNa,
          petNo: this.no,
          petName: this.name,
          //zip: this.ownerlist!.zip,
          //address1: this.ownerlist!.address1 + this.ownerlist!.address2,
          //address2: this.ownerlist!.address3,
          //phone: this.ownerlist!.phone
        });
      })
    }
  }
  handleCancel() {
    //this.title = this.document.title;
    this.editMode = false;
    this.editModeVaccine = false;
    //this.$emit("petCreate", true);
  }
  handleOk() {
    this.editMode = false;
    this.editModeVaccine = false;
    this.setDmhLast()
  }
  setDmhLast() {
    // 各Typeの最終履歴にフラグを立てる
    //const batch = db.batch();
    let dmsbj = "";
    let dmsbj_ = "";
    this.dmhItems.forEach(doc => {
      dmsbj = doc.type
      if (dmsbj == dmsbj_) {
        this.refPet.collection("dmh").doc(doc.id).update({
          last: false 
        });
      } else {
        this.refPet.collection("dmh").doc(doc.id).update({
          last: true 
        });
      }
      dmsbj_ = doc.type 
    })
  
    /*
    // 一括書き込みサンプル for Android
    // 1000件のサンプルデータ 
    val cityList: MutableList<City> = getSampleCityList()
    val db = FirebaseFirestore.getInstance()

    // 1. 一括書き込み開始
    var batch: WriteBatch = db.batch()
    cityList.forEachIndexed { index, city ->
        val ref: DocumentReference = db.collection("cities").document(city.name!!)
        batch.set(ref, city)
        if ((index + 1) % 500 == 0 || index == cityList.lastIndex) {

            // 2. オペレーションが500件に達したらコミット
            batch.commit().addOnCompleteListener {
                Log.d(TAG, "batch commit isSuccess: ${it.isSuccessful}")

            }
            // 3. 新たに一括書き込みを開始する
            batch = db.batch()
        }
    }
    */
  }

  async handleSaveDmhName(id: string, name: string) {
    console.log("handleSaveDmhName(" + id + ")");
    const item = this.itemMap[id] as Dmh;
    //if (this.isOwner(id)) {
      await this.refDmhItem(id).update({
        name: name,
        checks: this.checks
      });
    //}
  }

  async handleSaveDmhCondDate(id: string, date: firebase.firestore.Timestamp) {
    //console.log("handleSaveDmhDate(" + id + ")");
    //console.log("date: ", date);
    const item = this.itemMap[id] as Dmh;
      await this.refDmhItem(id).update({
        condDate: date 
      });
  }

  async handleSaveDmhNextDate(id: string, date: firebase.firestore.Timestamp) {
    const item = this.itemMap[id] as Dmh;
      await this.refDmhItem(id).update({
        nextDate: date 
      });
  }

  async handleSaveDmhDmsubject(id: string, type: string) {
    const item = this.itemMap[id] as Dmh;
      await this.refDmhItem(id).update({
        type: type 
      });
  }

  get isChanged() {
    return true;
  }

  changeTab(num: number) {
    this.isActive = num
    this.$store.commit('setIsActive', num)
    this.isActiveDefault = false
  }

  handleEditVaccine() {
    this.editModeVaccine = true;
  }

  // キャッシュが空のデータはサーバーから取得する
  async reloadCache() {
    // dmsubject
    const dmsubject = db.collection("dmsubject");
    const snapshot = await dmsubject.get({ source: 'cache' })
    if (snapshot.empty || this.$store.state.masterNocache == true) dmsubject.get()
    // dmcontent
    const dmcontent = db.collection("dmcontent");
    const snapshotD = await dmcontent.get({ source: 'cache' })
    if (snapshotD.empty || this.$store.state.masterNocache == true) dmcontent.get()
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
  min-width: 20px;
}
//table {table-layout: fixed;}
</style>