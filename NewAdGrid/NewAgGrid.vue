<template>
  <ag-grid-vue style="width: 500px; height: 500px;"
               class="ag-theme-alpine"
               :columnDefs="columnDefs"
               :rowData="rowData"
               @cellContextMenu="cellContextMenu"
  >
  </ag-grid-vue>
</template>

<script>
import {AgGridVue} from "ag-grid-vue";

export default {
  name: 'NewAgGrid',
  data() {
    return {
      columnDefs: null,
      rowData: null,
    }
  },
  components: {
    AgGridVue
  },
  beforeMount() {
    this.columnDefs = [
      {headerName: 'Make', field: 'make'},
      {headerName: 'Model', field: 'model'},
      {headerName: 'Price', field: 'price'}
    ];

    this.rowData = [
      {make: 'Toyota', model: 'Celica', price: 35000},
      {make: 'Ford', model: 'Mondeo', price: 32000},
      {make: 'Porsche', model: 'Boxter', price: 72000}
    ];
  },
  methods: {
    cellContextMenu: function (data){
      this.$emit('ag_grid_context_menu', data);
    }
  }
}
</script>

<style scoped>

</style>
