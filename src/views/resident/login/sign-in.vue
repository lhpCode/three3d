<script lang="ts" setup>
import { reactive, ref } from "vue";
import { useUserInfoStore } from "@/store/modules/user";
import { useRouter } from "vue-router";
import type { FormRules, FormInstance } from "element-plus";
import { userLoginApi } from "@/api/user";
const userInfoStore = useUserInfoStore();
const router = useRouter();
const styleIcon = {
  width: "16px",
  height: "16px",
  fontSize: "16px",
};
interface RuleForm {
  name: string;
  password: string;
}
const loginForm = reactive<RuleForm>({
  name: "",
  password: "",
});

const rules = reactive<FormRules<RuleForm>>({
  name: [
    {
      required: true,
      message: "Please input Account ",
      trigger: "change",
    },
  ],
  password: [
    { required: true, message: "Please input Password", trigger: "change" },
  ],
});

const ruleFormRef = ref<FormInstance>();
const loadingFlag = ref(false);
const submitForm = async (formEl: FormInstance | undefined) => {
  loadingFlag.value = true;
  if (!formEl) return (loadingFlag.value = false);
  formEl
    .validate()
    .then(async () => {
      const { data } = await userLoginApi(loginForm);
      const { userName, token, nickName } = data;
      loadingFlag.value = false;
      if (!token) {
        return alert("测试账号 test 和admin ，密码任意字符");
      }
      userInfoStore.login({
        userName,
        token,
        nickName,
      });

      router.push("/");
    })
    .catch((fields) => {
      loadingFlag.value = false;
      console.log("error submit!", fields);
    });
};
</script>
<template>
  <div class="login-from">
    <el-form
      ref="ruleFormRef"
      :rules="rules"
      :model="loginForm"
      label-width="auto"
      style="max-width: 600px"
    >
      <el-form-item prop="name">
        <el-input
          v-model="loginForm.name"
          style="width: 240px"
          placeholder="Email or Account"
        >
          <template #prefix>
            <SvgIcon iconName="#account" />
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          v-model="loginForm.password"
          style="width: 240px"
          placeholder="password"
          type="password"
          show-password
        >
          <template #prefix>
            <SvgIcon iconName="#mima" />
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <div class="forget">Forget Password?</div>
    <el-button
      :disabled="loadingFlag"
      class="btn"
      type="primary"
      round
      @click="submitForm(ruleFormRef)"
    >
      <span v-if="!loadingFlag">Sign in</span>
      <SvgIcon
        v-else
        color="#fff"
        :styleIcon="styleIcon"
        class="loading"
        iconName="#jiazai"
      />
    </el-button>
  </div>
</template>

<style lang="scss" scoped>
.login-from {
  margin: 20px auto;
  width: 240px;
  .forget {
    text-align: center;
    color: #87cbf8;
    font-size: 14px;
    cursor: pointer;
  }
  .btn {
    margin-top: 10px;
    width: 100%;
  }
}
</style>
