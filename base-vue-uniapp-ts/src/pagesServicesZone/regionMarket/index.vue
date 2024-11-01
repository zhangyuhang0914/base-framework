<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack statusBackground="#132B5B" headerBackground="#132B5B" headerColor="#FFFFFF" headerTitle="区域性股权市场")
    template(#main)
      view.layoutMain
        .mainContainer
          scroll-view.scrollView(scroll-y)
            image.bannerImg(:src="previewImg('wx_servicesZone_marketLogo')" mode="widthFix")
            .content
              up-tabs(
                :list='tabList'
                @click='handleTab'
                :current='tabIndex'
                :lineHeight='0'
                :inactiveStyle='{background: "#EBF8FF", color: "#2C5182", padding: "0 20rpx", borderRadius: "4px 4px 0 0"}'
                :activeStyle='{background: "#3280FF", color: "#ffffff", padding: "0 20rpx", borderRadius: "4px 4px 0 0"}'
                :itemStyle='{padding: "0", marginRight: "20rpx", height: "60rpx", marginBottom: "30rpx"}'
              )
              .tabContent(v-if='tabIndex === 0' )
                .textIndex {{'武汉股权托管交易中心(简称“武汉股交”)是湖北省区域性股权市场运营机构，是省属唯一金融控股平台——湖北宏泰集团直属成员企业，是中国证券业协会区域性股权市场委员会副主任单位。'}}
                .textIndex {{'武汉股交是服务中小微企业的私募证券市场，是多层次资本市场体系的重要组成部分，是地方人民政府扶持中小微企业政策措施的综合运用平台，其主要功能是为中小微企业等市场主体提供规范内部治理、股权托管交易、股权投资融资、企业并购重组、转板上市培育等综合金融服务。'}}
              .tabContent(v-if='tabIndex === 1' )
                view
                  span.fontWeight {{'托管登记：'}}
                  span {{'为未上市企业提供股权、债权等金融产品的确权、登记、托管、结算、过户等服务。'}}
                view
                  span.fontWeight {{'挂牌转让：'}}
                  span {{'挂牌対象为“两非一高”企业，即非上市、非公众（股东人数在200人以下）、具有较高成长性企业，为挂牌托管企业提供股权转让服务。'}}
                view
                  span.fontWeight {{'融资融智：'}}
                  span {{'通过私募定增、股权质押、并购重组、融资租赁、保理和私募可转债等，服务企业融资。为企业提供战略、管理、法律、财务、税收、市场等方面的培训、策划和咨询等融智赋能服务。'}}
                view
                  span.fontWeight {{'培育上市：'}}
                  span {{'帮助企业完成股份制改造、规范法人治理、整合市场资源、改善经营业绩，从而推动企业在沪深北交易所及全国股转系统上市挂牌。'}}
                view
                  span.fontWeight {{'“专精特新”专板：'}}
                  span {{' 为“专精特新”企业规范发展提供融智服务、多元化融资服务、及转板上市服务。'}}
              .tabContent(v-if='tabIndex === 2' )
                .textIndex {{'“专精特新”专板聚焦于服务中小企业专精特新发展，整合政府和市场各方资源，以“数字化、产品化、普惠化”的理念，完善基础服务、综合金融服务和上市规范培育服务，提升优质中小企业规范发展质效，为构建新发展格局、实现经济高质量发展提供有力支撑。'}}
                .text-right
                  image.qrCode(:src="previewImg('wx_servicesZone_qrCode')" mode="widthFix" @click="handleLongpress('wx_servicesZone_qrCode')")
              .tabContent(v-if='tabIndex === 3' )
                .textIndex {{'湖北资本市场学院是由武汉股权托管交易中心和长江金融工程研究院（武汉）有限公司共同出资、联合设立的区域资本市场教育培训平台，由湖北四板商学服务有限公司负责运营。学院旨在通过建立集系统培训、管理咨询、人才培养和应用研究于一体的综合增值服务体系，开展市场化、专业化、个性化的教育、培训、咨询等服务，着力提升相关各方对资本市场的认知与运用，为资本市场相关主体的持续健康发展融智赋能，助力成长。'}}
                .textIndex {{'学院自成立以来，已举办100多场专题培训活动，为全国10多个省市的政府领导部门、100多家金融机构的高管、近3000家挂牌企业的代表宣讲和交流了宏观经济形势、企业规范治理、投资融资工具、企业税务筹划等金融与资本市场知识，累计培训5000多人次，广受各方好评。'}}
              .tabContent(v-if='tabIndex === 4' )
                .textIndex {{'由武汉股权托管交易中心全资子公司——湖北四板优品汇科技有限公司精心打造的“四板优品商城”近日正式上线。商城依托湖北农业大省丰富的产业资源和武汉股交综合金融服务平台等优势，通过“线上推广销售+线下社群精准营销”等模式，致力于为四板优质挂牌企业扩大品牌影响力，拓展销售渠道，推广荆楚优品，服务广大消费者。'}}
                .textIndex {{'“四板优品商城”独具三大鲜明特色：'}}
                .textIndex {{'一是源自四板。所有上线商品均为武汉股交挂牌企业的优质产品，企业内部治理规范，生产经营管控严格；'}}
                .textIndex {{'二是品质优良。商城上线均为“三品一标”产品，即无公害农产品、绿色食品、有机农产品和农产品地理标志公共品牌，是政府主导扶持、深受消费者信任和青睐的安全优质农产品；'}}
                .textIndex {{'三是价格实惠。“四板优品”与挂牌企业建立了产品直销合作，没有中间流通环节，成本优势明显、性价比更高，上线商品都有低于同款或同类商品市场价格的爱心特别优惠价。'}}
            image.bannerImg(:src="previewImg('wx_servicesZone_serviceProduct')" mode="widthFix")
            .content
              .serviceProductItem(v-for='(sItem, sIndex) in serviceProductList' :key='sIndex')
                .topTitle
                  .titleLeft
                    view.iconfont(:class='sItem.icon')
                    view {{sItem.label}}
                  .custromBtn(@click="handleServiceProductView(sItem)") {{'查看详情'}}
                .textIndex.bottomContent {{ sItem.content }}
            image.bannerImg(:src="previewImg('wx_servicesZone_policyFile')" mode="widthFix")
            .content
              .policyFileItem(v-for='(pItem, pIndex) in policyFileList' :key='pIndex' @click='handlePolicyFileView(pItem)')
                view.doctitle {{pItem.doctitle}}
                view.publisher {{pItem.publisher}} &nbsp;&nbsp; {{pItem.pubdate}}
              view(:class='{policyFileMore: loadMoreStatus === "loadmore"}')
                up-loadmore(
                  :status="loadMoreStatus"
                  loadmore-text="查看更多"
                  @loadmore="handlePolicyFileMore")
            .wxQrCodeContent
              .wxQrCode(v-for='(item, index) in wxQrCodeList' :key='index')
                image(:src="previewImg(item.img)" mode="widthFix" @click="handleLongpress(item.img)")
                .qrCodeTitle {{item.title}}
        LoginValidateModal(ref='loginValidateRef' :type='loginValidateType')
</template>

<script setup lang="ts">
import Layout from '@/components/layout/index.vue'
import { ref, onMounted, computed } from 'vue'
import { previewImg } from '@/util/utils'
import { technologyFinanceList } from '@/api/servicesZone'
import type { ITechnologyFinanceItem } from '@/api/servicesZone/type'
import { userCommonStoreHook } from '@/store/modules/common'
import LoginValidateModal from '@/pages/user/loginValidateModal/index.vue'
import { linkJump } from '@/common/common'
const tabList = ref([
  {
    name: '武汉股权托管交易中心简介',
    type: '1'
  },
  {
    name: '平台功能',
    type: '2'
  },
  {
    name: '“专精特新”专板简介',
    type: '3'
  },
  {
    name: '湖北资本市场学院简介',
    type: '4'
  },
  {
    name: '四板优品简介',
    type: '5'
  }
])
const tabIndex = ref(0)
const serviceProductList = ref([
  {
    id: 0,
    label: '我要入板（专精特新）',
    icon: 'icon-zhuanjingtexin',
    description: '简介：通过私募定增、股权质押、并购重组、融资租赁、保理和私募可转债等，服务企业融资。',
    content: '支持企业走“专精特新”发展之路是国家战略导向，在上市、技改、奖励资金、融资等方面均有扶持政策。企业可在线填写“专精特新”申报表单，武汉股交对企业资质进行评估。'
  },
  {
    id: 1,
    label: '我要托管',
    icon: 'icon-tuoguan',
    description: '简介：通过私募定增、股权质押、并购重组、融资租赁、保理和私募可转债等，服务企业融资。',
    content: '武汉股交接受非上市公司或股东的委托,管理公司股东名册,对股权的确权、转让变更、股权质押等程序进行统一规范登记和管理。'
  },
  {
    id: 2,
    label: '我要挂牌',
    icon: 'icon-guapai',
    description: '简介：通过私募定增、股权质押、并购重组、融资租赁、保理和私募可转债等，服务企业融资。',
    content:
      '企业按照武汉股交相关规定履行申报手续，自行或由中介机构推荐并企业挂牌是指企业按照武汉股交相关规定履行申报手续，自行或由中介机构推荐并向武汉股交提出申请，经武汉股交企业挂牌审核委员会审核通过，并办理相应挂牌手续，并公开显示股价及总股本等信息。'
  },
  {
    id: 3,
    label: '我要上市',
    icon: 'icon-shangshi',
    description: '简介：通过私募定增、股权质押、并购重组、融资租赁、保理和私募可转债等，服务企业融资。',
    content: '为拟上市企业提供上市政策咨询、上市辅导、上市培训、 投融资服务等全流程、全链条、全周期的上市培育服务体系和服务机制。'
  },
  {
    id: 4,
    label: '我要融资',
    icon: 'icon-rongzi',
    description: '简介：通过私募定增、股权质押、并购重组、融资租赁、保理和私募可转债等，服务企业融资。',
    content: '通过私募定增、股权质押、并购重组、融资租赁、保理和私募可转债等，服务企业融资。'
  }
])
const loadMoreStatus = ref<string>('loadmore') // LoadMore组件状态：loadmore查看更多 loading加载中 nomore没有更多
const policyFileList = ref<ITechnologyFinanceItem[]>([])
const policyFilePage = ref({
  page: 1,
  limit: 5,
  totalPage: 0
})
let loginValidateType = ref('login')
let loginValidateRef = ref()
const wxQrCodeList = ref([
  {
    title: '中心微信',
    img: 'wx_servicesZone_centerWx'
  },
  {
    title: '学院微信',
    img: 'wx_servicesZone_schoolWx'
  },
  {
    title: '四板优品微信',
    img: 'wx_servicesZone_superWx'
  }
])
// 登录token
let token = computed(() => {
  return userCommonStoreHook().token
})
const handleTab = (item: AnyObject) => {
  tabIndex.value = item.index
}
const handleServiceProductView = (item: AnyObject) => {
  if (!token.value) {
    loginValidateRef.value.init()
    return
  }
  linkJump(`/pagesServicesZone/regionMarket/regionMarketDetail/index?label=${item.label}&createdType=${item.id}`)
}
// 政策文件
const getPolicyFile = () => {
  let params: any = {
    page: policyFilePage.value.page,
    limit: policyFilePage.value.limit,
    sidx: 'pubdate',
    order: 'desc',
    doctitle: '',
    dochtmlcon: '',
    channelid: '67880'
  }
  loadMoreStatus.value = 'loading'
  technologyFinanceList(params)
    .then(value => {
      let data = value.page
      policyFileList.value = policyFileList.value.concat(data.list || [])
      policyFilePage.value.totalPage = data.totalPage
    })
    .catch(reason => {
      console.error(reason)
    })
    .finally(() => {
      if (policyFilePage.value.page === policyFilePage.value.totalPage || policyFilePage.value.totalPage === 0) {
        //	若为最后一页 则return,没有更多
        loadMoreStatus.value = 'nomore'
      } else {
        loadMoreStatus.value = 'loadmore'
      }
    })
}
// 查看更多
const handlePolicyFileMore = () => {
  policyFilePage.value.page = policyFilePage.value.page + 1
  getPolicyFile()
}
// 政策文件查看
const handlePolicyFileView = (item: AnyObject) => {
  linkJump(`/pagesServicesZone/regionMarket/policyFileDetail/index?financeId=${item.docid}`)
}
// 长按识别二维码
const handleLongpress = (key: string) => {
  let url: string = previewImg(key) || ''
  uni.previewImage({
    urls: [url],
    longPressActions: {
      itemList: ['发送给朋友', '保存图片', '收藏'],
      success: data => {
        console.log('longPressActions success', data)
      },
      fail: err => {
        console.log('longPressActions fail', err)
      }
    }
  })
}
onMounted(() => {
  getPolicyFile()
})
</script>

<style lang="stylus" scoped>
@import 'index.styl'
</style>
