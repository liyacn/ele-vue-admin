<script setup lang="ts">
import GroupInput from '@/components/GroupInput.vue'
import UploadAudio from '@/components/UploadAudio.vue'
import UploadImage from '@/components/UploadImage.vue'
import UploadPDF from '@/components/UploadPDF.vue'
import UploadPictures from '@/components/UploadPictures.vue'
import UploadVideo from '@/components/UploadVideo.vue'
import { ElNotification } from 'element-plus'
import { reactive } from 'vue'

const formState = reactive({
  switch: false,
  date: '2023-06-01',
  date_begin: '2023-01-01',
  date_end: '2023-12-31',
  datetime: '2023-06-01 12:34:56',
  datetime_begin: '',
  datetime_end: '',
  inputs: ['input1', 'input2'],
  image: 'https://element-plus.org/apple-touch-icon.png',
  pictures: ['https://vuejs.org/images/logo.png'],
  audio: '',
  video: '',
  pdf: '',
})
const dateValues = reactive<{ [key: string]: [string, string] }>({
  date_range: [formState.date_begin, formState.date_end],
  datetime_range: [formState.datetime_begin, formState.datetime_end],
})
const submitForm = () => {
  ElNotification({ message: JSON.stringify(formState) })
}
</script>

<template>
  <el-form label-width="120px" style="width: 600px">
    <el-form-item label="开关">
      <el-switch v-model="formState.switch" />
    </el-form-item>
    <el-form-item label="日期">
      <el-date-picker
        type="date"
        v-model="formState.date"
        value-format="YYYY-MM-DD"
        @change="(v: any) => (formState.date = v || '')"
      />
    </el-form-item>
    <el-form-item label="日期段">
      <el-date-picker
        type="daterange"
        range-separator="~"
        v-model="dateValues.date_range"
        value-format="YYYY-MM-DD"
        @change="(v: any) => ([formState.date_begin, formState.date_end] = v || ['', ''])"
      />
    </el-form-item>
    <el-form-item label="日期时间">
      <el-date-picker
        type="datetime"
        v-model="formState.datetime"
        value-format="YYYY-MM-DD HH:mm:ss"
        @change="(v: any) => (formState.datetime = v || '')"
      />
    </el-form-item>
    <el-form-item label="日期时间段">
      <el-date-picker
        type="datetimerange"
        range-separator="~"
        v-model="dateValues.datetime_range"
        value-format="YYYY-MM-DD HH:mm:ss"
        :default-time="[new Date(2000, 1, 1, 9, 0, 0), new Date(2000, 1, 1, 17, 0, 0)]"
        @change="(v: any) => ([formState.datetime_begin, formState.datetime_end] = v || ['', ''])"
      />
    </el-form-item>
    <el-form-item label="动态输入框组">
      <GroupInput
        :values="formState.inputs"
        :limit="5"
        :maxlength="20"
        @ok="(values) => (formState.inputs = values)"
      />
    </el-form-item>
    <el-form-item label="单图">
      <UploadImage :src="formState.image" @ok="(path) => (formState.image = path)" clearable />
    </el-form-item>
    <el-form-item label="多图">
      <UploadPictures
        :limit="5"
        :urls="formState.pictures"
        @ok="(paths) => (formState.pictures = paths)"
      />
    </el-form-item>
    <el-form-item label="音频">
      <UploadAudio @ok="(path) => (formState.audio = path)" clearable />
    </el-form-item>
    <el-form-item label="视频">
      <UploadVideo @ok="(path) => (formState.video = path)" clearable />
    </el-form-item>
    <el-form-item label="PDF">
      <UploadPDF @ok="(path) => (formState.pdf = path)" clearable />
    </el-form-item>
    <el-form-item>
      <el-text size="small" type="info">
        多图上传组件在upload组件的基础上集成了拖拽排序功能和loading效果。<br />
        音频视频和PDF预览使用html5原生组件，各浏览器显示效果略有差异。
      </el-text>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">确定</el-button>
    </el-form-item>
  </el-form>
</template>
