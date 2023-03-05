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

const permit = api.uplaodVideo.permit()
const source = ref<string>(props.src || '')
const name = ref('')
const loading = ref(false)
const fileRef = ref()

const upload = () => {
  if (!fileRef.value) return
  const file: File = fileRef.value.files[0]
  fileRef.value.value = null
  if (!['video/mp4', 'video/webm', 'video/ogg'].includes(file.type)) {
    ElMessage.warning('视频类型仅支持mp4/webm/ogv')
    return
  }
  if (file.size > 5 << 20) {
    ElMessage.warning('文件大小不能超过5M')
    return
  }
  api.uplaodVideo
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
      accept="video/mp4,video/webm,video/ogg"
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
    <video
      v-if="source"
      :src="source"
      :title="name"
      controls
      class="auto-width"
      @canplaythrough="sourceLoad"
    >
      当前浏览器不支持内嵌视频
    </video>
  </div>
</template>
