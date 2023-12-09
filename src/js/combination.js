import { ref } from 'vue'
export function test() {
  const x = ref(12)
  const y = ref(23)

  function add() {
    return { x, y }
  }
  return { x, y }
}
