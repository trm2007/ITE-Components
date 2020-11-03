<template>
<v-container fluid>
  <v-row dense>
    <v-col
      v-for="(Item, i) in ItemsData"
      :key="i"
      cols="4"
    >
      <v-card>
        <v-img v-if="ImageFieldName" :src="Item[ImageFieldName.name]" />
        <v-card-title v-if="HeaderFieldName" class="header">{{ Item[HeaderFieldName.name] }}</v-card-title>
        <v-card-text v-if="DescriptionFieldName" class="description">{{ Item[DescriptionFieldName.name] }}</v-card-text>
        <v-card-text v-if="CommentFieldName" class="description">{{ Item[DescriptionFieldName.name] }}</v-card-text>
        <v-card-text v-if="DateFieldName" class="date">{{ Item[DateFieldName.name] }}</v-card-text>
      </v-card>

    </v-col>
  </v-row>
</v-container>
</template>

<script>

export default {
  name: "EntityModule",
  props: {
    // карта объекта, массив с описанием полей [
    // {
    //  name: "имя поля"
    //  type: "тип поля - image, titlt, comment..."
    //  title: "заголовок для поля, если воводить на форме"
    //  max_length: "максимальная длина для текстовых полей (опционально)"
    // }, ... ]
    DataMap: {
      type: [Array,Object],
      default: () => {}
    },
    ItemsData: {
      type: Array,
      default: () => []
    },
    Cards: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
    };
  },
  computed: {
    // ищет в DataMap имя поля с URL картинки, если такого нет, то вернется undefined
    ImageFieldName: function() {
      return this.DataMap.find( Item => {
        if( Item.type == 'image' || Item.type == 'picture' || Item.type == 'photo' ) {
          return true;
        }
        return false;
      } );
    },
    HeaderFieldName: function() {
      return this.DataMap.find( Item => {
        if( Item.type == 'header' || Item.type == 'title' ) {
          return true;
        }
        return false;
      } );
    },
    DescriptionFieldName: function() {
      return this.DataMap.find( Item => {
        if( Item.type == 'description' || Item.type == 'text' ) {
          return true;
        }
        return false;
      } );
    },
    // тип comment и пустой тип относятся к комментариям...
    CommentFieldName: function() {
      return this.DataMap.find( Item => {
        if( Item.type == 'comment' || !Item.type ) {
          return true;
        }
        return false;
      } );
    },
    DateFieldName: function() {
      return this.DataMap.find( Item => {
        if( Item.type == 'date' ) {
          return true;
        }
        return false;
      } );
    }
  }
}
</script>