<script setup lang="ts">
import TagsInput from '@/components/TagsInput.vue'
import UploadImage from '@/components/UploadImage.vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import { ElNotification } from 'element-plus'
import { reactive, ref } from 'vue'

type Content = {
  type: number
  value: string
}
type FormState = {
  title: string
  tags: string[]
  content: Content[]
}

type Part = Content & { uid: number }
const partList = ref<Part[]>([])

const formState = reactive<FormState>({
  title: '',
  tags: [],
  content: [],
})

const typeMap = new Map([
  [1, '文本'],
  [2, '图片'],
])

const addItem = (t: number) => {
  partList.value.push({ type: t, value: '', uid: Date.now() })
}
const delItem = (index: number) => {
  partList.value.splice(index, 1)
}
const submitForm = () => {
  const content: Content[] = []
  partList.value.forEach((item) => {
    content.push({ type: item.type, value: item.value })
  })
  formState.content = content
  ElNotification({ message: JSON.stringify(formState) })
}

{
  const data = {
    title: '标题',
    tags: ['tag1', 'tag2', 'tag3'],
    content: [
      { type: 1, value: '文段。。。' },
      { type: 2, value: 'https://element-plus.org/apple-touch-icon.png' },
    ],
  } // mock fetch data
  formState.title = data.title
  formState.tags = data.tags
  data.content.forEach((item, index) => {
    partList.value.push({
      type: item.type,
      value: item.value,
      uid: index,
    })
  })
}
</script>

<template>
  <el-form label-width="120px" style="width: 600px">
    <el-form-item label="标题">
      <el-input v-model="formState.title" clearable />
    </el-form-item>
    <el-form-item label="关键词">
      <TagsInput
        :values="formState.tags"
        :limit="5"
        :maxlength="10"
        @ok="(values) => (formState.tags = values)"
      />
    </el-form-item>
    <el-divider border-style="dashed" />
    <drag-sort v-model="partList" item-key="uid">
      <template #item="{ element, index }">
        <el-form-item class="drag">
          <template #label>
            <el-button :icon="Delete" @click="delItem(index)">
              {{ typeMap.get(element.type) }}
            </el-button>
          </template>
          <el-input v-if="element.type === 1" v-model="element.value" type="textarea" :rows="3" />
          <UploadImage
            v-else-if="element.type === 2"
            :src="element.value"
            @ok="(path) => (element.value = path)"
          />
        </el-form-item>
      </template>
    </drag-sort>
    <el-form-item>
      <el-button v-for="[k, v] in typeMap" :key="k" type="primary" :icon="Plus" @click="addItem(k)">
        {{ v }}
      </el-button>
    </el-form-item>
    <el-divider border-style="dashed" />
    <el-form-item>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </el-form-item>
  </el-form>
</template>
