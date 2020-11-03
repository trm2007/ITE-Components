<template>
  <div>
    <v-app-bar
      v-if="MenuType == 'top'"
      :app="App"
      :color="Color"
      :dark="Dark"
      dense
      flat
    >
      <slot :MenuData="MenuData">
        <HorizontalMenu
          :Color="Color"
          :Dark="Dark"
          :MenuData="MenuData"
          Bottom
          @SelectMenuItem="selectMenuItem"
        />
      </slot>
    </v-app-bar>

    <v-navigation-drawer
      v-else-if="MenuType == 'right'"
      :expand-on-hover="ExpandOnHover"
      :permanent="Permanent"
      :dark="Dark"
      :app="App"
      :fixed="App || Fixed"
      :absolute="Absolute"
      right
      :temporary="Temporary"
    >
      <slot :MenuData="MenuData">
        <NavigateMenuItem
          :NavigationData="MenuData"
          :MiniVariant="Mini"
          @SelectMenuItem="selectMenuItem"
        />
      </slot>
    </v-navigation-drawer>

    <v-bottom-navigation
      v-else-if="MenuType == 'bottom'"
      :app="App"
      :background-color="Color"
      :dark="Dark"
      horizontal
    >
      <slot :MenuData="MenuData">
        <HorizontalMenu
          :Color="Color"
          :Dark="Dark"
          :MenuData="MenuData"
          Top
          @SelectMenuItem="selectMenuItem"
        />
      </slot>
    </v-bottom-navigation>

    <v-navigation-drawer
      v-else-if="MenuType == 'left'"
      :expand-on-hover="ExpandOnHover"
      :permanent="Permanent"
      :dark="Dark"
      :app="App"
      :fixed="App || Fixed"
      :absolute="Absolute"
      :temporary="Temporary"
    >
      <slot :MenuData="MenuData">
        <NavigateMenuItem
          :NavigationData="MenuData"
          :MiniVariant="Mini"
          @SelectMenuItem="selectMenuItem"
        />
      </slot>
    </v-navigation-drawer>

    <ContextMenu
      v-else-if="MenuType == 'context'"
      :MenuData="MenuData"
      :MenuX="MenuX"
      :MenuY="MenuY"
      :Elevation="Elevation"
      :Dark="Dark"
      :Color="Color"
      :OffsetX="OffsetX"
      :OffsetY="OffsetY"
      :Left="Left"
      :Right="Right"
      :Top="Top"
      :Bottom="Bottom"
      :OutLined="OutLined"
      @SelectMenuItem="selectMenuItem"
    >
      <slot :MenuData="MenuData"></slot>
    </ContextMenu>

    <slot v-else :MenuData="MenuData"></slot>
  </div>
</template>

<script>
import axios from "axios";
import TestData from "./testdata";
import ContextMenu from "./ContextMenu";
import NavigateMenuItem from "./NavigateMenuItem";
import HorizontalMenu from "./HorizontalMenu";

import "./css/style.css";

