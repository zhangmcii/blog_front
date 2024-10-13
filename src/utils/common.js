import dayjs from 'dayjs'

export default {
  isYesterday(date) {
    // 将输入的日期字符串转换为 dayjs 对象
    const inputDate = dayjs(date).startOf('day')
    // 获取当前日期的 dayjs 对象
    const today = dayjs().startOf('day')
    // 计算 inputDate 与今天日期的差值，单位为天
    const diff = today.diff(inputDate, 'day')
    // 如果差值为 -1，则说明 inputDate 是昨天
    console.log('diff', diff)
    return diff === 1
  }
}
