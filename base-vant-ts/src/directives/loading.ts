import { createApp } from 'vue' //导入createApp方法
import loading from '@/components/c-loading/index.vue' // 导入我们写好的 loading 组件

function append(el: any) {
  const style = getComputedStyle(el)
  if (['absolute', 'relative', 'fixed'].indexOf(style.position) === -1) {
    el.classList.add('p-relative') // 通过此API可以添加类名
  }
  el.appendChild(el.instance.$el) //向el节点插入动态创建的 div 节点 ， 内容就是我们的 loading 组件
}

function remove(el: any) {
  el.removeChild(el.instance.$el) //移除动态创建的 div 节点
}

export default {
  mounted(el: any, binding: any, vnode: any) {
    console.log('mounted', el)
    const div = document.createElement('div')
    const app = createApp(loading)
    const instance = app.mount(div)
    el.instance = instance
    if (binding.value) {
      append(el)
    }
    console.log(binding.msg)
    if (binding.msg !== undefined) {
      // 在此判断是否有title值
      el.instance.setTitle(binding.msg) //  // setTitle 使我们在loading组件中定义的方法，可返回第一段代码查看
    }
  },
  updated(el: any, binding: any, vnode: any) {
    console.log('updated')
    if (binding.msg !== undefined) {
      // 在此判断是否有title值
      el.instance.setTitle(binding.msg) //  // setTitle 使我们在loading组件中定义的方法，可返回第一段代码查看
    }
    if (binding.value !== binding.oldValue) {
      binding.value ? append(el) : remove(el)
    }
  },
  unmounted(el: any, binding: any, vnode: any) {}
}
