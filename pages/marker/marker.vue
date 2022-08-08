<template>
  <view class="marker">
    <canvas type="webgl" id="webgl" :style="{width:cw+'px', height:ch+'px'}"></canvas>
  </view>
</template>

<script setup>
import Experience from '@/objects/MarkerExperience'
import { onMounted, onUnmounted } from 'vue'

const info = uni.getSystemInfoSync()
const cw = info.windowWidth
const ch = info.windowHeight
const pixelRatio = info.pixelRatio

let experience

onMounted(() => {
  uni.createSelectorQuery().select('#webgl').node().exec(res => {
    const canvas = res[0].node
    canvas.width = cw * pixelRatio / 2
    canvas.height = ch * pixelRatio / 2
    experience = new Experience(canvas)
  })
})

onUnmounted(() => {
  experience.destroy()
})
  
</script>

<style lang="scss">

</style>
