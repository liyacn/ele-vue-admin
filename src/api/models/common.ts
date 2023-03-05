declare module 'models' {
  type IdArgs = {
    id: number
  }
  type KeyArgs = {
    key_name: string
  }
  type ListArgs = {
    page: number
    size: number
  }
  type SwitchStatusArgs = {
    id: number
    status: number
  }
  type OptionItem = {
    id: number
    name: string
  }
  type OptionResp = {
    list: OptionItem[]
  }
  type UploadArgs = {
    file: File
  }
  type UploadResp = {
    host: string
    path: string
  }
  type CryptoArgs = {
    text: string
  }
  type CryptoResp = {
    result: string
  }
}
