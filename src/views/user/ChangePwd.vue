<script setup lang="ts">
import api from '@/api'
import { ElMessage, FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'

const validatePass = (_: unknown, value: string, callback: (error?: string) => void) => {
  if (value === '') {
    callback('Please input the password!')
  } else if (value.length < 6) {
    callback('Please input at least 6 chars!')
  } else {
    if (formState.checkPwd !== '') {
      formRef.value?.validateField('checkPwd')
    }
    callback()
  }
}
const validatePass2 = (_: unknown, value: string, callback: (error?: string) => void) => {
  if (value === '') {
    callback('Please input the password again!')
  } else if (value !== formState.password) {
    callback("Two inputs don't match!")
  } else {
    callback()
  }
}
const rules = {
  password: [{ validator: validatePass, trigger: 'blur' }],
  checkPwd: [{ validator: validatePass2, trigger: 'blur' }],
}

const formRef = ref<FormInstance>()
const formState = reactive({
  password: '',
  checkPwd: '',
})
const loading = ref(false)

const resetForm = () => {
  formRef.value?.resetFields()
}

const submitForm = () => {
  formRef.value?.validate((valid) => {
    if (!valid) return
    api.changePwd
      .do({ password: formState.password }, loading)
      .then(() => {
        ElMessage.success('修改成功！')
        resetForm()
      })
      .catch(api.errorMsg)
  })
}
</script>

<template>
  <el-form
    ref="formRef"
    :model="formState"
    :rules="rules"
    v-loading="loading"
    status-icon
    label-width="120px"
    style="width: 500px"
  >
    <el-form-item label="新密码" prop="password">
      <el-input
        v-model="formState.password"
        type="password"
        :maxlength="32"
        autocomplete="new-password"
      />
    </el-form-item>
    <el-form-item label="确认密码" prop="checkPwd">
      <el-input v-model="formState.checkPwd" type="password" :maxlength="32" autocomplete="off" />
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">确定</el-button>
      <el-button @click="resetForm">取消</el-button>
    </el-form-item>
  </el-form>
</template>
