import { TagProps } from 'element-plus'

// javascript中object的key总是识别为string，为兼容number类型，使用元组来代替object定义映射关系
class Table<K, V> {
  private readonly __map: Map<K, V>
  constructor(data: [K, V][]) {
    this.__map = new Map(data)
  }
  mapping(): [K, V][] {
    const data: [K, V][] = []
    this.__map.forEach((v, k) => {
      data.push([k, v])
    })
    return data
  }
  render(key: K): V | undefined {
    return this.__map.get(key)
  }
}

export interface TableInstance<K, V> {
  mapping(): [K, V][]
  render(key: K): V | undefined
}

export const buildTable = <K, V>(data: { [key: string]: unknown }[], key = 'id', text = 'name') => {
  const items: [K, V][] = []
  data.forEach((obj) => {
    items.push([obj[key] as K, obj[text] as V])
  })
  return new Table(items)
}

export const table = {
  statusType: new Table<number, TagProps['type']>([
    [1, 'success'],
    [2, 'danger'],
  ]),
  status: new Table([
    [1, '启用'],
    [2, '禁用'],
  ]),
}
