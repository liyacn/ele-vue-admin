import { TagProps } from 'element-plus'

type Value = number | string

type Item<T> = [T, string]

type Option<T extends Value> = { value: T; text: string }

class Table<T extends Value> {
  private __map: Map<T, string>
  // javascript中object的key总是识别为string，为兼容number类型，使用元组来代替object定义映射关系
  constructor(data: Item<T>[]) {
    this.__map = new Map(data)
  }
  options(): Option<T>[] {
    const opt: Option<T>[] = []
    this.__map.forEach((val, key) => {
      opt.push({ value: key, text: val })
    })
    return opt
  }
  render(key: T): string {
    return this.__map.get(key) || ''
  }
}

export interface TableInstance<T extends Value> {
  options(): Option<T>[]
  render(key: T): string
}

export const buildTable = (data: { [key: string]: any }[], val = 'id', text = 'name') => {
  const items: Item<any>[] = []
  data.forEach((obj) => {
    items.push([obj[val], obj[text]])
  })
  return new Table(items)
}

const n = (data: Item<number>[]) => new Table(data)
//const s = (data: Item<string>[]) => new Table(data);

type Dict<T extends Value, V extends string> = {
  [key in T]: V
}

export const table = {
  map: {
    status: <Dict<number, TagProps['type']>>{
      1: 'success',
      '-1': 'danger'
    }
  },
  instance: {
    status: n([
      [1, '启用'],
      [-1, '禁用']
    ])
  }
}