export default {
  name: "UniversalMenu",
  components: {
    ContextMenu,
    NavigateMenuItem,
    HorizontalMenu,
  },
  props: {
    // данные, которые передаются в меню извне,
    // например, для контекстного меню это могут быть данные от объекта на котором нажата правая кнопка
    ExternalData: {},
    // будут использоваться при запросе данных сеню с сервера
    GetMenuDataURL: {
      type: String,
      default: "",
    },
    MenuId: {
      type: [Number, String],
      default: "default",
    },
    /**
     * указывает производит ли компонент загрузку данных через AJAX в настоящее время
     */
    isLoading: {
      type: Boolean,
      default: false,
    },
    // тип меню (правое, левое, верхнее, нижнее, контекстное или пользовательское, в котором контент меню не размещается ни в одном контейнере )
    MenuType: {
      type: String,
      default: "",
      validator: function (value) {
        // должно быть одним из значений
        return (
          ["top", "right", "bottom", "left", "context", ""].indexOf(value) !==
          -1
        );
      },
    },
    // для контекстного меню
    MenuX: {
      type: [Number, String],
      default: 0,
    },
    MenuY: {
      type: [Number, String],
      default: 0,
    },
    // указывает нужно ли позиционировать меню относительно приложения (применяется в верхнем, нижнем, левом и правом)
    App: {
      type: Boolean,
      default: false,
    },
    // общие настройки
    Color: {
      type: String,
      default: "",
    },
    Dark: {
      type: Boolean,
      default: false,
    },
    // часть для меню
    Elevation: {
      type: [Number, String],
      default: 1,
    },
    OutLined: {
      type: Boolean,
      default: false,
    },
    Left: {
      type: Boolean,
      default: false,
    },
    Right: {
      type: Boolean,
      default: false,
    },
    Top: {
      type: Boolean,
      default: false,
    },
    Bottom: {
      type: Boolean,
      default: false,
    },
    OffsetX: {
      type: Boolean,
      default: false,
    },
    OffsetY: {
      type: Boolean,
      default: false,
    },
    // часть для Navigator
    Absolute: {
      type: Boolean,
      default: false,
    },
    Fixed: {
      type: Boolean,
      default: false,
    },
    MiniVariant: {
      type: Boolean,
      default: true,
    },
    Permanent: {
      type: Boolean,
      default: true,
    },
    Temporary: {
      type: Boolean,
      default: false,
    },
    ExpandOnHover: {
      type: Boolean,
      default: true,
    },
  },
  data: function () {
    return {
      MenuData: [],
      Mini: this.MiniVariant,
    };
  },
  watch: {
    GetMenuDataURL: function () {
      this.loadMenuData(this.MenuId);
    },
    MenuId: function () {
      this.loadMenuData(this.MenuId);
    },
  },
  mounted: function () {
    this.loadMenuData(this.MenuId);
  },
  methods: {
    /**
     * асинхронный запрос к серверу для получения меню
     * @param {*} id - идентификатор меню, которое нужно получить с сервера,
     * добавляется к this.GetMenuDataURL
     */
    loadMenuData: function (id) {
      if (!this.GetMenuDataURL) {
        this.MenuData = this.getMenuFromTest(id);
        return false;
      }

      this.$emit("update:isLoading", true);

      return axios
        .get(this.GetMenuDataURL + id)
        .then((response) => {
          this.MenuData = this.getValidMenu(response.data);
        })
        .catch(() => {
          this.MenuData = this.getMenuFromTest(id);
          console.log(
            "Error - UniversalMenu->loadMenuData, Url: ",
            this.GetMenuDataURL + id
          );
        })
        .finally(() => {
          this.$emit("update:isLoading", false);
        });
    },
    /**
     * возвращает меню с указанным id из тестовых данных
     */
    getMenuFromTest: function (id) {
      console.log("getMenuFromTest, sets default data for Id = ", id);
      if (!TestData[id]) {
        return TestData["default"].children;
      }
      return this.getValidMenu(TestData[id]);
    },
    getValidMenu: function (DataObject) {
      if (DataObject.name && DataObject.name == "root") {
        return DataObject.children ? DataObject.children : [];
      }
      return Array.isArray(DataObject) ? DataObject : [DataObject];
    },
    selectMenuItem: function (num, item, data) {
      if (item.attributes && item.attributes.events) {
        if (Array.isArray(item.attributes.events)) {
          item.attributes.events.forEach((event) => {
            this.$emit(event, {item, data, externaldata: this.ExternalData});
          });
        } else {
          this.$emit(item.attributes.events, {item, data, externaldata: this.ExternalData});
        }
      }
      // всегда генерируется событие select-menu-item
      this.$emit('select_menu_item',{num, item, data, externaldata: this.ExternalData});
    },
  },
};
</script>
