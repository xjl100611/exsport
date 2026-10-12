import { useEffect, useState } from 'react'

// 演示版用它保存收藏：数据留在浏览器本地
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // 隐私模式下可能写入失败，忽略即可
    }
  }, [key, value])

  return [value, setValue]
}
