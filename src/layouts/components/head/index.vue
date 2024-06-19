<script lang="ts" setup>
import { watch, ref } from "vue";
import SvgIcon from "@/components/svgIcon/index.vue";
import { useSystemStore } from "@/store/modules/system";
import { useUserInfoStore } from "@/store/modules/user";
import { useRouter } from "vue-router";
import TabBar from "./tab-bar.vue";
import { useScreen } from "@/layouts/hooks/useScreen";
import { useTheme } from "@/layouts/hooks/useTheme";

const { clickFullscreen, screen } = useScreen();
const { command, themeList } = useTheme();
const systemStore = useSystemStore();
const userInfoStore = useUserInfoStore();
const router = useRouter();
const styleIcon = {
  width: "18px",
  height: "18px",
  fontSize: "18px",
};

const clickGoGithub = () => {
  window.open("https://github.com/lili12352/hp-admin-cli");
};
const dropLogin = () => {
  userInfoStore.dropLogin();
  systemStore.resetSystem();
  router.push("/login");
};
const clickIcon = () => {
  systemStore.switchCollapse();
};

const breadcrumbList = ref<any[]>([]);
const routerList = router.getRoutes();
watch(
  () => router.currentRoute.value.path,
  (newValue) => {
    const breadcrumb = newValue.split("/");
    let path = "";
    breadcrumbList.value = [];
    for (let i = 0; i < breadcrumb.length; i++) {
      if (!breadcrumb[i]) continue;
      path = path + "/" + breadcrumb[i];
      const routerObj = routerList.find((item) => item.path === path);
      if (!routerObj) continue;
      breadcrumbList.value.push({
        path: routerObj.path,
        title: routerObj.meta.title,
      });
    }
  },
  { immediate: true },
);
</script>
<template>
  <div class="header">
    <div class="flex-align">
      <div class="head-left flex-align">
        <div class="fold-icon flex-center" @click="clickIcon">
          <SvgIcon
            :iconName="systemStore.isCollapse ? 'Expand' : 'Fold'"
            :styleIcon="styleIcon"
          />
        </div>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item
            v-for="(item, index) in breadcrumbList"
            :key="item.path"
          >
            <a class="breadcrumb" v-if="index < breadcrumbList.length - 1">{{
              item.title
            }}</a>
            <span class="breadcrumb" v-else>{{ item.title }}</span>
          </el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="head-right flex-align">
        <el-tooltip placement="bottom" content="主题">
          <el-dropdown trigger="click">
            <SvgIcon
              class="tooltip"
              iconName="#MagicStick"
              :styleIcon="styleIcon"
            />
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  :disabled="systemStore.themeValue === item.value"
                  v-for="item in themeList"
                  :key="item.value"
                  @click="command(item.value)"
                >
                  {{ item.name }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-tooltip>

        <el-tooltip :content="screen ? '退出' : '全屏'" placement="bottom">
          <SvgIcon
            v-if="screen"
            @click="clickFullscreen"
            iconName="#fullscreen-exit"
            class="tooltip"
            :styleIcon="styleIcon"
          />
          <SvgIcon
            v-else
            @click="clickFullscreen"
            iconName="#full-screen"
            class="tooltip"
            :styleIcon="styleIcon"
          />
        </el-tooltip>

        <el-dropdown>
          <div class="user-right flex-align">
            <!-- <el-avatar :size="30" src="/image/bd.jpg" /> -->
            <span class="user-name">{{ userInfoStore.userName }}</span>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="clickGoGithub">github</el-dropdown-item>
              <el-dropdown-item divided @click="dropLogin"
                >退出登录</el-dropdown-item
              >
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
    <TabBar />
  </div>
</template>

<style lang="scss" scoped>
.header {
  box-sizing: border-box;
  overflow: hidden;
  .head-left {
    flex: 1;
    .fold-icon {
      width: 50px;
      height: 50px;
    }
    a {
      cursor: not-allowed;
    }
    .breadcrumb {
      color: var(--them-head-font-color);
    }
  }
  .head-right {
    height: 100%;
    .tooltip {
      margin: 0 10px;
      color: var(--them-head-font-color);
    }
    .user-right {
      position: relative;
      margin: 0 10px;
      .user-name {
        margin: 0 5px;
        color: var(--them-head-font-color);
      }
      span {
        margin: 0 5px;
        color: #606266;
      }
      .user-hove {
        position: absolute;
        left: 0;
        top: 10px;
      }
    }
  }
}
</style>
