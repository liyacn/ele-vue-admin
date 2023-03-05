<script setup lang="ts">
import api from '@/api'
import { Delete, Plus, ZoomIn } from '@element-plus/icons-vue'
import { ElMessage, UploadProps, UploadUserFile } from 'element-plus'
import { ref } from 'vue'

const props = defineProps<{
  urls?: string[]
  limit?: number
}>()
const emit = defineEmits<{
  (e: 'ok', paths: string[]): void
}>()

const fileList = ref<UploadUserFile[]>([])
const visible = ref(false)
const previewSrc = ref('')

const changeFile = () => {
  const paths: string[] = []
  fileList.value.forEach((item) => {
    if (item.status === 'success' && item.response) {
      paths.push(item.response as string)
    }
  })
  emit('ok', paths)
}

const remove = (index: number) => {
  fileList.value.splice(index, 1)
  changeFile()
}

const onPreview: UploadProps['onPreview'] = (file) => {
  previewSrc.value = file.url!
  visible.value = true
}

const onExceed: UploadProps['onExceed'] = () => {
  ElMessage.warning(`最多上传${props.limit}张图片`)
}

const beforeUpload: UploadProps['beforeUpload'] = (file) => {
  if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
    ElMessage.warning('图片类型仅支持jpg/png/gif')
    return false
  }
  if (file.size > 500 << 10) {
    ElMessage.warning('文件大小不能超过500K')
    return false
  }
  return true
}

const httpRequest: UploadProps['httpRequest'] = (option) =>
  new Promise((resolve, reject) => {
    api.uplaodImage
      .do({ file: option.file })
      .then((res) => {
        resolve(res.path)
      })
      .catch((err) => {
        const text = api.errorText(err)
        reject(text)
        ElMessage.error(text)
      })
  })

{
  if (props.urls && props.urls.length > 0) {
    const paths: string[] = []
    props.urls.forEach((item, index) => {
      try {
        const u = new URL(item)
        paths.push(u.pathname)
        fileList.value.push({ name: u.pathname, url: item, uid: index, response: u.pathname })
      } catch {
        void 0
      }
    })
    emit('ok', paths)
  }
}
</script>

<template>
  <drag-sort
    tag="ul"
    class="el-upload-list el-upload-list--picture-card"
    v-model="fileList"
    item-key="uid"
    @end="changeFile"
  >
    <template #item="{ element, index }">
      <li
        class="el-upload-list__item"
        v-loading="element.status !== 'success'"
        :title="element.name"
      >
        <img class="el-upload-list__item-thumbnail" :src="element.url" alt="" />
        <span class="el-upload-list__item-actions">
          <span class="el-upload-list__item-preview" @click="onPreview(element)">
            <el-icon><ZoomIn /></el-icon>
          </span>
          <span class="el-upload-list__item-delete" @click="remove(index)">
            <el-icon><Delete /></el-icon>
          </span>
        </span>
      </li>
    </template>
    <template #footer>
      <el-upload
        v-show="api.uplaodImage.permit() && (!limit || fileList.length < limit)"
        multiple
        accept="image/jpeg,image/png,image/gif"
        :on-success="changeFile"
        :on-exceed="onExceed"
        :before-upload="beforeUpload"
        v-model:file-list="fileList"
        list-type="picture-card"
        :http-request="httpRequest"
        :limit="limit"
        :show-file-list="false"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>
    </template>
  </drag-sort>
  <el-dialog v-model="visible" class="center">
    <img class="border-img" :src="previewSrc" alt="" />
  </el-dialog>
</template>

<style scoped>
.el-upload-list__item-actions:active {
  cursor: move;
}
</style>
