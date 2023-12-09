import { getCurrentInstance } from 'vue'

import { ref } from 'vue'

function fetch(url) {
  let data1 = ref(null)
  let error = ref(null)

  const { proxy } = getCurrentInstance()

  //        const a =
                    proxy.$http.get(url).then((a) => {
                        data1.value = a.data.data?.length
                        if (!data1.value) {
                        error.value = 'error'
                        }
                        console.log('值', data1.value)
                    })

  return { data1, error }
}

export { fetch }
