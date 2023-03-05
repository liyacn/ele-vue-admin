<script setup lang="ts">
import api from '@/api'
import { CircleClose, UploadFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { ref } from 'vue'

const props = defineProps<{
  src?: string
  clearable?: boolean
}>()
const emit = defineEmits<{
  (e: 'ok', path: string, host: string): void
}>()

const permit = api.uplaodImage.permit()
const source = ref<string>(props.src || '')
const name = ref('')
const loading = ref(false)
const fileRef = ref()

const upload = () => {
  if (!fileRef.value) return
  const file: File = fileRef.value.files[0]
  fileRef.value.value = null
  if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
    ElMessage.warning('图片类型仅支持jpg/png/gif')
    return
  }
  if (file.size > 500 << 10) {
    ElMessage.warning('文件大小不能超过500K')
    return
  }
  api.uplaodImage
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
  <div class="upload-img-box" v-loading="loading">
    <span v-if="source && clearable" class="del" @click="clear">
      <el-icon size="20px"><CircleClose /></el-icon>
    </span>
    <input
      type="file"
      ref="fileRef"
      v-show="false"
      accept="image/jpeg,image/png,image/gif"
      :disabled="!permit"
      @change="upload"
    />
    <img
      v-if="source"
      class="border-img"
      :src="source"
      :title="name"
      alt=""
      @load="sourceLoad"
      @click="fileRef.click()"
      :style="{ cursor: permit ? 'pointer' : 'not-allowed' }"
    />
    <el-button
      v-else
      type="primary"
      size="small"
      :icon="UploadFilled"
      circle
      :disabled="!permit"
      @click="fileRef.click()"
    />
  </div>
</template>

<style scoped>
.upload-img-box {
  position: relative;
  & > .del {
    position: absolute;
    top: -10px;
    right: -10px;
    opacity: 0.2;
    transition: 0.3s;
    &:hover {
      opacity: 1;
    }
  }
}
</style>
