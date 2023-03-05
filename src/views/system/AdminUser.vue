<script setup lang="ts">
import api from '@/api'
import { TableInstance, buildTable } from '@/types/table'
import rand from '@/utils/rand'
import { ElMessage, FormInstance } from 'element-plus'
import {
  AdminCreateArgs,
  AdminItem,
  AdminListArgs,
  AdminSetPwdArgs,
  AdminSetRoleArgs,
  OptionItem,
} from 'models'
import { reactive, ref } from 'vue'

const roleList = ref<OptionItem[]>([])
const roleOpt = ref<TableInstance<number, string>>()
const tableData = ref<AdminItem[]>([])
const params = reactive<AdminListArgs>({
  page: 1,
  size: 10,
  role_id: 0,
  username: '',
  status: 0,
})
const total = ref(0)
const loading = ref(true)

const queryData = () => {
  api.adminList
    .do(params, loading)
    .then((res) => {
      total.value = res.total
      tableData.value = res.list
    })
    .catch(api.errorPage)
}

const searchFormRef = ref<FormInstance>()
const searchFormState = reactive({
  role_id: 0,
  username: '',
  status: 0,
})
const submitSearch = () => {
  params.role_id = searchFormState.role_id
  params.username = searchFormState.username
  params.status = searchFormState.status
  params.page = 1
  queryData()
}

const setStatus = (id: number, status: number, idx: number) => {
  api.adminSetStatus
    .do({ id: id, status: status }, loading)
    .then(() => {
      tableData.value[idx].status = status
      ElMessage.success('操作成功！')
    })
    .catch(api.errorMsg)
}

let index = -1
const user = ref('')
const roleVisible = ref(false)
const roleFormRef = ref<FormInstance>()
const roleFormState = reactive<AdminSetRoleArgs>({ id: 0, role_id: 0 })

const openRole = (item: AdminItem, idx: number) => {
  index = idx
  user.value = item.username
  roleFormState.id = item.id
  roleFormState.role_id = item.role_id
  roleVisible.value = true
}
const closeRole = () => {
  roleVisible.value = false
}
const submitRole = () => {
  roleFormRef.value?.validate((valid) => {
    if (!valid) return
    api.adminSetRole
      .do(roleFormState, loading)
      .then(() => {
        tableData.value[index].role_id = roleFormState.role_id
        ElMessage.success('变更成功')
        closeRole()
      })
      .catch(api.errorMsg)
  })
}

const pwdVisible = ref(false)
const pwdFormRef = ref<FormInstance>()
const pwdFormState = reactive<AdminSetPwdArgs>({ id: 0, password: '' })

const openPwd = (item: AdminItem) => {
  user.value = item.username
  pwdFormState.id = item.id
  pwdVisible.value = true
}
const closePwd = () => {
  pwdVisible.value = false
}
const submitPwd = () => {
  pwdFormRef.value?.validate((valid) => {
    if (!valid) return
    api.adminSetPwd
      .do(pwdFormState, loading)
      .then(() => {
        ElMessage.success('重置成功')
        closePwd()
      })
      .catch(api.errorMsg)
  })
}

const addVisible = ref(false)
const addFormRef = ref<FormInstance>()
const addFormState = reactive<AdminCreateArgs>({ username: '', password: '', role_id: 0 })
const closeAdd = () => {
  addVisible.value = false
}
const submitAdd = () => {
  addFormRef.value?.validate((valid) => {
    if (!valid) return
    api.adminCreate
      .do(addFormState, loading)
      .then(() => {
        ElMessage.success('创建成功')
        searchFormRef.value?.resetFields()
        submitSearch()
        closeAdd()
      })
      .catch(api.errorMsg)
  })
}

{
  api.roleOption
    .do({})
    .then((res) => {
      roleList.value = res.list
      roleOpt.value = buildTable(res.list)
      queryData()
    })
    .catch(api.errorPage)
}
</script>

