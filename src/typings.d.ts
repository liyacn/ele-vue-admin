import { table } from './types/table'
import { ElTree } from 'element-plus'
import 'vue-router'

declare module 'vue-router' {
  interface RouteMeta {
    authKey?: string
    title: string[]
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $table: typeof table
  }
}

declare module 'element-plus' {
  type TreeInstance = InstanceType<typeof ElTree>
}
