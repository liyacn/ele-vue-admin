<script setup lang="ts">
import { MenuItem } from '@/types/route'

defineProps<{
  items: MenuItem[]
}>()
</script>

<template>
  <template v-for="item in items" :key="item.name">
    <el-sub-menu v-if="item.sub" :index="item.name">
      <template #title>
        <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
        <span>{{ item.title }}</span>
      </template>
      <RouteMenu :items="item.sub" />
    </el-sub-menu>
    <el-menu-item v-else :route="{ name: item.name }" :index="item.name">
      <el-icon v-if="item.icon"><component :is="item.icon" /></el-icon>
      <span>{{ item.title }}</span>
    </el-menu-item>
  </template>
</template>
