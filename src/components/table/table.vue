<script lang="ts" setup>
import { useAttrs, onUpdated } from "vue";
let attrs = useAttrs();
onUpdated(() => {
  attrs = useAttrs();
});

const props = defineProps(["dataSource", "colums"]);
</script>
<template>
  <div>
    <el-table :data="props.dataSource" v-bind="attrs">
      <el-table-column
        v-for="item in props.colums"
        v-bind="item"
        :key="item.key"
        :prop="item.key"
        :label="item.title"
      >
        <template #default="scope">
          <slot :name="item.key" :row="scope.row">
            {{ scope.row[item.key] }}
          </slot>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
