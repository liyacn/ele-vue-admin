<script setup lang="ts">
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
  <drag-sort class="space-inline" v-model="state" item-key="index" @end="$emit('ok', state)">
    <template #item="{ element, index }">
      <el-tag class="drag" size="large" closable @close="remove(index)">
        {{ element }}
      </el-tag>
    </template>
    <template #footer>
      <el-input
        v-if="!limit || state.length < limit"
        v-model="inputValue"
        @keyup.enter="handleInputConfirm"
        @blur="handleInputConfirm"
        :maxlength="maxlength"
        style="width: 120px"
      />
    </template>
  </drag-sort>
</template>
