<script setup>
import OverflowTooltip from './overflow-tooltip.vue'
</script>
<template>
  <div>
    <OverflowTooltip :max-width="100" content="展示溢出隐藏的内容">
      单行溢出隐藏溢出隐藏单行溢出隐藏溢出隐藏单行溢出隐藏溢出隐藏
    </OverflowTooltip>
    <hr />
    <OverflowTooltip :max-width="100" content="展示溢出隐藏的内容" :line-num="2">
      多行溢出隐藏多行溢出隐藏多行溢出隐藏多行溢出隐藏多行溢出隐藏多行溢出隐藏多行溢出隐藏
    </OverflowTooltip>
  </div>
</template>

<style scoped></style>
