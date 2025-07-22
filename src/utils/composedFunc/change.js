import { ref, watchEffect, watch } from 'vue'

// export function useChange(origin) {
//   // 保存初始值
//   const isChange = ref(false)

//   const originValue = ref(origin.value)

//   watchEffect(() => {
//     // 比较当前值和初始值
//     isChange.value = origin.value !== originValue.value
//   })

//   return { isChange }
// }
// export function useChange1(obj, key) {
//   const originValue = ref(obj[key])
//   const isChange = ref(false)

//   watchEffect(() => {
//     isChange.value = obj[key] !== originValue.value
//   })

//   return { isChange }
// }

// 获取嵌套属性值
function getValue(obj, path) {
  if (!path) return obj?.value ?? obj
  return path.split('.').reduce((acc, cur) => acc?.[cur], obj)
}

export function useChange(origin, keyPath) {
  const originValue = ref(getValue(origin, keyPath))
  const isChange = ref(false)

  watch(
    () => getValue(origin, keyPath),
    (newVal) => {
      isChange.value = newVal !== originValue.value
    },
    { immediate: true }
  )

  return { isChange }
}

// watchEffect 适合自动收集依赖，但在这场景下，依赖是通过字符串路径动态获取的（如 getValue(origin, keyPath)），这种情况下 watchEffect 可能不会自动追踪到嵌套属性的变化，尤其是 reactive 对象的深层属性。

// 而 watch 可以明确指定需要监听的 getter（如 () => getValue(origin, keyPath)），这样无论是 ref 还是 reactive 的嵌套属性，都能精确监听变化，且性能更好、更可控。