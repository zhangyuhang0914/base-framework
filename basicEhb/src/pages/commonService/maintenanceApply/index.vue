<template lang="pug">
.pageWrapper
  .bannerContent
    VanImage(width="100%" height="auto" :src="getImage('commonService.maintenanceBanner')" fit="contain")
    VanImage.titleImg(width="100%" height="150" :src="getImage('commonService.maintenanceBannerTitle')" fit="contain")
    VanImage.logoImg(width="120" height="auto" :src="getImage('commonService.maintenanceBannerLogo')" fit="contain")
  .applyContent
    .applyForm
      VanImage.formTitle(:src="getImage('commonService.maintenanceFormTitle')" fit="contain")
        .text {{ '· 报修信息 ·' }}
      VanForm(ref="formDataRef" @submit="onSubmit")
        VanField(
          v-model="formData.deviceCodeName"
          name="deviceCodeName"
          label="设备号"
          :rules="[{ required: true, message: '请选择设备号' }]"
          readonly
          is-link
          @click="deviceCodeSheet"
        )
        VanField(
          v-model="formData.faultTypeName"
          name="faultTypeName"
          label="故障分类"
          :rules="[{ required: true, message: '请选择设备号' }]"
          readonly
          is-link
          @click="faultTypeSheet"
        )
        VanField(
          v-model="formData.faultDesc"
          name="faultDesc"
          type="textarea"
          autosize
          label="故障描述"
          :rules="[{ required: true, message: '请输入故障描述' }]"
          rows="3"
          maxlength="300"
          placeholder="请详细描述你遇到的故障情况"
          show-word-limit
        )
        VanField(
          v-model="formData.areaName"
          name="areaName"
          label="所属地区"
          :rules="[{ required: true, message: '请选择所属地区' }]"
          readonly
          is-link
          @click="areaSheet"
        )
        VanField(
          v-model="formData.address"
          name="address"
          type="textarea"
          autosize
          label="详细地址"
          :rules="[{ required: true, message: '请输入详细地址' }]"
          rows="3"
          maxlength="100"
          placeholder="例：街道/小区/楼栋号"
          show-word-limit
        )
        VanField(
          v-model="formData.phone"
          name="phone"
          type="number"
          label="联系电话"
          :rules="[{ required: true, message: '请输入联系电话' }]"
          placeholder="请输入手机号码"
          maxlength="11"
        )
        .captchaCodeField
          VanField(
            v-model="formData.verifyCode"
            name="verifyCode"
            label="验证码"
            :rules="[{ required: true, message: '请输入验证码' }]"
          )
          VanButton(type="primary" :disabled="sendBtnDisabled" @click="getVerifyCode") {{ sendBtnText }}
  .submitButton
    VanButton(type="primary" round @click="handleSubmit") {{ '提交' }}
</template>

<script lang="ts">
import { getImage } from '@/constants/images'
import { useEhbApi } from '@/hooks/useEhbApi'
import { useCaptchaCode } from '@/hooks/useForm'
import type {
  LinkagePickerItem,
  LinkagePickerResult,
  SelectorItem
} from '@/plugin/interface/selector'
import type { FormInstance } from 'vant'
import { defineComponent, onMounted, reactive, ref } from 'vue'

