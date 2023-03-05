<script setup lang="ts">
import { ResultProps } from 'element-plus'

defineProps<{
  icon: ResultProps['icon']
  title: ResultProps['title']
  subTitle: ResultProps['subTitle']
}>()
</script>

<template>
  <el-result :icon="icon" :title="title" :sub-title="subTitle">
    <template #extra>
      <el-button type="primary" @click="$router.push('/')">Back</el-button>
    </template>
  </el-result>
</template>
