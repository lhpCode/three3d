<script lang="ts" setup>
import { ref } from "vue";
import Card from "@/components/card/index.vue";
import useEcharts from "@/hooks/useEcharts";
import userEchartsData from "./hooks/useEchartsData";
import useThree from "@/hooks/useThree";
const {
  deviceOnlineData,
  deviceOnlineOption,
  numberOfAlarmsOption,
  distributeOption,
} = userEchartsData();
const {
  patrolStatus,
  showPatrol,
  firstPerson,
  isFirstPerson,
  showLine,
  switchShowLine,
  moveCamera,
} = useThree("office");
useEcharts(deviceOnlineOption, "deviceOnline");
useEcharts(numberOfAlarmsOption, "numberOfAlarms");
useEcharts(distributeOption, "distribute");

// 视角列表数组
const visualAngleList = [
  {
    position: { x: 0, y: 10, z: 150 },
    lookAt: { x: 0, y: 0, z: 0 },
  },
  {
    position: { x: 140, y: 10, z: 40 },
    lookAt: { x: 40, y: 5, z: 40 },
  },
  {
    position: { x: -40, y: 10, z: 100 },
    lookAt: { x: -40, y: 15, z: 0 },
  },
  {
    position: { x: 10, y: 2, z: 50 },
    lookAt: { x: 10, y: 0, z: 40 },
  },
  {
    position: { x: -40, y: 10, z: 100 },
    lookAt: { x: -40, y: 0, z: 0 },
  },
];
const visualNumber = ref(0);
const changeView = (v: string) => {
  const { position, lookAt } = visualAngleList[v];
  moveCamera(position, lookAt);
};
</script>

<template>
  <div class="layout">
    <div class="head">1</div>
    <div class="centre">
      <div class="left box">
        <Card class="card-box">
          <template #title>
            <div class="title">数据统计</div>
          </template>
          <div class="device-online">
            <div id="deviceOnline" />
            <div class="device">
              <div>
                在线设备：<span>{{ deviceOnlineData.online }}</span>
              </div>
              <div>离线设备：{{ deviceOnlineData.downline }}</div>
            </div>
          </div>
        </Card>
        <Card class="card-box">
          <template #title>
            <div class="title">告警次数</div>
          </template>
          <div class="device-online">
            <div id="numberOfAlarms" />
          </div>
        </Card>

        <Card class="card-box">
          <template #title>
            <div class="title">告警分布</div>
          </template>
          <div class="device-online">
            <div id="distribute" />
          </div>
        </Card>
      </div>
      <div class="three">
        <div id="office" />
      </div>
      <div class="right box">
        <Card class="card-box">
          <template #title>
            <div class="title">巡逻人员</div>
          </template>
          <div class="patrol-party-list">
            <!-- <div id="distribute" /> -->
          </div>
        </Card>
      </div>
    </div>
    <div class="control">
      <el-button type="primary" @click="showPatrol">
        {{ patrolStatus ? "点击继续巡逻" : "点击暂停巡逻" }}</el-button
      >
      <el-button type="primary" @click="firstPerson">
        {{ isFirstPerson ? "第三人称" : "第一人称" }}</el-button
      >
      <el-button type="primary" @click="switchShowLine">
        {{ showLine ? "隐藏轨迹" : "显示轨迹" }}</el-button
      >
      <el-dropdown @command="changeView">
        <el-button type="primary"> 视角切换 </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item
              :disabled="i === visualNumber"
              :command="i"
              v-for="(item, i) in visualAngleList"
              :key="i"
              >视角{{ i + 1 }}</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.three {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 0;
  #office {
    position: relative;
    width: 100vw;
    height: 100vh;
  }
}

.layout {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .head {
    height: 80px;
    z-index: 9999999;
    // background-color: rgba(0, 0, 0, 0.7);
  }
  .centre {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .box {
      position: relative;
      padding: 10px;
      width: 300px;
      height: 100%;
      z-index: 9999999;
      background-color: rgba(15, 30, 47, 0.8);
      background: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.4),
        rgba(0, 0, 0, 0.1)
      );
      box-sizing: border-box;
      box-shadow: inset 0px 0px 30px 5px rgba(255, 255, 255, 0.6);
      .card-box {
        margin-bottom: 20px;
      }
    }
    .right {
      background: linear-gradient(
        to left,
        rgba(0, 0, 0, 0.4),
        rgba(0, 0, 0, 0.1)
      );
      .patrol-party-list {
      }
    }
    .left {
      .device-online {
        display: flex;
        align-items: center;
        .device {
          margin-top: 10px;
          margin-left: 10px;
          span {
            font-weight: 900;
            color: #3cadc9;
          }
        }
      }
      #deviceOnline {
        width: 100px;
        height: 100px;
      }
      #numberOfAlarms {
        width: 100%;
        height: 200px;
      }
      #distribute {
        width: 100%;
        height: 300px;
      }
    }
  }
}

.control {
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, -50%);
  .el-dropdown {
    margin-left: 10px;
  }
}
</style>
