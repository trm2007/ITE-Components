<template>

      <v-edit-dialog
        :return-value.sync="CurrentValue"
        large
        @open="openDialog()"
        @save="saveDialog()"
        @close="closeDialog()"
        :id="CellId+'_editor'"
      >
        {{CellData}}
        <template v-slot:input>

          <v-date-picker v-if="CellType=='date'" 
              no-title
              scrollable
              :value="CellData"
              v-model="CurrentValue"
          />
          
            <v-text-field v-else-if="CellType=='string'" autofocus :value="CellData"
              v-model="CurrentValue"  />
            <v-textarea v-else-if="CellType=='text'" autofocus :value="CellData"
              v-model="CurrentValue" />
            <v-text-field v-else autofocus :value="CellData"
              v-model="CurrentValue" />
        </template>
      </v-edit-dialog>

</template>

<script>

export default {
  name: "CellEditor",
  props: {
    CellData: {
      required: true
    },
    CellId: {
      type: [Number, String],
      default: 0
    },
    CellType: {
      type: String,
      default: ""
    }
  },
  data: function() {
    return {
      CurrentValue: null
    };
  },
  methods: {
    openDialog: function() {
console.log("openDialog, this.CellData = ", this.CellData);
      this.CurrentValue = this.CellData;
    },
    saveDialog: function() {
console.log("saveDialog, this.CurrentValue = ", this.CurrentValue);
      this.$emit("update:CellData", this.CurrentValue);
    },
    closeDialog: function() {
console.log("closeDialog, this.CurrentValue = ", this.CurrentValue);
      this.CurrentValue = null;
    }
  }
}
</script>
