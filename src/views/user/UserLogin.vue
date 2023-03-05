<script setup lang="ts">
import api from '@/api'
import { useCoreStore } from '@/stores/core'
import { Key, Lock, User } from '@element-plus/icons-vue'
import { Action, ElMessageBox, FormInstance } from 'element-plus'
import { LoginArgs } from 'models'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'

const formRef = ref<FormInstance>()
const formState = reactive<LoginArgs>({
  username: '',
  password: '',
  captcha: '',
  session_key: '',
})
const loading = ref(false)
const disabled = ref(false)
const base64_image = ref('')
const router = useRouter()
const store = useCoreStore()

const submitForm = () => {
  formRef.value?.validate((valid) => {
    if (!valid) return
    api.login
      .do(formState, loading)
      .then((res) => {
        store.setAuth({
          token: res.token,
          user: res.username,
          super: res.is_super,
          actions: res.actions,
          menus: res.menus,
        })
        if (res.pwd_tip) {
          ElMessageBox.confirm(res.pwd_tip, '', {
            type: 'warning',
            showClose: false,
            callback: (act: Action) => {
              if (act === 'confirm') {
                router.push('/password')
              } else {
                router.push('/')
              }
            },
          })
        } else {
          router.push('/')
        }
      })
      .catch(api.errorMsg)
  })
}

const getCaptcha = () => {
  api.captcha
    .do({}, disabled)
    .then((res) => {
      formState.session_key = res.session_key
      base64_image.value = res.base64_image
    })
    .catch(api.errorMsg)
}
</script>

<template>
  <div class="login-bg">
    <el-form
      ref="formRef"
      :model="formState"
      @keyup.enter="submitForm"
      size="large"
      class="login-form"
    >
      <div class="center">
        <img src="@/assets/logo.svg" width="50" height="50" alt="" />
      </div>
      <br />

      <el-form-item
        prop="username"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <el-input
          v-model="formState.username"
          :prefix-icon="User"
          placeholder="用 户 名"
          :maxlength="32"
        />
      </el-form-item>

      <el-form-item
        prop="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <el-input
          v-model="formState.password"
          :prefix-icon="Lock"
          type="password"
          autocomplete="new-password"
          placeholder="密 码"
          :maxlength="32"
          show-password
        />
      </el-form-item>

      <el-form-item
        prop="captcha"
        :rules="[{ required: true, message: 'Please input the captcha!' }]"
      >
        <el-input
          v-model="formState.captcha"
          :disabled="!formState.session_key"
          :prefix-icon="Key"
          placeholder=" 验 证 码"
          :maxlength="6"
        >
          <template #append>
            <el-button :disabled="disabled" @click="getCaptcha" style="padding: 0">
              <img
                class="captcha"
                :src="'data:image/jpg;base64,' + base64_image"
                title="点 击 获 取"
                alt="点 击 获 取"
              />
            </el-button>
          </template>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="submitForm" :loading="loading" class="full-width">
          登 录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.login-bg {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--el-fill-color) url('@/assets/bg.svg') no-repeat;
  background-position: center 30px;
  background-size: 90%;
}
.login-form {
  width: 330px;
}
.captcha {
  min-width: 90px;
  height: 38px;
  &::before {
    content: attr(alt);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: white;
  }
}
</style>
