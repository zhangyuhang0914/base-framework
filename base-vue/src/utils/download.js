export const download = (url, name) => {
  let a = document.createElement('a')
  a.href = url
  a.download = name
  a.target = '_blank'
  a.click()
  a.remove()
}