export default defineComponent({
  name: 'MaintenanceApply',
  setup() {
    const { actionSheet, linkagePicker } = useEhbApi()
    const { sendBtnText, sendBtnDisabled, sendCode } = useCaptchaCode(60)
    const formDataRef = ref<FormInstance>()
    const formData = reactive({
      // 设备号
      deviceCode: '',
      // 设备号名称
      deviceCodeName: '',
      // 故障分类
      faultType: 'ab',
      // 故障分类名称
      faultTypeName: '机顶盒故障',
      // 故障描述
      faultDesc: '',
      // 所属地区
      area: '420111',
      // 所属地区名称
      areaName: '湖北省 武汉市 洪山区',
      // 详细地址
      address: '',
      // 联系电话
      phone: '',
      // 验证码
      verifyCode: ''
    })
    const deviceList = ref<SelectorItem[]>([])
    const faultTypeList = ref<SelectorItem[]>([])
    const areaList = ref<LinkagePickerItem[]>([])
    // 获取设备列表
    const getDeviceList = () => {
      deviceList.value = [
        {
          label: '东南角',
          value: '123'
        },
        {
          label: '南国路',
          value: '1234'
        },
        {
          label: '西南角',
          value: '12345'
        },
        {
          label: '东国路',
          value: '123456'
        },
        {
          label: '西国路',
          value: '1234567'
        },
        {
          label: '北国路',
          value: '12345678'
        },
        {
          label: '中南路',
          value: '123456789'
        }
      ]
    }
    // 获取故障分类列表
    const getFaultTypeList = () => {
      faultTypeList.value = [
        {
          label: '机顶盒故障',
          value: 'ab'
        },
        {
          label: '网络故障',
          value: 'cd'
        },
        {
          label: '信号中断',
          value: 'ef'
        },
        {
          label: '网络覆盖不足',
          value: 'gh'
        },
        {
          label: '其他故障',
          value: 'ij'
        }
      ]
    }
    // 获取所属地区列表
    const getAreaList = () => {
      areaList.value = [
        {
          value: '4201',
          text: '武汉市',
          children: [
            {
              value: '420102',
              text: '江岸区'
            },
            {
              value: '420103',
              text: '江汉区'
            },
            {
              value: '420104',
              text: '硚口区'
            },
            {
              value: '420105',
              text: '汉阳区'
            },
            {
              value: '420106',
              text: '武昌区'
            },
            {
              value: '420107',
              text: '青山区'
            },
            {
              value: '420111',
              text: '洪山区'
            },
            {
              value: '420112',
              text: '东西湖区'
            },
            {
              value: '420113',
              text: '汉南区'
            },
            {
              value: '420114',
              text: '蔡甸区'
            },
            {
              value: '420115',
              text: '江夏区'
            },
            {
              value: '420116',
              text: '黄陂区'
            },
            {
              value: '420117',
              text: '新洲区'
            }
          ]
        },
        {
          value: '4202',
          text: '黄石市',
          children: [
            {
              value: '420202',
              text: '黄石港区'
            },
            {
              value: '420203',
              text: '西塞山区'
            },
            {
              value: '420204',
              text: '下陆区'
            },
            {
              value: '420205',
              text: '铁山区'
            },
            {
              value: '420222',
              text: '阳新县'
            },
            {
              value: '420281',
              text: '大冶市'
            }
          ]
        },
        {
          value: '4203',
          text: '十堰市',
          children: [
            {
              value: '420302',
              text: '茅箭区'
            },
            {
              value: '420303',
              text: '张湾区'
            },
            {
              value: '420304',
              text: '郧阳区'
            },
            {
              value: '420322',
              text: '郧西县'
            },
            {
              value: '420323',
              text: '竹山县'
            },
            {
              value: '420324',
              text: '竹溪县'
            },
            {
              value: '420325',
              text: '房县'
            },
            {
              value: '420381',
              text: '丹江口市'
            }
          ]
        },
        {
          value: '4205',
          text: '宜昌市',
          children: [
            {
              value: '420502',
              text: '西陵区'
            },
            {
              value: '420503',
              text: '伍家岗区'
            },
            {
              value: '420504',
              text: '点军区'
            },
            {
              value: '420505',
              text: '猇亭区'
            },
            {
              value: '420506',
              text: '夷陵区'
            },
            {
              value: '420525',
              text: '远安县'
            },
            {
              value: '420526',
              text: '兴山县'
            },
            {
              value: '420527',
              text: '秭归县'
            },
            {
              value: '420528',
              text: '长阳土家族自治县'
            },
            {
              value: '420529',
              text: '五峰土家族自治县'
            },
            {
              value: '420581',
              text: '宜都市'
            },
            {
              value: '420582',
              text: '当阳市'
            },
            {
              value: '420583',
              text: '枝江市'
            }
          ]
        },
        {
          value: '4206',
          text: '襄阳市',
          children: [
            {
              value: '420602',
              text: '襄城区'
            },
            {
              value: '420606',
              text: '樊城区'
            },
            {
              value: '420607',
              text: '襄州区'
            },
            {
              value: '420624',
              text: '南漳县'
            },
            {
              value: '420625',
              text: '谷城县'
            },
            {
              value: '420626',
              text: '保康县'
            },
            {
              value: '420682',
              text: '老河口市'
            },
            {
              value: '420683',
              text: '枣阳市'
            },
            {
              value: '420684',
              text: '宜城市'
            }
          ]
        },
        {
          value: '4207',
          text: '鄂州市',
          children: [
            {
              value: '420702',
              text: '梁子湖区'
            },
            {
              value: '420703',
              text: '华容区'
            },
            {
              value: '420704',
              text: '鄂城区'
            }
          ]
        },
        {
          value: '4208',
          text: '荆门市',
          children: [
            {
              value: '420802',
              text: '东宝区'
            },
            {
              value: '420804',
              text: '掇刀区'
            },
            {
              value: '420822',
              text: '沙洋县'
            },
            {
              value: '420881',
              text: '钟祥市'
            },
            {
              value: '420882',
              text: '京山市'
            }
          ]
        },
        {
          value: '4209',
          text: '孝感市',
          children: [
            {
              value: '420902',
              text: '孝南区'
            },
            {
              value: '420921',
              text: '孝昌县'
            },
            {
              value: '420922',
              text: '大悟县'
            },
            {
              value: '420923',
              text: '云梦县'
            },
            {
              value: '420981',
              text: '应城市'
            },
            {
              value: '420982',
              text: '安陆市'
            },
            {
              value: '420984',
              text: '汉川市'
            }
          ]
        },
        {
          value: '4210',
          text: '荆州市',
          children: [
            {
              value: '421002',
              text: '沙市区'
            },
            {
              value: '421003',
              text: '荆州区'
            },
            {
              value: '421022',
              text: '公安县'
            },
            {
              value: '421023',
              text: '监利县'
            },
            {
              value: '421024',
              text: '江陵县'
            },
            {
              value: '421081',
              text: '石首市'
            },
            {
              value: '421083',
              text: '洪湖市'
            },
            {
              value: '421087',
              text: '松滋市'
            }
          ]
        },
        {
          value: '4211',
          text: '黄冈市',
          children: [
            {
              value: '421102',
              text: '黄州区'
            },
            {
              value: '421121',
              text: '团风县'
            },
            {
              value: '421122',
              text: '红安县'
            },
            {
              value: '421123',
              text: '罗田县'
            },
            {
              value: '421124',
              text: '英山县'
            },
            {
              value: '421125',
              text: '浠水县'
            },
            {
              value: '421126',
              text: '蕲春县'
            },
            {
              value: '421127',
              text: '黄梅县'
            },
            {
              value: '421181',
              text: '麻城市'
            },
            {
              value: '421182',
              text: '武穴市'
            }
          ]
        },
        {
          value: '4212',
          text: '咸宁市',
          children: [
            {
              value: '421202',
              text: '咸安区'
            },
            {
              value: '421221',
              text: '嘉鱼县'
            },
            {
              value: '421222',
              text: '通城县'
            },
            {
              value: '421223',
              text: '崇阳县'
            },
            {
              value: '421224',
              text: '通山县'
            },
            {
              value: '421281',
              text: '赤壁市'
            }
          ]
        },
        {
          value: '4213',
          text: '随州市',
          children: [
            {
              value: '421303',
              text: '曾都区'
            },
            {
              value: '421321',
              text: '随县'
            },
            {
              value: '421381',
              text: '广水市'
            }
          ]
        },
        {
          value: '4228',
          text: '恩施土家族苗族自治州',
          children: [
            {
              value: '422801',
              text: '恩施市'
            },
            {
              value: '422802',
              text: '利川市'
            },
            {
              value: '422822',
              text: '建始县'
            },
            {
              value: '422823',
              text: '巴东县'
            },
            {
              value: '422825',
              text: '宣恩县'
            },
            {
              value: '422826',
              text: '咸丰县'
            },
            {
              value: '422827',
              text: '来凤县'
            },
            {
              value: '422828',
              text: '鹤峰县'
            }
          ]
        },
        {
          value: '429004',
          text: '仙桃市'
        },
        {
          value: '429005',
          text: '潜江市'
        },
        {
          value: '429006',
          text: '天门市'
        },
        {
          value: '429021',
          text: '神农架林区'
        }
      ]
    }
    // 获取验证码
    const getVerifyCode = () => {
      if (!formData.phone) {
        ehbAppJssdk.notice.toast({ text: '请填写手机号码' })
        return
      }
      sendCode(formData.phone, 'CommonSendSMS', {
        callback: () => {
          ehbAppJssdk.notice.toast({ text: '发送成功' })
        },
        fail: () => {
          ehbAppJssdk.notice.toast({ text: '发送成功' })
        }
      })
    }
    // 选择设备
    const deviceCodeSheet = () => {
      actionSheet(deviceList.value, {
        title: '请选择设备号',
        success: res => {
          formData.deviceCode = res.value
          formData.deviceCodeName = res.label
        }
      })
    }
    // 选择故障分类
    const faultTypeSheet = () => {
      actionSheet(faultTypeList.value, {
        title: '请选择故障分类',
        success: res => {
          formData.faultType = res.value
          formData.faultTypeName = res.label
        }
      })
    }
    // 选择所属地区
    const areaSheet = () => {
      linkagePicker({
        title: '请选择所属地区',
        data: areaList.value,
        type: 'clickSelect',
        length: '2',
        success: res => {
          const resultData: LinkagePickerResult = JSON.parse(res)
          console.log('请选择所属地区', resultData)
          const cityInfo = resultData['1'] // 市
          const districtInfo = resultData['2'] // 区县
          formData.area = districtInfo.value
          formData.areaName = `湖北省 ${cityInfo.text} ${districtInfo.text}`
        }
      })
    }
    // 提交
    const handleSubmit = () => {
      formDataRef.value?.submit()
    }
    const onSubmit = () => {
      console.log('onSubmit')
    }
    onMounted(() => {
      // 获取设备列表
      getDeviceList()
      // 获取故障分类列表
      getFaultTypeList()
      // 获取所属地区列表
      getAreaList()
    })
    return {
      sendBtnText,
      sendBtnDisabled,
      formDataRef,
      formData,
      getImage,
      getVerifyCode,
      deviceCodeSheet,
      faultTypeSheet,
      areaSheet,
      handleSubmit,
      onSubmit
    }
  }
})
</script>

