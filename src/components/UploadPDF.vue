<script setup lang="ts">
import api from '@/api'
import { DeleteFilled, UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const props = defineProps<{
  src?: string
  clearable?: boolean
}>()
const emit = defineEmits<{
  (e: 'ok', path: string, host: string): void
}>()

const permit = api.uplaodPDF.permit()
const source = ref<string>(props.src || '')
const name = ref('')
const loading = ref(false)
const fileRef = ref()

const upload = () => {
  if (!fileRef.value) return
  const file: File = fileRef.value.files[0]
  fileRef.value.value = null
  if (file.type !== 'application/pdf') {
    ElMessage.warning('文件类型仅支持pdf文档')
    return
  }
  if (file.size > 1 << 20) {
    ElMessage.warning('文件大小不能超过1M')
    return
  }
  api.uplaodPDF
    .do({ file }, loading)
    .then((res) => {
      //source.value = res.host + res.path;
      source.value = URL.createObjectURL(file)
      name.value = file.name
      emit('ok', res.path, res.host)
    })
    .catch(api.errorMsg)
}

const clear = () => {
  source.value = ''
  emit('ok', '', '')
}

const sourceLoad = () => {
  URL.revokeObjectURL(source.value)
}

{
  if (source.value) {
    try {
      const url = new URL(source.value)
      emit('ok', url.pathname, url.origin)
      name.value = url.pathname
    } catch {
      void 0
    }
  }
}
</script>

<template>
  <div class="full-width" v-loading="loading">
    <input
      type="file"
      ref="fileRef"
      v-show="false"
      accept="application/pdf"
      :disabled="!permit"
      @change="upload"
    />
    <el-button
      type="primary"
      size="small"
      :icon="UploadFilled"
      circle
      :disabled="!permit"
      @click="fileRef.click()"
    />
    <el-button
      v-if="props.clearable && source"
      type="danger"
      size="small"
      :icon="DeleteFilled"
      circle
      @click="clear"
    />
    <br />
    <object
      v-if="source"
      :data="source"
      :title="name"
      type="application/pdf"
      class="full-width"
      @load="sourceLoad"
    ></object>
  </div>
</template>
