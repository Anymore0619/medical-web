<template>
  <ProCard class="home">
    <div class="flex justify-around items-center">
      <div class="flex flex-col">
        <ProText class="!text-xl !mb-2" type="primary">{{ allDeviceNumber.lampCount }}</ProText>
        <ProText class="!text-lg">路灯总数</ProText>
      </div>
      <div class="flex flex-col">
        <ProText class="!text-xl !mb-2" type="primary">{{ allDeviceNumber.controlCount }}</ProText>
        <ProText class="!text-lg">控制设备总数</ProText>
      </div>
      <div class="flex flex-col">
        <ProText class="!text-xl !mb-2" type="primary">
          {{ allDeviceNumber.terminalCount }}
        </ProText>
        <ProText class="!text-lg">终端设备总数</ProText>
      </div>
    </div>
    <ProDivider />
    <div class="flex flex-1">
      <Echart class="w-1/2" :height="400" :options="roadLampTypeNumberStatisticsChartOptions" />
      <Echart class="w-1/2" :height="400" :options="lampTypeNumberStatisticsChartOptions" />
    </div>
  </ProCard>
</template>

<script setup lang="ts">
import {
  getAllDeviceNumberApi,
  getRoadLampTypeNumberStatisticsApi,
  getLampTypeNumberStatisticsApi
} from '@/api/home'
import { Echart } from '@/components/Echart'
import { reactive, onMounted } from 'vue'
import type { EChartsOption } from 'echarts'

onMounted(() => {
  getAllDeviceNumber()
  getRoadLampTypeNumberStatistics()
  getLampTypeNumberStatistics()
})
/* 获取所有设备数量 */
const getAllDeviceNumber = async () => {
  const res = await getAllDeviceNumberApi()
  if (res) {
    Object.assign(allDeviceNumber, res.data)
  }
}
/* 获取路灯类型数量统计 */
const getRoadLampTypeNumberStatistics = async () => {
  const res = await getRoadLampTypeNumberStatisticsApi()
  if (res) {
    ;(roadLampTypeNumberStatisticsChartOptions.xAxis! as any).data = res.data.map(
      (item) => item['类别']
    )
    roadLampTypeNumberStatisticsChartOptions.series![0].data = res.data.map(
      (item) => item['路灯杆数量']
    )
    roadLampTypeNumberStatisticsChartOptions.series![1].data = res.data.map(
      (item) => item['光源数量']
    )
    roadLampTypeNumberStatisticsChartOptions.series![2].data = res.data.map(
      (item) => item['接线井个数']
    )
    console.log(roadLampTypeNumberStatisticsChartOptions)
  }
}
/* 获取光源类型数量统计 */
const getLampTypeNumberStatistics = async () => {
  const res = await getLampTypeNumberStatisticsApi()
  if (res) {
    lampTypeNumberStatisticsChartOptions.series![0].data = res.data.map((item) => {
      return {
        name: item['光源类型'],
        value: item['光源数量']
      }
    })
  }
}
/* 所有设备数量 */
const allDeviceNumber = reactive({
  terminalCount: 0,
  controlCount: 0,
  lampCount: 0
})
/* 路灯类型数量统计图表选项 */
const roadLampTypeNumberStatisticsChartOptions: EChartsOption = reactive({
  title: {
    text: '路灯类型信息',
    subtext: '',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: 'bottom',
    left: 'center'
  },
  xAxis: {
    type: 'category',
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '路灯杆数量',
      type: 'bar',
      data: []
    },
    {
      name: '光源数量',
      type: 'bar',
      data: []
    },
    {
      name: '接线井个数',
      type: 'bar',
      data: []
    }
  ]
})
/* 光源类型数量统计图表选项 */
const lampTypeNumberStatisticsChartOptions: EChartsOption = reactive({
  title: {
    text: '光源数量',
    subtext: '',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  legend: {
    top: 'bottom',
    left: 'center'
  },
  series: [
    {
      type: 'pie',
      radius: '70%',
      data: [],
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      labelLine: {
        show: false
      }
    }
  ]
})
</script>
