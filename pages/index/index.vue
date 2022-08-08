<template>
	<view class="home">
    <canvas type="webgl" id="webgl" :style="{width:cw+'px', height:ch+'px'}" @touchend="handleTouch"></canvas>
	</view>
</template>

<script setup>
import Experience from '@/objects/Experience'
import { onMounted, onUnmounted } from 'vue'

const info = uni.getSystemInfoSync()
const cw = info.windowWidth
const ch = info.windowHeight
const pixelRatio = info.pixelRatio

let experience

const handleTouch = ((e) => {
  const touches = e.changedTouches.length ? e.changedTouches : e.touches
  if (touches.length === 1) {
    const touch = touches[0]
    experience.addModel(touch.x, touch.y)
  }
})

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
