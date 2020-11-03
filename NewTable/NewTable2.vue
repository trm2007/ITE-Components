<template>
  <v-data-table
    :headers="DataMap"
    :items="CurrentTableData"
    :items-per-page="5"
    :id="TableId"
    :expanded="Expanded"
    show-expand
    class="elevation-1"
  >
    <template v-slot:item="props">
      <TableRow
        :RowData="props.item"
        :DataMap="props.headers"
        :RowId="TableId + '_' + props.index + '_' + props.item[KeyId]"
        @click_expand="toggleActiveTableExpand"
      >
      </TableRow>
    </template>
  </v-data-table>
</template>

<script>
import TableRow from "./TableRow";
import TestData from "./testdata";

export default {
  name: "NewTable2",
  components: {
    TableRow,
  },
  props: {
    TableId: {
      type: [Number, String],
      default: 0,
    },
    //  TableData: [], - массив строк с данным
    TableData: {
      type: [Array, Object],
      default: () => TestData[0].Data
    },
    //  DataMap: [] - массив с характеристиками каждой ячейки
    DataMap: {
      type: [Array, Object],
      default: () => TestData[0].DataMap
    },
    KeyId: {
      type: String,
      default: "id",
    },
  },
  data: function() {
    return {
      ActiveExpanded: {},
      Expanded: [],
      CurrentTableData: [],
    };
  },
  computed: {
    AllTableData: function() {},
  },
  watch: {
    TableData: function() {
      this.ActiveExpanded = {};
      this.Expanded = [];
      this.CurrentTableData = JSON.parse(JSON.stringify(this.TableData));
      this.generateActiveTableData(this.CurrentTableData);
    },
  },
  mounted: function() {
    console.log("TestData", TestData);
    this.CurrentTableData = JSON.parse(JSON.stringify(this.TableData));
    this.generateActiveTableData(this.CurrentTableData);
  },
  methods: {
    // генерирует внутренние связки дочерних элементов для родительского Id = CurrentId
    // фактически проходит по всем дочерним элементам (из массивов children)
    // и присваивает в новое поле _parent_id значение CurrentId
    // Меняет элементы внутри TableData !!!
    generateActiveTableData: function(TableData, CurrentId = "0") {
      let i = 0;

      for (i = 0; i < TableData.length; i++) {
        if (typeof TableData[i] == "undefined") {
          continue;
        }
        let NewItem = TableData[i];
        // Для реактивности используем Vue.set вместо обычного присвоения,
        // так как полей _id и _parent_id изначально нет в объектах и они не отслеживаемые
        // Vue.set сождает слежение по сеттерам
        this.$set(NewItem, "_id", [CurrentId, NewItem[this.KeyId]].join("_"));
        this.$set(NewItem, "_parent_id", CurrentId);
        //NewItem._id = [CurrentId, NewItem[this.KeyId]].join('_');
        //NewItem._parent_id = CurrentId;
        if (
          NewItem.children &&
          NewItem.children.Data &&
          NewItem.children.Data.length
        ) {
          this.generateActiveTableData(NewItem.children.Data, NewItem._id);
        }
      }
    },
    // вставляет сразу после элемента с номером IdToExpand его дочерние элементы
    expandActiveTableData: function(CurrentTableData, IdToExpand) {
      // клонируем массив, этот способ производит глубокое копирование,
      // но работает только с численными и строковыми индексами массивов
      let TableData = JSON.parse(JSON.stringify(CurrentTableData));
      let Index = TableData.findIndex((item) => {
        return item["_id"] === IdToExpand;
      });
      // найден элемент
      if (Index !== -1) {
        // добавляет все элементы из TableData[Index].children.Data (их разворачивает spread оператор ...)
        TableData.splice(Index + 1, 0, ...TableData[Index].children.Data);
      }
      return TableData;
    },
    // убирает все элементы, у которых _parent_id == ParentIdToCollapse
    // вызывается рекурсивно для дочерних элементов
    collapseActiveTableData: function(CurrentTableData, ParentIdToCollapse, CloneFlag = true) {
      let TableData;
      if(CloneFlag) {
      // клонируем массив, этот способ производит глубокое копирование,
      // но работает только с численными и строковыми индексами массивов
        TableData = JSON.parse(JSON.stringify(CurrentTableData));
      }
      else {
        // если CloneFlag установлен в false, тогда присвоение по ссылке,
        // и в этом случае меняется CurrentTableData
        TableData = CurrentTableData;
      }
      let Index = TableData.findIndex((item) => {
        return item["_parent_id"] === ParentIdToCollapse;
      });
      // пока будут находится элементы удовлетворяющие условию: item["_parent_id"] === ParentIdToCollapse
      while (Index !== -1) {
        this.ActiveExpanded[TableData[Index]["_id"]] = false;
        this.collapseActiveTableData(TableData, TableData[Index]["_id"], false);
        TableData.splice(Index, 1);
        Index = TableData.findIndex((item) => {
          return item["_parent_id"] === ParentIdToCollapse;
        });
      }
      return TableData;
    },
    // переключает состояние Expand у строки таблицы,
    // для этого используется массив Expanded
    toggleActiveTableExpand: function(IsExpanded, RowData) {
      console.log("toggleActiveTableExpand RowData[_id]: ", RowData["_id"]); //return;

      if (!this.ActiveExpanded[RowData["_id"]]) {
        this.CurrentTableData = this.expandActiveTableData(
          this.CurrentTableData,
          RowData["_id"]
        );
        //this.$set(this.ActiveExpanded, RowData["_id"], true);
        this.ActiveExpanded[RowData["_id"]] = true;
      } else {
        this.CurrentTableData = this.collapseActiveTableData(
          this.CurrentTableData,
          RowData["_id"]
        );
        //this.$set(this.ActiveExpanded, RowData["_id"], false);
        this.ActiveExpanded[RowData["_id"]] = false;
      }
      console.log(
        "after - toggleActiveTableExpand this.CurrentTableData: ",
        this.CurrentTableData
      ); //return;
      console.log(
        "after - toggleActiveTableExpand this.ActiveExpanded: ",
        this.ActiveExpanded
      ); //return;
      //// отслеживанием занимается expanded.sync у v-data-table
      //this.ActiveExpanded[RowData["_id"]] = !this.ActiveExpanded[RowData["_id"]];
    },
  },
};
</script>
