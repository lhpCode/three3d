import { reactive, ref } from "vue";
const deviceOnlineData = reactive({
  online: 100,
  downline: 25,
});
const deviceOnlineOption = ref({
  title: {
    text: "设备在线数",
    subtext: `${((deviceOnlineData.online / (deviceOnlineData.online + deviceOnlineData.downline)) * 100).toFixed(2)}%`,
    left: "center",
    top: "center",
    textStyle: {
      color: "#fff",
      fontSize: "14px",
    },
    subtextStyle: {
      color: "#fff",
      fontSize: "12px",
    },
  },
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: ["75%", "85%"],
      avoidLabelOverlap: false,
      label: {
        show: false,
        position: "center",
      },
      data: [
        {
          value: deviceOnlineData.online,
          name: "Search Engine",
          itemStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "#015dbd", // 渐变起点颜色
                },
                {
                  offset: 1,
                  color: "#3fb1ca", // 渐变终点颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
        {
          value: deviceOnlineData.downline,
          name: "Direct",
          itemStyle: {
            color: "#58606a",
          },
        },
      ],
    },
  ],
});

const data = [
  ["06-05", 16],
  ["06-06", 29],
  ["06-07", 35],
  ["06-08", 6],
  ["06-09", 3],
  ["06-10", 5],
  ["06-11", 3],
  ["06-12", 8],
  ["06-13", 2],
  ["06-14", 30],
  ["06-15", 45],
  ["06-16", 39],
  ["06-17", 15],
  ["06-18", 11],
  ["06-19", 9],
  ["06-20", 6],
  ["06-21", 37],
  ["06-22", 28],
  ["06-23", 5],
  ["06-24", 4],
  ["06-25", 1],
  ["06-26", 6],
  ["06-27", 4],
  ["06-28", 3],
  ["06-29", 5],
  ["06-30", 3],
  ["07-01", 3],
  ["07-02", 25],
  ["07-03", 7],
  ["07-04", 2],
  ["07-05", 4],
  ["07-06", 2],
  ["07-07", 6],
  ["07-08", 7],
  ["07-09", 6],
  ["07-10", 1],
  ["07-11", 2],
  ["07-12", 13],
  ["07-13", 7],
  ["07-14", 31],
  ["07-15", 11],
  ["07-16", 4],
  ["07-17", 9],
  ["07-18", 8],
  ["07-19", 7],
  ["07-20", 3],
  ["07-21", 11],
  ["07-22", 7],
  ["07-23", 5],
  ["07-24", 0],
];
const dateList = data.map(function (item) {
  return item[0];
});
const valueList = data.map(function (item) {
  return item[1];
});
const numberOfAlarmsOption = ref({
  visualMap: [
    {
      show: false,
      type: "continuous",
      seriesIndex: 0,
      min: 0,
      max: 30,
    },
  ],
  tooltip: {
    trigger: "axis",
  },
  xAxis: [
    {
      data: dateList,
      axisLabel: {
        show: true,
        textStyle: {
          color: "#ffffff",
        },
      },
    },
  ],
  yAxis: [
    {
      axisLabel: {
        show: true,
        textStyle: {
          color: "#ffffff",
        },
      },
    },
  ],
  grid: [
    {
      top: "10%",
      left: "10%",
      bottom: "10%",
    },
  ],
  series: [
    {
      type: "line",
      showSymbol: false,
      data: valueList,
    },
  ],
});

const distributeOption = ref({
  radar: {
    indicator: [
      { name: "电压报警", max: 50 },
      { name: "湿度过高", max: 50 },
      { name: "低温报警", max: 50 },
      { name: "高温报警", max: 50 },
      { name: "其他", max: 50 },
    ],
  },
  series: [
    {
      name: "Budget vs spending",
      type: "radar",
      data: [
        {
          value: [40, 25, 40, 10, 30, 20],
        },
      ],
      lineStyle: {
        color: "#08bec9", // 例如：'#ff0000' 为红色
      },
      itemStyle: {
        color: "#08bec9",
      },
      areaStyle: {
        color: "#08bec9", // 例如：'rgba(255, 0, 0, 0.5)' 为半透明红色
      },
    },
  ],
});
export default function () {
  return {
    deviceOnlineData,
    deviceOnlineOption,
    numberOfAlarmsOption,
    distributeOption,
  };
}