<template>
  <div v-loading="loading">
    <el-form ref="searchFormRef" :model="searchFormState" inline>
      <el-form-item label="用户名" prop="username">
        <el-input
          v-model="searchFormState.username"
          :maxlength="32"
          placeholder="可根据前缀模糊查询"
        />
      </el-form-item>
      <el-form-item label="角色" prop="role_id">
        <el-select v-model="searchFormState.role_id" style="width: 100px" filterable>
          <el-option label="全部" :value="0" />
          <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="searchFormState.status" style="width: 80px">
          <el-option label="全部" :value="0" />
          <el-option v-for="[k, v] in $table.status.mapping()" :key="k" :label="v" :value="k" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitSearch">查询</el-button>
        <el-button @click="searchFormRef?.resetFields()">清空</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" border>
      <el-table-column prop="id" label="ID" :width="80" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="role_id" label="角色">
        <template #default="{ row }">
          {{ row.is_super ? '超级管理员' : roleOpt?.render(row.role_id) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" :width="80">
        <template #default="{ row }">
          <el-tag :type="$table.statusType.render(row.status)">
            {{ $table.status.render(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :width="242">
        <template #header>
          <el-space class="justify">
            <span>操作</span>
            <el-button
              v-if="api.adminCreate.permit()"
              type="primary"
              link
              size="small"
              @click="addVisible = true"
            >
              + 新增
            </el-button>
          </el-space>
        </template>
        <template #default="{ row, $index }">
          <span v-if="!row.is_super">
            <template v-for="[k, v] in $table.status.mapping()" :key="k">
              <el-popconfirm
                v-if="row.status !== k && api.adminSetStatus.permit()"
                :title="`确定要${v}账号『${row.username}』吗？`"
                cancel-button-type="default"
                width="auto"
                @confirm="setStatus(row.id, k, $index)"
              >
                <template #reference>
                  <el-button :type="$table.statusType.render(k)" size="small">
                    {{ v }}
                  </el-button>
                </template>
              </el-popconfirm>
            </template>
            <el-button
              v-if="api.adminSetRole.permit()"
              type="primary"
              size="small"
              @click="openRole(row, $index)"
            >
              变更角色
            </el-button>
            <el-button
              v-if="api.adminSetPwd.permit()"
              type="warning"
              size="small"
              @click="openPwd(row)"
            >
              重置密码
            </el-button>
          </span>
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

  <el-drawer v-model="roleVisible" @close="roleFormRef?.resetFields()" title="变更角色">
    <el-form ref="roleFormRef" :model="roleFormState" v-loading="loading" label-width="70px">
      <el-form-item label="用户名">
        <span>{{ user }}</span>
      </el-form-item>
      <el-form-item
        label="角色"
        prop="role_id"
        :rules="[{ required: true, type: 'number', min: 1, message: '请选择角色!' }]"
      >
        <el-select v-model="roleFormState.role_id" filterable style="width: 100%">
          <el-option :value="0" label="请选择" disabled />
          <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitRole">确定</el-button>
        <el-button @click="closeRole">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>

  <el-drawer v-model="pwdVisible" @close="pwdFormRef?.resetFields()" title="重置密码">
    <el-form ref="pwdFormRef" :model="pwdFormState" v-loading="loading" label-width="70px">
      <el-form-item label="用户名">
        <span>{{ user }}</span>
      </el-form-item>
      <el-form-item
        label="新密码"
        prop="password"
        :rules="[{ required: true, min: 6, message: '请输入至少6字符的新密码!' }]"
      >
        <el-input v-model="pwdFormState.password" :maxlength="32">
          <template #append>
            <el-button @click="pwdFormState.password = rand.strings()">生成</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitPwd">确定</el-button>
        <el-button @click="closePwd">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>

  <el-drawer v-model="addVisible" @close="addFormRef?.resetFields()" title="新增用户" size="450">
    <el-form ref="addFormRef" :model="addFormState" v-loading="loading" label-width="80px">
      <el-form-item
        label="用户名"
        prop="username"
        :rules="[{ required: true, min: 6, message: '请输入至少6字符的用户名!' }]"
      >
        <el-input v-model="addFormState.username" :maxlength="32" />
      </el-form-item>
      <el-form-item
        label="初始密码"
        prop="password"
        :rules="[{ required: true, min: 6, message: '请输入至少6字符的密码!' }]"
      >
        <el-input v-model="addFormState.password" :maxlength="32">
          <template #append>
            <el-button @click="addFormState.password = rand.strings()">生成</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="角色"
        prop="role_id"
        :rules="[{ required: true, type: 'number', min: 1, message: '请选择角色!' }]"
      >
        <el-select v-model="addFormState.role_id" filterable style="width: 100%">
          <el-option :value="0" label="请选择" disabled />
          <el-option v-for="item in roleList" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitAdd">确定</el-button>
        <el-button @click="closeAdd">取消</el-button>
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
