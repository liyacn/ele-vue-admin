<script setup lang="ts">
import { Delete } from '@element-plus/icons-vue'
import { ref } from 'vue'

const props = defineProps<{
  values?: string[]
  limit?: number
  maxlength?: number
}>()
const emit = defineEmits<{
  (e: 'ok', values: string[]): void
}>()

const state = ref<string[]>(props.values || [])

const remove = (index: number) => {
  state.value.splice(index, 1)
  emit('ok', state.value)
}

const editInput = (index: number) => {
  const val = state.value[index].trim()
  if (val) {
    state.value[index] = val
    emit('ok', state.value)
  } else {
    remove(index)
  }
}

const inputValue = ref('')
const handleInputConfirm = () => {
  const val = inputValue.value.trim()
  if (val) {
    state.value.push(val)
    emit('ok', state.value)
  }
  inputValue.value = ''
}
</script>

<template>
  <div class="space-block">
    <el-input
      v-for="(_, index) in state"
      :key="index"
      v-model="state[index]"
      @blur="editInput(index)"
    >
      <template #append>
        <el-button :icon="Delete" @click="remove(index)" />
      </template>
    </el-input>
    <el-input
      v-if="!limit || state.length < limit"
      v-model="inputValue"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
      :maxlength="maxlength"
    />
  </div>
</template>
