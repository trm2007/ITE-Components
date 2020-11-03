<template>
  <div class="app-column">
    <CollapsedButton v-if="Collapsed" @open="openColumn" />
    <slot></slot>
  </div>
</template>

<script>
import CollapsedButton from "./CollapsedButton";

export default {
  name: "AppColumn",
  props: {
    Left: {
      type: Boolean,
      default: true
    },
    Collapsed: {
      type: Boolean,
      default: false
    },
  },
  data: function() {
    return {
    };
  },
  components: {
    CollapsedButton
  },
  watch: {
    Collapsed: function () {
console.log("AppColumn Collapsed - ", this.Collapsed)
    }
  },
  mounted: function() {
  },
  methods: {
    openColumn: function () {
      this.$emit('column-open');
    },
  }
}
</script>

<style scoped>
.app-column {
  box-sizing: border-box;
  display: inline-block;
  vertical-align: top;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  position: relative;
  padding: 0;
  margin: 0;
}
</style>