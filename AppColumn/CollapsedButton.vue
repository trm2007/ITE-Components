<template>
  <button class="ui button collapsed"
      :class="(Vertical ? 'collapsed-width' : 'collapsed-height')"
      @click="open"
      >
    <i :class="Icon + ' icon'"></i>{{Title}}
  </button>
</template>

<script>
export default {
  name: "CollapsedButton",
  props: {
    Title: {
      type: String,
      default: "Open"
    },
    Icon: {
      type: String,
      default: "dropdown"
    },
    Vertical: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    open: function() {
      this.$emit('open');
    }
  }
}
</script>

<style scoped>
.first_column > .collapsed {
  left: 0;
}
.last_column > .collapsed {
  right: 0;
}
.collapsed {
  position: fixed;
  background-color: gray;
  overflow: hidden;
  z-index: 999;
}
</style>