<template>
  <div class="ui container fluid" :class="LoadDataFlag ? 'active dimmer ' :''">

    <h2>{{Header}}</h2>
    <p>
      Данные получены AJAX-запросом с сайта:
      <ul>
        <li><a :href="GetDataUrl">{{ GetDataUrl }}</a></li>
      </ul>
      Всего получено - [{{DataArray.length}}] записей.
    </p>

    <EntityModule Cards :DataMap="DataMap" :ItemsData="DataArray" />

  </div>
</template>

<script>
import axios from "axios";
import EntityModule from "./EntityModule";

export default {
  name: "BasicContent",
  props: {
    GetDataUrl: {
      type: String,
      default: "" // photos'
    },
    Header: {
      type: String,
      default: 'Content 2'
    },
    DataMap: {
      type: [Array, Object],
      default: () => []
    }
  },
  data: function() {
    return {
      DataArray: [],
      LoadDataFlag: false
    };
  },
  watch: {
    GetDataUrl: function() {
      if( this.GetDataUrl ) {
        this.initData(this.GetDataUrl);
      }
    }
  },
  components: {
    EntityModule
  },
  mounted: function() {
    if( this.GetDataUrl ) {
      this.initData(this.GetDataUrl);
    }
  },
  methods: {
    initData: function(GetDataUrl) {
      this.LoadDataFlag = true;
      this.$emit('add-loader', this);

      axios.get(GetDataUrl)
      .then(response => {
        this.DataArray = response.data;
      })
      .catch(e => {
        this.DataArray = [{title: "Error!"}];
        console.log("Url: ", this.GetDataUrl, "Error: ", e);

      } )
      .finally( () => {
        this.$emit('remove-loader', this);
        this.LoadDataFlag = false;
      });
      // fetch не работает в текущей версии сборки 2020-10-09
      // fetch('https://jsonplaceholder.typicode.com/posts/1')
      // .then(response => response.json())
      // .then(json => console.log(json));
    }
  }
}
</script>
