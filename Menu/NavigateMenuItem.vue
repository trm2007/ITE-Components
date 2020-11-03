<template>
  <div :class="MenuLevel && !MiniVariant ? 'ml-3' : ''">
    <div
      v-for="(Item, i) in NavigationData"
      :key="'nav_menuitem_' + MenuLevel + '_' + i"
      @click.stop="selectMenuItem(i, Item, {id: i})"
    >
      <v-list-group
        v-if="Item.children && Item.children.length"
        
        v-model="Item.active"
        active-class=""
      >
        <template v-slot:activator>
          <v-list-item-icon v-if="Item.icon">
            <v-icon>{{ "mdi-" + Item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title v-text="Item.name"></v-list-item-title>
          </v-list-item-content>
        </template>
        <NavigateMenuItem :NavigationData="Item.children" :MenuLevel="MenuLevel + 1" @SelectMenuItem="selectMenuItem" />
      </v-list-group>
      <v-list-item
        v-else
        link
        :href="Item.uri"
      >
        <v-list-item-icon v-if="Item.icon">
          <v-icon>{{ "mdi-" + Item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ Item.name }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </div>
  </div>
</template>

<script>
import SelectableMenuItem from "./SelectableMenuItem";

export default {
  name: "NavigateMenuItem",
  mixins: [SelectableMenuItem],
  props: {
    NavigationData: {
      type: Array,
      required: true,
    },
    MenuLevel: {
      type: [Number, String],
      default: 0,
    },
    MiniVariant: {
      type: Boolean,
      default: false,
    },
  }
};
</script>
