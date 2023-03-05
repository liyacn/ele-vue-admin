<script setup lang="ts">
import api from '@/api'
import { sys } from '@/router/menu'
import { ElMessage, FormInstance, TreeInstance } from 'element-plus'
import { ListArgs, RoleItem, RoleSaveArgs, SystemAction } from 'models'
import { nextTick, reactive, ref } from 'vue'

const tableData = ref<RoleItem[]>([])
const params = reactive<ListArgs>({
  page: 1,
  size: 10,
})
const total = ref(0)
const loading = ref(true)

const queryData = () => {
  api.roleList
    .do(params, loading)
    .then((res) => {
      total.value = res.total
      tableData.value = res.list
    })
    .catch(api.errorPage)
}

let index = -1
const visible = ref(false)
const formRef = ref<FormInstance>()
const formState = reactive<RoleSaveArgs>({ name: '', actions: [], menus: [] })
const menuTreeRef = ref<TreeInstance>()
const actionTreeRef = ref<TreeInstance>()
const actions = ref<SystemAction[]>([])

const openForm = (item: RoleItem, idx = -1) => {
  index = idx
  formState.id = item.id || undefined
  formState.name = item.name
  visible.value = true
  nextTick(() => {
    menuTreeRef.value?.setCheckedKeys(item.menus)
    actionTreeRef.value?.setCheckedKeys(item.actions)
  })
}

const closeForm = () => {
  visible.value = false
}

const submitForm = () => {
  formRef.value?.validate((valid) => {
    if (!valid) return
    formState.menus = menuTreeRef.value?.getCheckedKeys(true) as string[]
    formState.actions = actionTreeRef.value?.getCheckedKeys(true) as string[]
    api.roleSave
      .do(formState, loading)
      .then(() => {
        if (index == -1) {
          params.page = 1
          queryData()
        } else {
          tableData.value[index].name = formState.name
          tableData.value[index].actions = formState.actions
          tableData.value[index].menus = formState.menus
        }
        ElMessage.success('操作成功')
        closeForm()
      })
      .catch(api.errorMsg)
  })
}

{
  api.sysActionList
    .do({})
    .then((res) => {
      actions.value = res.list
      queryData()
    })
    .catch(api.errorPage)
}
</script>

<template>
  <div v-loading="loading">
    <el-table :data="tableData" border>
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="name" label="名称" />
      <el-table-column>
        <template #header>
          <el-space class="justify">
            <span>操作</span>
            <el-button
              v-if="api.roleSave.permit()"
              type="primary"
              link
              size="small"
              @click="openForm({ id: 0, name: '', actions: [], menus: [] })"
            >
              + 新增
            </el-button>
          </el-space>
        </template>
        <template #default="{ row, $index }">
          <el-button
            v-if="api.roleSave.permit()"
            type="primary"
            size="small"
            @click="openForm(row, $index)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      size="small"
      layout="total, prev, pager, next, sizes, jumper"
      v-model:current-page="params.page"
      v-model:page-size="params.size"
      :total="total"
      @change="queryData"
    />
  </div>

  <el-drawer
    v-model="visible"
    @close="formRef?.clearValidate()"
    :title="(formState.id ? '编辑' : '新增') + `角色`"
    size="800"
  >
    <el-form ref="formRef" :model="formState" v-loading="loading" label-width="80px">
      <el-row>
        <el-col :span="10">
          <el-form-item
            label="角色名称"
            prop="name"
            :rules="[{ required: true, min: 2, message: '请输入最少2个字符', trigger: 'blur' }]"
          >
            <el-input v-model="formState.name" :maxlength="32" />
          </el-form-item>
          <el-form-item label="菜单权限">
            <el-tree
              ref="menuTreeRef"
              :data="sys"
              node-key="name"
              empty-text=""
              :props="{ label: 'title', children: 'sub' }"
              default-expand-all
              show-checkbox
            />
          </el-form-item>
        </el-col>
        <el-col :span="14">
          <el-form-item label="功能权限" style="overflow: hidden">
            <el-tree
              ref="actionTreeRef"
              :data="actions"
              node-key="key_name"
              empty-text=""
              :props="{ children: 'sub' }"
              show-checkbox
            >
              <template #default="{ data }">
                <span :title="data.key_name">{{ data.title }} {{ data.key_name }}</span>
              </template>
            </el-tree>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="center">
        <el-button type="primary" @click="submitForm">确定</el-button>
        <el-button @click="closeForm">取消</el-button>
      </div>
    </el-form>
  </el-drawer>
</template>
