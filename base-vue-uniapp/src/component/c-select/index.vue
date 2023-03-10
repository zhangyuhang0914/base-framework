<template lang="pug">
.c-select
  u-popup(:show="show" @close="cancel")
    .title {{ popupTitle }}
    .select-box(style="padding: 20rpx;")
      u-search(v-if="showSearch" @custom="search" @search="search" :placeholder="placeholder" v-model="keyword")
      u-gap(v-if="showSearch" height="15")
      scroll-view(:scroll-top="scrollTop" scroll-y="true" style="height: 800rpx;" class="scroll-Y" @scrolltolower="$emit('lower')")
        u-radio-group(v-if="type == 'radio'" :borderBottom="true" iconPlacement="right" placement="column" @change="groupChange" v-model="radioValue")
          u-radio(:customStyle="{marginBottom: '12px'}" v-for="(item, index) in dataLists" :key="index" :label="item[name]" :name="index")
        u-checkbox-group(v-if="type == 'checkbox'" :borderBottom="true" placement="column" iconPlacement="right" @change="checkboxChange" v-model="checkboxValue")
          u-checkbox(:customStyle="{marginBottom: '12px',paddingBottom:'12px'}" v-for="(item, index) in dataLists" :key="index" :label="item[name]" :name="index")
      u-gap(height="45")
      .bottons
        u-row
          u-col(customStyle="padding:0 10rpx 20rpx 20rpx" span="6")
            u-button(@click="cancel") {{ '取消' }}
          u-col(customStyle="padding:0 10rpx 20rpx 20rpx" span="6")
            u-button(@click="cancel") {{ '确认' }}
</template>

<script>
	/**
	 * @author ZhangYuHang
	 * @property {Array}			dataLists			数据列表
	 * @property {String}			name				列表显示的字段名
	 * @property {Boolean}			show				是否展示弹窗 (默认 false )
	 * @property {String}			type				选择类型 单选｜多选 (默认 单选 )
	 * @property {Boolean}			showSearch			是否显示搜索框 (默认 true )
	 * @property {String}	        popupTitle			列表标题
	 * @property {String}			placeholder			搜索框placeholder
	 * @event {Function} search 搜索事件，返回keyword
	 * @event {Function} lower 滑动到底部触发，用于下拉加载新数据
	 * @event {Function} cancel 组件关闭事件
	 * @event {Function} submit 提交按钮,返回选中的列表数据
	 */
import { defineComponent, ref, onMounted } from 'vue'
export default defineComponent({
  name: "c-select",
  props: {
    dataLists: {
      default: {},
      type: Array
    },
    name: {
      default: 'name',
    },
    show: {
      default: false,
      type: Boolean
    },
    type: {
      default: 'radio',
      type: String
    },
    showSearch: {
      default: true,
      type: Boolean
    },
    popupTitle: {
      default: '请选择',
      type: String
    },
    placeholder: {
      default: '请输入搜索内容'
    }
  },
  emits: ['lower'],
  setup (props, { emit }) {
    const keyword = ref('')
    const scrollTop = ref(0)
    const checkboxData = ref([])
    const checkboxValue = ref([])
    const radioData = ref({})
    const radioValue = ref('')
    const checkboxChange = (n) => {
      checkboxData.value = []
      n.forEach(key=>{
        checkboxData.value.push(props.dataLists[key])
      })
    }
    // 选择列表项触发
    const groupChange = (n) => {
      radioData.value = props.dataLists[n]
    }
    // 点击搜索触发
    const search = () => {
      emit('search', keyword.value)
    }
    // 点击取消按钮触发
    const cancel = () => {
      console.log('点击取消按钮触发')
      emit('cancel')
    }
    const submit = () => {
      if (props.type == 'radio') {
        if (JSON.stringify(radioData.value) == '{}') {
          uni.$u.toast('请选择数据')
          return false
        }
        emit('submit', radioData.value)
      } else if (props.type == 'checkbox') {
        if (checkboxData.value.length == 0) {
          uni.$u.toast('请选择数据')
          return false
        }
        emit('submit', checkboxData.value)
      }
    }
    onMounted(() => {
      console.log('show', props.show, props.dataLists, props.name)
    })
    // 提交触发
    return {
      keyword,
      scrollTop,
      checkboxData,
      checkboxValue,
      radioData,
      radioValue,
      checkboxChange,
      groupChange,
      search,
      cancel,
      submit,
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