<style lang="scss" scoped>
.pageWrapper {
  background: #248efe;
  .bannerContent {
    position: relative;
    width: 100%;
    .banner-bg {
      width: 100%;
      height: 35vh;
      display: block;
    }
    .titleImg {
      position: absolute;
      top: 18%;
      left: 0;
      right: 0;
      width: 90%;
      margin: 0 auto;
      max-height: 150px;
      display: block;
    }
    .logoImg {
      position: absolute;
      top: 5%;
      left: 5%;
      display: block;
    }
  }
  .applyContent {
    position: relative;
    margin: 0 36px;
    padding: 96px 24px 24px 24px;
    background: $colorWhite;
    border-radius: $borderRadius24;
    .formTitle {
      position: absolute;
      top: -13px;
      left: 50%;
      transform: translateX(-50%);
      margin: 0 auto;
      color: $colorWhite;
      padding: 12px 0;
      font-size: $fontSize34;
      text-align: center;
      .text {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 100%;
      }
    }
    :deep(.van-form) {
      .van-cell {
        margin: 0 0 24px 0;
        background: #f6f9fe;
      }
      .captchaCodeField {
        @include flexAlignStart;
        gap: $gap20;
        .van-button {
          flex: none;
        }
      }
    }
  }
  .submitButton {
    width: 100%;
    margin: 48px 0;
    padding: 0 36px;
    :deep(.van-button) {
      width: 100%;
      background: linear-gradient(90deg, #fbd591, #feb037);
      box-shadow: 0 1px 6px 0 #ffffff;
      color: #aa6700;
    }
  }
}
</style>
