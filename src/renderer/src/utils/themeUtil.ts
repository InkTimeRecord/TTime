import { useColorMode } from '@vueuse/core'
import { ThemeTypeEnum } from '../enums/ThemeTypeEnum'
import { cacheGetStr } from './cacheUtil'

/**
 * 初始化主题
 */
export const initTheme = () => {
  // 参考文档 : https://vueuse.org/core/useColorMode/#component-usage
  const useThemeMode = useColorMode({
    // localStorage key 名称
    storageKey: 'useTheme',
    // 如果模式为auto也需要回显回auto
    // emitAuto: true,
    // 默认模式为跟随系统
    initialValue: ThemeTypeEnum.AUTO
  })
  useThemeMode.value = cacheGetStr('useTheme')
  return useThemeMode
}
