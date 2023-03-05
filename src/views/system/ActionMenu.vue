<script setup lang="ts">
import api from '@/api'
import { sys } from '@/router/menu'
import { EditPen, Refresh } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { SystemAction, SystemActionSub, SystemActionUpdateArgs } from 'models'
import { reactive, ref } from 'vue'

const disabled = ref(false)
const loading = ref(true)
const actions = ref<SystemAction[]>([])

const sync = () => {
  api.sysActionSync
    .do({}, disabled)
    .then((res) => {
      actions.value = res.list
      ElMessage.success('同步成功')
    })
    .catch(api.errorMsg)
}

const visible = ref(false)
const formState = reactive<SystemActionUpdateArgs>({ key_name: '', title: '', sort: 0 })
let row: SystemActionSub = {
  key_name: '',
  title: '',
  sort: 0,
}
const edit = (item: SystemAction) => {
  row = item
  formState.key_name = item.key_name
  formState.title = item.title
  formState.sort = item.sort
  visible.value = true
}

const submitForm = () => {
  api.sysActionUpdate
    .do(formState, loading)
    .then(() => {
      row.title = formState.title
      row.sort = formState.sort
      visible.value = false
    })
    .catch(api.errorMsg)
}

{
  api.sysActionList
    .do({}, loading)
    .then((res) => {
      actions.value = res.list
    })
    .catch(api.errorPage)
}
</script>

<template>
  <el-row v-loading="loading">
    <el-col :span="8">
      <el-button
        v-if="api.sysActionSync.permit()"
        type="primary"
        :icon="Refresh"
        @click="sync"
        :loading="disabled"
        style="margin-bottom: 16px"
      >
        全量同步
      </el-button>
      <el-tree
        :data="sys"
        node-key="name"
        empty-text=""
        :props="{ label: 'title', children: 'sub' }"
        default-expand-all
      />
    </el-col>
    <el-col :span="16">
      <el-table :data="actions" row-key="key_name" :tree-props="{ children: 'sub' }" border>
        <el-table-column prop="key_name" label="接口路径" sortable />
        <el-table-column prop="title" label="名称备注" />
        <el-table-column prop="sort" label="排序" sortable :width="80" />
        <el-table-column label="操作" :width="60" v-if="api.sysActionUpdate.permit()">
          <template #default="{ row }">
            <el-button type="primary" size="small" :icon="EditPen" circle @click="edit(row)" />
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>

  <el-drawer v-model="visible">
    <el-form :model="formState" v-loading="loading" label-width="70px">
      <el-form-item label="接口路径">
        <span>{{ row.key_name }}</span>
      </el-form-item>
      <el-form-item label="名称备注">
        <el-input v-model="formState.title" :maxlength="16" />
      </el-form-item>
      <el-form-item label="排序">
        <el-input-number
          v-model="formState.sort"
          :min="0"
          :max="9999"
          :precision="0"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button @click="visible = false">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
