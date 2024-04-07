<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import SvgIcon from "@/components/svgIcon/index.vue";
import { useSystemStore } from "@/store/modules/system";
import { useRouter } from "vue-router";
const systemStore = useSystemStore();
const router = useRouter();
let scrollNode: HTMLElement | null = null;
onMounted(() => {
  scrollNode = document.querySelector("#scroll");
  if (!scrollNode) return;
  scrollNode.addEventListener("scroll", scrollTop, true);
});
onUnmounted(() => {
  if (!scrollNode) return;
  scrollNode.removeEventListener("scroll", scrollTop);
});
const scrollLeft = ref(0);
// 实时滚动条高度
const scrollTop = () => {
  if (!scrollNode) return;
  const scroll = scrollNode.scrollLeft || scrollNode.scrollLeft;
  scrollLeft.value = scroll;
};

const clickScroll = (number: number) => {
  if (!scrollNode) return;
  scrollNode.scrollLeft = scrollLeft.value + number;
};
const goRouter = (path: string) => {
  router.push(path);
};
const styleIcon = {
  width: "10px",
  height: "10px",
  fontSize: "10px",
};
</script>
<template>
  <div class="tab-bar flex-align">
    <div class="icon flex-align">
      <SvgIcon @click="clickScroll(-10)" iconName="ArrowLeftBold" />
    </div>
    <div class="scroll" id="scroll">
      <div class="tab-bar">
        <a
          class="tab"
          :class="{
            select: router.currentRoute.value.fullPath === tabKey.path,
          }"
          v-for="tabKey in systemStore.tabBarList"
          :key="tabKey.path"
          @click="goRouter(tabKey.path)"
        >
          {{ tabKey.name }}
          <div
            v-if="tabKey.path !== '/home'"
            class="close flex-center"
            @click.stop="systemStore.delTabbar(tabKey.path)"
          >
            <SvgIcon :styleIcon="styleIcon" iconName="Close" />
          </div>
        </a>
      </div>
    </div>
    <div class="icon flex-align">
      <SvgIcon @click="clickScroll(10)" iconName="ArrowRightBold" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tab-bar {
  padding: 0 10px;
  .icon {
    margin: 0 10px;
  }
  .scroll {
    padding-top: 3px;
    flex: 1;
    height: 30px;
    position: relative;
    padding-bottom: 5px;
    text-align: center;
    white-space: nowrap;
    overflow-x: scroll;
    overflow-y: hidden;
    box-sizing: border-box;
    &::-webkit-scrollbar {
      position: absolute;
      bottom: 0;
      width: 10px;
      height: 0px;
    }
    &:hover {
      &::-webkit-scrollbar {
        position: absolute;
        bottom: 0;
        width: 10px;
        height: 5px;
      }
    }
    .tab-bar {
      position: absolute;
      left: 0px;
      top: 0;
      .tab {
        position: relative;
        margin-left: 5px;
        padding: 2px 5px;
        height: 30px;
        color: var(--them-head-font-color);
        border: 1px solid #eee;
        border-radius: 5px;
        font-size: 14px;
        cursor: pointer;
        &:hover {
          .close {
            display: flex;
          }
        }
        .close {
          display: none;
          position: absolute;
          top: 0;
          right: 0;
          transform: translate(50%, -20%);
          width: 12px;
          height: 12px;
          color: #fff;
          border-radius: 50%;
          background-color: #b9b9b9;
        }
      }
      .select {
        padding-left: 12px;
        background-color: #1677ff;
        border: 1px solid #1677ff;
        color: #fff;
        &::after {
          content: "";
          display: block;
          position: absolute;
          left: 6px;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: #fff;
        }
      }
    }
  }
}
</style>
