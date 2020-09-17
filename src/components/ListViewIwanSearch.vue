<template>
  <!--<div v-if="articles.length > 0">-->
    <b-table :data="$store.state.pet" :mobile-cards="true" :narrowed="true">
      <template slot-scope="p">
        <!--<b-table-column style="max-width:40px">
          <router-link :to="`/pet/${p.row.id}/${p.row.ownerId}`">
            <b-button type="is-light" icon-left="fas fa-file" size="is-small" style="margin-left:4px"></b-button>
          </router-link>
        </b-table-column>-->
        <b-table-column field="no" label="No" width="90">
          <router-link :to="`/owner/${p.row.ownerId}`">
            {{ p.row.ownerNo }}
          </router-link>
        </b-table-column>
        <b-table-column field="ownerName" label="飼主名" style="min-width: 100px;">{{ p.row.ownerFullname }}</b-table-column>
        <b-table-column field="no" label="PetNo" width="60">
          <router-link :to="`/pet/${p.row.id}/${p.row.ownerId}`">
            {{ p.row.no }}
          </router-link>
        </b-table-column>
        <b-table-column field="petName" label="ペット名" style="min-width: 80px;">{{ p.row.name }}</b-table-column>
        <b-table-column field="species" label="種">{{ getSpeciesName(p.row.species) }}</b-table-column>
        <b-table-column field="breed" label="品種" style="min-width:120px">{{ p.row.breedName }}</b-table-column>
        <b-table-column field="gender" label="性別" style="min-width: 60px;">{{ getGenderName(p.row.gender) }}</b-table-column>
      </template>
      <template slot="footer">
        <div class="has-text-right">
            <!--{{ (new Date()).toLocaleDateString("ja-JP", {year:"numeric", month:"2-digit", day:"2-digit"}) }}-->
        </div>
      </template>
    </b-table>
  <!--</div>-->
</template>

<script lang="ts">
import Vue from "vue";
import { Component, Prop } from "vue-property-decorator";
import { db } from "@/scripts/firebase";
import { BaseDocument, IwanBaseDocument, Species } from "../scripts/datatypes";
import { eventBus } from "../main"; // 子 → 子 受け渡し用

@Component
export default class ListViewIwanSearch extends Vue {
  @Prop() readonly refCollection!: firebase.firestore.CollectionReference;
  @Prop() readonly path!: string;
  detacher?: firebase.Unsubscribe;
  //articles: Array<BaseDocument> = [];
  articles: BaseDocument[] = [];
  species: Species | null = null;
  gender: IwanBaseDocument | null = null;
  snap1: BaseDocument[] | null = null
  snap2: BaseDocument[] | null = null
  
