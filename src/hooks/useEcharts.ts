import { watch, onMounted, ref } from "vue";
import * as echarts from "echarts";
type EChartsOption = echarts.EChartsOption;
type EChartsType = echarts.EChartsType;
export default function (
  option: EChartsOption | any,
  element: HTMLElement | string,
) {
  const myChart = ref<EChartsType | null>(null);
  watch(
    () => option,
    () => {
      if (!myChart.value) return;
      myChart.value.setOption(option.value as EChartsOption);
    },
    { immediate: true, deep: true },
  );
  onMounted(() => {
    const elementNode: HTMLElement | null =
      element instanceof Element ? element : document.getElementById(element)!;
    myChart.value = echarts.init(elementNode);
    myChart.value.setOption(option.value as EChartsOption);
  });
}
