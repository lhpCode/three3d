<script lang="ts" setup>
import { useUserInfoStore } from "@/store/modules/user";
import userEcharts from "@/hooks/userEcharts";
import { ref } from "vue";
const option_1 = ref({
  title: {
    text: "Website",
    subtext: "Fake Data",
    left: "center",
  },
  tooltip: {
    trigger: "item",
  },
  legend: {
    orient: "vertical",
    left: "left",
  },
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: "50%",
      data: [
        { value: 1048, name: "Search Engine" },
        { value: 735, name: "Direct" },
        { value: 580, name: "Email" },
        { value: 484, name: "Union Ads" },
        { value: 300, name: "Video Ads" },
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: "rgba(0, 0, 0, 0.5)",
        },
      },
    },
  ],
});

const option_2 = ref({
  xAxis: {
    type: "category",
    boundaryGap: false,
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      type: "line",
      areaStyle: {},
    },
  ],
});

userEcharts(option_1, "leftEcharts");
userEcharts(option_2, "rightEcharts");
const userInfoStore = useUserInfoStore();
const styleIcon = {
  width: "80px",
  height: "80px",
  fontSize: "80px",
};
</script>
<template>
  <div class="home-head flex">
    <div class="left card">
      <div class="user-info">
        <div class="user flex">
          <img src="/image/star-squashed.jpg" class="user-img" />
          <div class="user-info flex">
            <div class="user-name">{{ userInfoStore.userName }}</div>
            <div class="user-role">{{ userInfoStore.role }}</div>
          </div>
        </div>
        <div class="user-login-time">上次登录时间 12点13分</div>
      </div>
    </div>
    <div class="right">
      <div class="message flex-align card">
        <SvgIcon
          iconName="#a-businesscard"
          class="icon"
          :styleIcon="styleIcon"
        />
        <div class="message-info">
          <div class="name">user</div>
          <div class="number">155</div>
        </div>
      </div>
      <div class="message flex-align card">
        <SvgIcon
          iconName="#a-chartqushitiaoyantongji"
          class="icon"
          :styleIcon="styleIcon"
        />
        <div class="message-info">
          <div class="name">statistics</div>
          <div class="number">9644</div>
        </div>
      </div>
      <div class="message flex-align card">
        <SvgIcon iconName="#money" class="icon" :styleIcon="styleIcon" />
        <div class="message-info">
          <div class="name">money</div>
          <div class="number">$98444</div>
        </div>
      </div>
    </div>
  </div>
  <div class="home-center flex">
    <div class="left card" id="leftEcharts" />
    <div class="right card" id="rightEcharts" />
  </div>
</template>
<style lang="scss" scoped>
.card {
  padding: 10px;
  background-color: #fff;
  overflow: hidden;
  border-radius: 8px;
  box-shadow: 1px 1px 5px 3px rgba(0, 0, 0, 0.1);
  box-sizing: border-box;
}
.home-head {
  .left {
    margin-right: 10px;
    width: 400px;
    background-color: #fff;
    .user-info {
      .user {
        padding-bottom: 20px;
        border-bottom: 1px solid #b3afaf;
        .user-img {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          // background-color: aqua;
        }
        .user-info {
          flex-direction: column;
          align-items: center;
          justify-content: center;
          margin-left: 5px;
          color: #252424;
          .user-name {
            font-size: 26px;
            font-weight: 900;
          }
          .user-role {
            font-size: 16px;
          }
        }
      }
      .user-login-time {
        margin-top: 10px;
        font-size: 14px;
        color: #b3afaf;
      }
    }
  }
  .right {
    display: flex;
    flex: 1;
    .message {
      flex: 1;
      // align-items: center;

      margin: 0 10px;
      .message-info {
        flex: 1;
        text-align: center;
        .name {
          font-size: 26px;
          color: #b3afaf;
        }
        .number {
          margin-top: 10px;
          font-weight: 900;
        }
      }
    }
  }
}
.home-center {
  margin-top: 10px;
  .left {
    margin-right: 10px;
    width: 400px;
    height: 600px;
  }
  .right {
    flex: 1;
  }
}
</style>
