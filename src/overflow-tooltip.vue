<script setup>
import { computed, ref } from 'vue'
const referenceDiv = ref(null)
const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  },
  maxWidth: {
    type: Number,
    default: 100
  },
  isCheckMaxWidth: {
    type: Boolean,
    default: true
  },
  // 多行溢出隐藏的效果
  lineNum: {
    type: Number,
    default: 1
  }
})
const needDisabled = ref(false)
const checkIsShowPopover = () => {
  // 多行的情况下 只需要判断高度是否超出即可
  if (!referenceDiv.value || !props.isCheckMaxWidth) return
  const { width, height } = referenceDiv.value.getBoundingClientRect()
  if (props.lineNum !== 1) {
    // scrollHeight对应的是实际应该渲染的高度
    const realHeight = referenceDiv.value.scrollHeight
    needDisabled.value = height >= realHeight
  } else if (props.isCheckMaxWidth) {
    // 通过获取div节点的getBoundingClientRect属性，拿到div的实际宽度和高度
    needDisabled.value = width < props.maxWidth
  }
}
const computedStyle = computed(() => {
  const maxWidthStr = `max-width: ${props.maxWidth + 'px'};`
  const multiLineStr = `-webkit-line-clamp: ${props.lineNum}`
  return maxWidthStr + (props.lineNum !== 1 ? multiLineStr : '')
})
</script>

<template>
  <el-tooltip :disabled="disabled || needDisabled" v-bind="$attrs">
    <template #content>
      <slot name="content" />
    </template>
    <!-- 这样写的好处是div的宽高会被内容撑开，通过getBoundingClientRect()方法可以
      获得这个div的实际宽高，通过比较实际宽高和设置的最大宽度，就可以判断是否禁用tooltip
     -->
    <div
      :style="computedStyle"
      :class="lineNum === 1 ? 'overflow-hidden' : 'multi-overflow-hidden'"
      ref="referenceDiv"
      @mouseenter="checkIsShowPopover"
      @mouseleave="checkIsShowPopover"
    >
      <slot />
    </div>
  </el-tooltip>
</template>

<style scoped>
.overflow-hidden {
  display: inline-block;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.multi-overflow-hidden {
  display: -webkit-box;
  overflow: hidden;
  -webkit-box-orient: vertical;
  vertical-align: middle;
  word-break: break-all;
}
</style>
