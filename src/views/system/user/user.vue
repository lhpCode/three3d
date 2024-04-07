<script lang="ts" setup>
import { ref } from "vue";
import Table from "@/components/table/table.vue";
import EditUser from "./editUser.vue";

const dataSource = [
  {
    userName: "aaa",
    nickname: "测试用户",
    role: "admin",
    email: "8888@qq.com",
    phoneNumber: "19166666666",
    createTime: "2024/3/29",
    updateTime: "2024/3/29",
  },
];
const columns = [
  {
    title: "用户名",
    dataIndex: "userName",
    key: "userName",
  },
  {
    title: "昵称",
    dataIndex: "nickname",
    key: "nickname",
  },
  {
    title: "角色",
    dataIndex: "role",
    key: "role",
  },
  {
    title: "邮箱",
    dataIndex: "email",
    key: "email",
  },
  {
    title: "手机",
    dataIndex: "phoneNumber",
    key: "phoneNumber",
  },
  {
    title: "创建时间",
    dataIndex: "createTime",
    key: "createTime",
  },
  {
    title: "修改时间",
    dataIndex: "updateTime",
    key: "updateTime",
  },
];

const form = ref({});
const state = ref<{
  show: boolean;
  status: "edit" | "add";
}>({
  show: false,
  status: "add",
});

const add = () => {
  form.value = {};
  state.value.show = true;
  state.value.status = "add";
};
const edit = () => {
  form.value = {
    userName: "aaa",
    nickname: "测试用户",
    role: "admin",
    email: "8888@qq.com",
    phoneNumber: "19166666666",
    createTime: "2024/3/29",
    updateTime: "2024/3/29",
  };
  state.value.show = true;
  state.value.status = "edit";
};
</script>
<template>
  <div>
    <div>admin用户和test用户可见页面</div>
    <div>admin用户可以使用新增按钮和编辑按钮</div>
    <div>test用户只能使用编辑按钮</div>
    <div>
      <!-- 使用方法一 -->
      <el-button type="primary" @click="add" v-auth="`system:user:add`">
        新增
      </el-button>
      <!-- 使用方法二 -->
      <el-button type="primary" @click="edit" v-auth:system:user:edit>
        编辑
      </el-button>
    </div>
    <Table :dataSource="dataSource" :colums="columns" />
    <EditUser v-model:form="form" v-model:state="state" />
    <!-- <SvgIcon /> -->
  </div>
</template>
