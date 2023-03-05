<script setup lang="ts">
import api from '@/api'
import { ArrowDownBold, ArrowUpBold } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const loading = ref(false)
const plainText = ref('')
const cipherText = ref('')
const cipherPattern = /^[a-zA-Z\d+/]+={0,2}$/

const encrypt = () => {
  cipherText.value = ''
  api.cryptoEecrypt
    .do({ text: plainText.value.trim() }, loading)
    .then((res) => {
      cipherText.value = res.result
    })
    .catch(api.errorMsg)
}
const decrypt = () => {
  const text = cipherText.value.trim()
  if ((text.length & 3) !== 0 || !cipherPattern.test(text)) {
    ElMessage.warning('密文格式错误')
    return
  }
  plainText.value = ''
  api.cryptoDecrypt
    .do({ text }, loading)
    .then((res) => {
      plainText.value = res.result
    })
    .catch(api.errorMsg)
}
</script>

<template>
  <el-form v-loading="loading" label-width="80px" style="width: 500px">
    <el-form-item label="明文">
      <el-input v-model="plainText" :rows="3" type="textarea" :maxlength="100" />
    </el-form-item>
    <el-form-item label-width="230px">
      <el-button
        type="primary"
        :icon="ArrowDownBold"
        round
        @click="encrypt"
        :disabled="plainText.trim().length < 2 || !api.cryptoEecrypt.permit()"
      />
      <el-button
        :icon="ArrowUpBold"
        round
        @click="decrypt"
        :disabled="cipherText.trim().length < 4 || !api.cryptoDecrypt.permit()"
      />
    </el-form-item>
    <el-form-item label="密文">
      <el-input v-model="cipherText" :rows="5" type="textarea" :maxlength="400" />
    </el-form-item>
  </el-form>
</template>
