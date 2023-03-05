import { ResultProps } from 'element-plus'

export type ErrorCode = '0' | '403' | '404' | '500' | 'error'

export type ErrorResult = {
  code: string
  icon: ResultProps['icon']
  title: ResultProps['title']
  subTitle: ResultProps['subTitle']
}

export const errorMap: { [key in ErrorCode]: ErrorResult } = {
  '0': {
    code: '',
    icon: 'info',
    title: '',
    subTitle: '',
  },
  '403': {
    code: '403',
    icon: 'warning',
    title: 'Forbidden',
    subTitle: 'Sorry, you are not authorized to access this page.',
  },
  '404': {
    code: '404',
    icon: 'warning',
    title: 'Not Found',
    subTitle: 'Sorry, the page you visited does not exist.',
  },
  '500': {
    code: '500',
    icon: 'error',
    title: 'Internal Server Error',
    subTitle: 'Sorry, something went wrong.',
  },
  error: {
    code: 'error',
    icon: 'error',
    title: 'Netwrok Error',
    subTitle: 'Sorry, something went wrong.',
  },
}
