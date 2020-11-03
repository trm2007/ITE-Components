<template>
  <v-menu
    :close-on-click="CloseOnClick"
    :close-on-content-click="CloseOnContentClick"
    :value="true"
    :position-x="MenuX"
    :position-y="MenuY"
    absolute
    offset-y
  >
    <slot><MenuItem
        :ItemsData="MenuData"
        OffsetX
        Right
        OpenOnHover
        :CloseOnClick="CloseOnClick"
        :CloseOnContentClick="CloseOnContentClick"
        @SelectMenuItem="selectMenuItem"
    /></slot>
  </v-menu>
</template>

<script>
import MenuItem from "./MenuItem";
import SelectableMenuItem from "./SelectableMenuItem";

/**
 * контекстное меню,
 * вызывается из какого-то метса и в качестве параметров принимает координаты для отображения на клиенет,
 * и массив с даннвми об эдементах меню.
 * само контекстное меню данные не подгружает
 */
export default {
  name: "ContextMenu",
  mixins: [SelectableMenuItem],
  props: {
    CloseOnClick: {
      type: Boolean,
      default: true
    },
    CloseOnContentClick: {
      type: Boolean,
      default: true
    },
    MenuX: {
      type: Number,
      required: true
    },
    MenuY: {
      type: Number,
      required: true
    },
    MenuData: {
      type: Array,
      required: true
    },
  },
  components: {
    MenuItem
  }
}
</script>
