<template>
  <tr :id="RowId">
    <td
      v-for="MapItem in DataMap"
      :id="RowId + '_' + MapItem.value"
      :key="RowId + '-' + MapItem.value"
    >
      <v-btn
        v-if="MapItem.value == 'data-table-expand' && RowData.children"
        @click="ExpandFunction(!IsExpanded, RowData)"
        elevation="1"
        fab
        icon
        small
      >
        <v-icon>{{
          IsExpanded ? "mdi-chevron-double-down" : "mdi-chevron-double-right"
        }}</v-icon>
      </v-btn>
      <div
        v-else-if="MapItem.value != 'data-table-expand' && MapItem.type == 'id'"
      >
        {{ RowData[MapItem.value] }}
      </div>

      <CellEditor
        v-else-if="MapItem.value != 'data-table-expand'"
        :CellType="MapItem.type"
        :CellData.sync="RowData[MapItem.value]"
        :CellId="RowId + '-' + MapItem.value"
      />
    </td>
  </tr>
</template>

<script>
import CellEditor from "./CellEditor";

export default {
  name: "TableRow",
  directives: {
    focus: {
      // определение директивы
      inserted: function (el) {
        el.focus();
      },
    },
  },
  components: {
    CellEditor,
  },
  props: {
    RowData: {
      type: [Array, Object],
      default: () => [],
      required: true,
    },
    DataMap: {
      type: [Array, Object],
      default: () => [],
    },
    RowId: {
      type: [Number, String],
      default: 0,
    },
    ExpandFunction: {
      type: Function,
      default: function(v, e) { this.$emit('click_expand', v, e); return v; }
    },
    IsExpanded: {
      type: Boolean,
      default: false,
    },
  },
  data: function () {
    return {};
  },
  methods: {},
};
</script>