  async created() {
    eventBus.$on("searchProfile", this.profileList);
    const speciesRef = db.collection("species");
    const breedsRef = db.collection("breeds");
    const genderRef = db.collection("gender");
    const result: any = [];
    const resultG: any = [];
    await speciesRef//.where("owner", "==", this.$store.state.user.uid)
      .get({ source: 'cache' })
      .then(querySnapshot => {      
        querySnapshot.forEach(doc => {         
          const d = doc.data();
          d.id = doc.id; // idをセット
          result.push(d as Species);
        });
        result.sort(this.compare);
        this.species = result;
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
        });
        this.gender = resultG;
      })
      .catch(function(error) {
        console.log("Error getting documents: ", error);
      });
  }
  destroyed() {
    this.detacher && this.detacher();
  }
  profileList(keyword: string) {
    // 全角スペースを半角スペースに置き換え
    keyword = keyword.replace(/\u3000/g, ' ')
    // ・を半角スペースに置き換え
    keyword = keyword.replace(/・/g, ' ')
    // 全角英数を半角に変換
    keyword = this.hankaku2Zenkaku(keyword)
    // スペース区切りを配列に変換
    const words = keyword.split(' ')
    let articles_: BaseDocument[] = []
    // keywordの数に応じて処理（5個まで）
    if (words.length > 0) {
      this.getKeywordResult(words[0]).then(result => {
        articles_ = articles_.concat(result)
        this.$store.state.pet = articles_
      })
    }
    if (words.length > 1) {
      this.getKeywordResult(words[1]).then(result => {
        articles_ = articles_.concat(result)
        articles_ = articles_.filter((element, index, self) => 
          self.findIndex(e => 
            e.id === element.id
          ) != index
        );
        this.$store.state.pet = articles_
      })
    }
    if (words.length > 2) {
      this.getKeywordResult(words[2]).then(result => {
        articles_ = articles_.concat(result)
        articles_ = articles_.filter((element, index, self) => 
          self.findIndex(e => 
            e.id === element.id
          ) != index
        );
        this.$store.state.pet = articles_
      })
    }
    if (words.length > 3) {
      this.getKeywordResult(words[3]).then(result => {
        articles_ = articles_.concat(result)
        articles_ = articles_.filter((element, index, self) => 
          self.findIndex(e => 
            e.id === element.id
          ) != index
        );
        this.$store.state.pet = articles_
      })
    }
    if (words.length > 4) {
      this.getKeywordResult(words[4]).then(result => {
        articles_ = articles_.concat(result)
        articles_ = articles_.filter((element, index, self) => 
          self.findIndex(e => 
            e.id === element.id
          ) != index
        );
        this.$store.state.pet = articles_
      })
    }
    
    /*
    // 数字と文字に分ける
    const numbers = (words.filter(item => item.match(/\d/g))).map(Number)
    // 文字
    const strings = words.filter(item => item.match(/\D/g))
    console.log("keywords:", words)
    console.log("numbers:", numbers)
    console.log("strings:", strings) 
    let articles_: BaseDocument[] = [];
    //this.articles = []
    if (numbers.length > 0 && strings.length == 0) {
      this.getNumberResult(numbers).then(result => {
        articles_ = articles_.concat(result)
        this.articles = articles_
      })
    } else if (strings.length > 0 && numbers.length == 0) {
      this.getOwnerNameSeiResult(strings).then(result => {
        articles_ = articles_.concat(result)
        this.articles = articles_
      })
      if (strings.length == 1) {
        // 文字キーワードが一つの場合はOR検索
        this.getPetNameResult(strings).then(result => {
          articles_ = articles_.concat(result)
          // 重複削除
          articles_ = articles_.filter((element, index, self) => 
            self.findIndex(e => 
              e.id === element.id
            ) === index
          );
          this.articles = articles_
        })
      } else {
        // 文字キーワードが2つ以上の場合はAND検索
        this.getPetNameResult(strings).then(result => {
          articles_ = articles_.concat(result)
          // 重複のみ
          articles_ = articles_.filter((element, index, self) => 
            self.findIndex(e => 
              e.id === element.id
            ) != index
          );
          this.articles = articles_
        })
      }     
    } else {
      this.getNumberResult(numbers).then(result => {
        articles_ = articles_.concat(result)
        this.articles = articles_
      })
      if (strings.length == 1) {
        this.getOwnerNameSeiResult(strings).then(result => {
          articles_ = articles_.concat(result)
          // 重複削除
          articles_ = articles_.filter((element, index, self) => 
            self.findIndex(e => 
              e.id === element.id
            ) === index
          );
          this.articles = articles_
        })
        this.getPetNameResult(strings).then(result => {
          articles_ = articles_.concat(result)
          // 重複のみ
          articles_ = articles_.filter((element, index, self) => 
            self.findIndex(e => 
              e.id === element.id
            ) != index
          );
          this.articles = articles_
        })
        return
      } else if (strings.length == 2) {
        this.getOwnerNameSeiResult(strings).then(result => {
          articles_ = articles_.concat(result)
          // 重複削除
          articles_ = articles_.filter((element, index, self) => 
            self.findIndex(e => 
              e.id === element.id
            ) === index
          );
          this.articles = articles_
        })
        this.getPetNameResult(strings).then(result => {
          articles_ = articles_.concat(result)
          // 重複のみ
          articles_ = articles_.filter((element, index, self) => 
            self.findIndex(e => 
              e.id === element.id
            ) != index
          );
          this.articles = articles_
        })
        return
      } else {
        this.getOwnerNameSeiResult(strings).then(result => {
          articles_ = articles_.concat(result)
          // 重複削除
          articles_ = articles_.filter((element, index, self) => 
            self.findIndex(e => 
              e.id === element.id
            ) === index
          );
          this.articles = articles_
        })
      }   
      this.getPetNameResult(strings).then(result => {
        articles_ = articles_.concat(result)
        // 重複のみ
        articles_ = articles_.filter((element, index, self) => 
          self.findIndex(e => 
            e.id === element.id
          ) != index
        );
        this.articles = articles_
      })
      
    }
    */
    //console.log(result.length);
    /*
    // JSONの重複を取る処理の例
    const result = colors.filter((element, index, self) => 
      self.findIndex(e => 
        e.english === element.english &&
        e.japanese === element.japanese
      ) === index
    );
    return colors.filter((element, index, self) => 
      self.findIndex(e => 
        e.english === element.english &&
        e.japanese === element.japanese
      ) === index
    */
    // const result = _.uniqBy([...member1, ...member2], 'id');
    
  }

  getKeywordResult(word: string) {
    const result: BaseDocument[] = []
    return this.refCollection 
      .where("owner", "==", this.$store.state.user.uid)
      .where("keywords", "array-contains", word)
      .orderBy("no")
      .get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const d = doc.data()
          d.id = doc.id
          result.push(d as BaseDocument)    
        })
        return result
      })
  }
  // 前方一致の例（Arrayでは使えない）
  getKeywordResult_(word: string) {
    const result: BaseDocument[] = []
    return this.refCollection
      .orderBy("breedName").startAt(word).endAt(word + '\uf8ff')
      .where("owner", "==", this.$store.state.user.uid)
      .get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
          const d = doc.data()
          d.id = doc.id
          result.push(d as BaseDocument)    
        })
        return result
      })
  }
  

  

  getSpeciesName(id: string) {
    if (!id || !this.species) return;
    const s = this.species as any;
    return s.find((x: any) => x.id === id).name;
  }
  getGenderName(id: string) {
    if (!id || !this.gender) return;
    const s = this.gender as any;
    return s.find((x: any) => x.id === id).name;
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
  hankaku2Zenkaku(str: string) {
    return str.replace(/[Ａ-Ｚａ-ｚ０-９]/g, function(s) {
      return String.fromCharCode(s.charCodeAt(0) - 0xFEE0);
    });
  }
}
</script>

<style scoped>
.listview {
  margin-top: 8px;
}
table {table-layout: fixed;}
</style>

