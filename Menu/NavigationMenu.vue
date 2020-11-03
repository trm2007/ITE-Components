<template>
  <v-navigation-drawer
    expand-on-hover
    :permanent="Permanent"
    :dark="Dark"
    :mini-variant="Mini"
    :app="App"
    :fixed="Fixed"
    :absolute="Absolute"
    :right="Right"
    :temporary="Temporary"
    @update:mini-variant="
      (function (e) {
        console.log(e);
      })
    "
  >
    <slot>
      <MenuItem
        :ItemsData="NavigationData"
        :OpenOnHover="false"
        :Right="!Right"
        :Left="Right"
        Bottom
        OffsetY
        :Dark="Dark"
        @SelectMenuItem="selectMenuItem"
      />

    </slot>
  </v-navigation-drawer>
</template>

<script>
import MenuItem from "./MenuItem";
import NavigateMenuItem from "./NavigateMenuItem";

export default {
  name: "NavigationMenu",
  props: {
    NavigationData: {
      type: Array,
      required: true,
    },
    App: {
      type: Boolean,
      default: true,
    },
    Absolute: {
      type: Boolean,
      default: false,
    },
    Fixed: {
      type: Boolean,
      default: true,
    },
    Mini: {
      type: Boolean,
      default: true,
    },
    Dark: {
      type: Boolean,
      default: true,
    },
    Permanent: {
      type: Boolean,
      default: true,
    },
    Right: {
      type: Boolean,
      default: false,
    },
    Temporary: {
      type: Boolean,
      default: false,
    },
  },
  data: function () {
    return {};
  },
  computed: {},
  watch: {},
  components: {
    NavigateMenuItem,
    MenuItem,
  },
  mounted: function () {},
  methods: {
    selectMenuItem: function (id) {
      console.log("NavigationMenu->selectMenuItem, id: ", id);
      this.$emit("nav-select", id);
    },
  },
};
</script>
