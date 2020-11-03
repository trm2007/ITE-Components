<template>
  <v-data-table
    :headers="DataMap"
    :items="TableData"
    :items-per-page="5"
    class="elevation-1"
    :id="TableId"
    :expanded.sync="Expanded"
    show-expand
  >
    <!--template v-slot:item.data-table-expand="{ isExpanded, expand }">
      <td @click="expand(!isExpanded)">
        {{ isExpanded }}
      </td>
    </template-->

    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <NewTable
           v-if="item.children"
          :TableData="item.children.Data"
          :DataMap="item.children.DataMap ? item.children.DataMap : DataMap"
          :TableId="TableId + 1"
        />
        <span v-else>No children!</span>
      </td>
    </template>

    <template v-slot:item="props">
      <TableRow
        :RowData="props.item"
        :DataMap="props.headers"
        :RowId="TableId + '_' + props.index"
        :IsExpanded="props.isExpanded"
        :ExpandFunction="props.expand"
      >
      </TableRow>
    </template>

  </v-data-table>
</template>

<script>
import TableRow from "./TableRow";
import TestData from "./testdata";

export default {
  name: "NewTable",
  components: {
    TableRow,
  },
  props: {
    TableId: {
      type: [Number, String],
      default: 0,
    },
    // сюда передаются данные в секции TableData.Data и карта данных в секции TableData.DataMap
    // {
    //  Data: [], - массив строк с данным
    //  DataMap: [] - массив с характеристиками каждой ячейки
    // }
    TableData: {
      type: [Array, Object],
      default: TestData,
    },
    DataMap: {
      type: [Array, Object],
      default: () => [],
    },
  },
  data: function () {
    return {
      Expanded: [],
    };
  },
  watch: {
    TableData: function () {
      this.Expanded = [];
    },
  },
};
</script>
