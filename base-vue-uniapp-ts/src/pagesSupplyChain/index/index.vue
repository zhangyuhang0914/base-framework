<template lang="pug">
.page-view
  Layout(showTabBar showHeaderBar showBack headerBackground="#132B5B" statusBackground="#132B5B" headerColor="#FFFFFF" headerTitle="供应链金融服务中心")
    template(#main)
      .supply-chain-wrap
        scroll-view.scroll-view(
          scroll-y
          :scroll-top="isBackTop ? '0' : ''"
          @scroll="onScroll"
          @refresherrefresh='refresherrefresh'
          @scrolltoupper="isBackTop = false"
          :refresher-enabled='true'
          :refresher-triggered='refresherTriggered'
          :scroll-with-animation="true"
        )
          .scroll-box
            //- banner图
            .banner-wrap
              image.banner(:src="previewImg('wx_supplyChain_bannerBg')" mode="widthFix" :lazy-load="true" alt="")
            //- 数据统计
            .stats-data
              .stats-item(v-for="(item,index) in stats" :key="index")
                .stat-head
                  up-count-to(:startVal="handleStartValue(item.count)" :endVal="item.count" :duration="3000")
                  .stat-unit {{ item.unit }}
                .stat-title {{ item.title }}
            //- 服务平台
            .cooperation-platform
              .custom-common-header
                .custom-common-title {{ '服务平台' }}
                image.custom-common-tips(:src="previewImg('wx_supplyChain_commonTipsBg')" mode="widthFix" :lazy-load="true" alt="")
              .cooperation-platform-content
                swiper.platform-swiper(class="swiper" @change="supplyChainPlatformChange" circular :indicator-dots="swiper.indicatorDots" :autoplay="swiper.autoplay" :interval="4000" :duration="swiper.duration")
                  swiper-item(class="swiper-item" v-for="(item, index) in cooperationPlatformData" :key="index")
                    .platform-wrap(:style="{ background: `url(${previewImg(item.imgBgConstant)})`, backgroundRepeat: 'no-repeat', backgroundSize: '100% 100%' }")
                      .platform-logo-box
                        image.platform-logo(:src="previewImg(item.imgLogoConstant)" mode="widthFix" :lazy-load="true" alt="")
                      .type-name {{ item.name }}
                    .cooperation-platform-wrap
                      .platform-detail-content {{ item.companyRecord }}
                .indicator
                  .dot(v-for="(item, index) in cooperationPlatformData" :key="index" :class="{ active: index === supplyChainPlatformActiveIndex }")
            //- 供应链金融产品
            .supply-chain-finance-product
              .custom-common-header
                .custom-common-title {{ '供应链金融产品' }}
                image.custom-common-tips(:src="previewImg('wx_supplyChain_commonTipsBg')" mode="widthFix" :lazy-load="true" alt="")
              .finance-product-content
                .supply-chain-button-group
                  .supply-chain-type-item(v-for="(item, index) in supplyChainFinanceData" :key="index" :class="{ 'active-tab-btn': index === productTypeActiveIndex }")
                    u-button.default-tab-btn(type="primary" @click="productTypeChange(index)") {{ item.name }}
                .finance-product-box
                  swiper.supply-chain-product-swiper(:class="supplyChainFinanceData[productTypeActiveIndex].id" @change="supplyChainProductChange" circular :indicator-dots="swiper.indicatorDots" :autoplay="swiper.autoplay" :interval="4000" :duration="swiper.duration")
                    swiper-item(class="swiper-item" v-for="(productItem, productIndex) in supplyChainFinanceData[productTypeActiveIndex].newPoductList" :key="productIndex")
                      .main-product-box
                        .main-product-card(v-for="(childProductItem, childProductIndex) in productItem" :key="childProductIndex")
                          .supply-product-wrap
                            .product-logo(v-if="childProductItem.logoFileId")
                              image.logo-img(:src="childProductItem.logoUrl" mode="widthFix" :lazy-load="true" alt="")
                            .product-name {{ childProductItem.name }}
                            .product-loan-box
                              .title {{ childProductItem.amount ? '最高可贷金额' : '贷款范围' }}
                              .amount {{ childProductItem.loanLimit }}
                            .product-range-box
                              .title {{ '贷款利率' }}
                              .amount {{ childProductItem.rateRange }}
                            u-button.u-active-filter-btn(type="primary" @click="productDetailHandle(supplyChainFinanceData[productTypeActiveIndex], childProductItem)") {{ '我要申请' }}
                  .indicator
                    .dot(v-for="(productItem, productIndex) in supplyChainFinanceData[productTypeActiveIndex].newPoductList" :key="productIndex" :class="{ active: productIndex === supplyChainProductActiveIndex }")
            //- 金融机构
            .finance-institution-wrap
              .custom-common-header
                .custom-common-title {{ '金融机构' }}
                image.custom-common-tips(:src="previewImg('wx_supplyChain_commonTipsBg')" mode="widthFix" :lazy-load="true" alt="")
              .finance-institution-content
                .finance-institution-item(v-for="(item, index) in financeInstitutionData" :key="index" @click="institutionDetailHandle(item)")
                  image.institution-bg(:src="previewImg(item.imgBgConstant)" mode="widthFix" :lazy-load="true" alt="")
                    .finance-institution-name {{ item.name }}
            //- 供应链核心企业
            .core-enterprise-wrap
              .custom-common-header
                .custom-common-title {{ '供应链核心企业' }}
                image.custom-common-tips(:src="previewImg('wx_supplyChain_commonTipsBg')" mode="widthFix" :lazy-load="true" alt="")
              .core-enterprise-content
                .core-enterprise-img(@click="coreEnterpriseDetailHandle('gj')")
                  image.enterprise-logo(:src="previewImg('wx_supplyChain_coreEnterpriseGjLogo')" mode="widthFix" :lazy-load="true" alt="")
                .core-enterprise-img(@click="coreEnterpriseDetailHandle('ht')")
                  image.enterprise-logo(:src="previewImg('wx_supplyChain_coreEnterpriseHtLogo')" mode="widthFix" :lazy-load="true" alt="")
        CBackTop(:scrollTop="scrollTop" @scrollBackTop="scrollBackTop")
</template>

<script lang="ts">
import { defineComponent, onMounted, reactive, ref } from 'vue'
import Layout from '@/components/layout/index.vue'
import CRich from '@/components/c-rich/index.vue'
import CBackTop from '@/components/c-back-top/index.vue'
import { previewImg } from '@/util/utils'
import { countDisplay, countLoanAmount, fileDownload } from '@/api/index'
import type { ApiResponse } from '@/common/http/types'
import type { CoreEnterpriseDataType, FinanceInstitutionDataType, ProductItem, SupplyChainFinanceData, SupplyChainFinanceItem } from './types'
import { externalLinkJump, linkJump } from '@/common/common'

export default defineComponent({
  name: 'supplyChainIndex',
  components: { Layout, CRich, CBackTop },
  setup() {
    const scrollTop = ref<number>(0)
    // 下拉刷新状态
    const refresherTriggered = ref<boolean>(false)
    const swiper = reactive({
      indicatorDots: false, // 显示面板指示点
      autoplay: false, // 自动切换
      duration: 500 // 滑动动画时长
    })
    const isBackTop = ref<boolean>(false)
    // 金融类型
    const financeTypeData = reactive([
      {
        id: 'product-business',
        title: '商业保理'
      },
      {
        id: 'product-finance',
        title: '融资租赁'
      },
      {
        id: 'product-loan',
        title: '小额贷款'
      },
      {
        id: 'product-storage',
        title: '金融仓储'
      },
      {
        id: 'product-bill',
        title: '鄂链通'
      },
      {
        id: 'product-gold',
        title: '鄂票通'
      }
    ])
    // 数据统计
    const stats = reactive([
      { label: 'enterprisesNumSum', apiType: 'countDisplay', title: '注册用户', count: 0, unit: '个' },
      { label: '', title: '入驻核心企业', count: 2, unit: '家' },
      { label: '', title: '金融产品', count: 14, unit: '项' },
      { label: '', title: '金融机构', count: 6, unit: '家' },
      { label: 'loanAmoutSum', title: '融资规模', count: 31635, unit: '万元' },
      { label: 'loanNumSum', title: '票据业务', count: 374, unit: '笔' }
      // { label: 'loanAmoutSum', apiType: 'countLoanAmount', title: '融资规模', count: 0, unit: '万元' },
      // { label: 'loanNumSum', apiType: 'countLoanAmount', title: '票据业务', count: 0, unit: '笔' }
    ])
    // 服务平台
    const cooperationPlatformData = reactive([
      {
        id: 'product-bill',
        name: '鄂链通',
        imgBgConstant: 'wx_supplyChain_cooperationPlatformBg',
        imgLogoConstant: 'wx_supplyChain_eLianTongLogo',
        companyRecord:
          '“鄂链通”支持核心企业将采购贸易过程中的赊销行为产生的应付账款，转换为一种可拆分、可流转、可追溯、可到期持有、可融资的电子债权凭证，为核心企业及上游供应商提供货款结算、应收账款转让、保理融资等供应链金融金融服务。',
        url: 'https://elt.jdh.com.cn/'
      },
      {
        id: 'product-gold',
        name: '鄂票通',
        imgBgConstant: 'wx_supplyChain_cooperationPlatformBg',
        imgLogoConstant: 'wx_supplyChain_ePiaoTongLogo',
        companyRecord:
          '“鄂票通”通过连接上海票交所，审核供应链票据业务相关材料，实现供应链票据的签发、拆分、流转及闭环追踪管理，同时基于票交所底层支持，可与各银行的新一代票据系统直接进行承兑、保证、贴现、质押、到期清算等业务交互。',
        url: ''
      }
    ])
    // 供应链金融产品
    const productTypeActiveIndex = ref(0)
    const supplyChainFinanceData: SupplyChainFinanceData = reactive([
      {
        id: 'product-business',
        name: '商业保理类',
        tips: '提供全面的金融服务，帮助供应商优化现金流、降低坏账风险、提高运营效率，从而更好地支持其业务发展。',
        productList: [
          {
            id: '1-1',
            logoFileId: '',
            name: '工程保理',
            institutionsUniscId: 'fa152a434eb9435bb46a0cf118ff3ca1',
            institutionsName: '湖北金控商业保理有限公司',
            amount: '',
            startAmount: '1,000',
            endAmount: '50,000',
            startRange: '0',
            endRange: '0',
            productDetailId: '623d2622f723477c90530769ae5b82e5',
            productDesc: '工程保理产品',
            customerDesc: '中小型建筑企业、国企或其控股子公司',
            entryCriteria:
              '1.基于卖方信用准入标准以下标准需同时满足：（1）施工方原则上具备工程施工一级及以上资质；（2）施工方具备主体AA 及以上评级（若客户有开展主体评级）；（3）施工方资产负债率原则上不高于 85%。2.基于买方信用准入标准以下标准满足其一：（1）上市公司（非 ST 股、连续两年盈利）及其核心子公司 ；（2）国有及国有控股企业；（3）主体评级为AA 及以上企业；（4）可以增加回购、担保等有效风控措施的企业，且还款来源明确的。'
          },
          {
            id: '1-2',
            logoFileId: '',
            name: '贸易保理',
            institutionsUniscId: 'fa152a434eb9435bb46a0cf118ff3ca1',
            institutionsName: '湖北金控商业保理有限公司',
            amount: '',
            startAmount: '1,000',
            endAmount: '50,000',
            startRange: '0',
            endRange: '0',
            productDetailId: 'c277c28ddaf34d8da6a2f3404764eafc',
            productDesc: '贸易保理产品',
            customerDesc: '国企或其控股子公司',
            entryCriteria:
              '以下标准满足其一：1.上市公司（非ST 股、连续两年盈利）；2.国有及国有控股企业；3.中国 500 强企业及其全资、控股子公司（以中国企业联合会、中国企业家协会榜单）；4.主体评级为 AA+及以上企业；5.可以增加回购、担保等有效风控措施的企业，且还款来源明确的企业。'
          },
          {
            id: '1-3',
            logoFileId: '',
            name: '国资企业保理',
            institutionsUniscId: 'fa152a434eb9435bb46a0cf118ff3ca1',
            institutionsName: '湖北金控商业保理有限公司',
            amount: '',
            startAmount: '1,000',
            endAmount: '50,000',
            startRange: '0',
            endRange: '0',
            productDetailId: '0f3aec9cf59d48b28a3a858cc5fed9d0',
            productDesc: '国资企业保理产品',
            customerDesc: '层级为地级市、县级市及以上国资平台',
            entryCriteria:
              '核心客户准入以下标准需同时满足：1.客户层级为地级市（含辖区） 、县级市及以上，控股股东为当地国资委、财政局、管委会及全民所有制之一，客户性质为国有企业或事业单位；2.交易对手的主体评级不低于 AA 级，或资产规模大于 100亿元；3.交易对手净资产不低于 20 亿元，资产负债率不高于 75%；4.融资结构中，银行加债券融资占比原则上高于 65%。（本条仅适用于新增客户，存量客户仍按 60%执行）'
          },
          {
            id: '1-4',
            logoFileId: '',
            name: '资产支持证券',
            institutionsUniscId: 'fa152a434eb9435bb46a0cf118ff3ca1',
            institutionsName: '湖北金控商业保理有限公司',
            amount: '',
            startAmount: '1,000',
            endAmount: '50,000',
            startRange: '0',
            endRange: '0',
            productDetailId: '129150f01eba40d580bcd5086fcf342f',
            productDesc: '资产支持证券产品',
            customerDesc: '满足资产支持证券核心客户准入标准',
            entryCriteria: '资信评级为AA+及以上 。'
          },
          {
            id: '1-5',
            logoFileId: '',
            name: '资产支持票据',
            institutionsUniscId: 'fa152a434eb9435bb46a0cf118ff3ca1',
            institutionsName: '湖北金控商业保理有限公司',
            amount: '',
            startAmount: '1,000',
            endAmount: '50,000',
            startRange: '0',
            endRange: '0',
            productDetailId: '0499188862874bffbadd127cd5ac5b71',
            productDesc: '资产支持票据产品',
            customerDesc: '满足资产支持证券核心客户准入标准',
            entryCriteria: '资信评级为AA+及以上 。'
          },
          {
            id: '1-6',
            logoFileId: '',
            name: '特殊无追索权保理',
            institutionsUniscId: 'fa152a434eb9435bb46a0cf118ff3ca1',
            institutionsName: '湖北金控商业保理有限公司',
            amount: '',
            startAmount: '1,000',
            endAmount: '50,000',
            startRange: '0',
            endRange: '0',
            productDetailId: 'b1bfe97128204797a62adf2b11d10738',
            productDesc: '特殊无追索权保理产品',
            customerDesc: '强资质国企或其控股子公司',
            entryCriteria: '以下标准满足其一：1.大型央企、国企及上市公司背景业；2.中国 100 强（以中国企业联合会、中国企业家协会榜单）企业及其全资、控股子公司；3.经营状况好，资产流动性及盈利能力强。'
          },
          {
            id: '1-7',
            logoFileId: '',
            name: '供应链贸易融资',
            institutionsUniscId: '0eb7fc8c898c4ef0ad69d3a80eac43f2',
            institutionsName: '汉口银行股份有限公司襄阳分行',
            amount: '',
            startAmount: '100',
            endAmount: '300',
            startRange: '3.85',
            endRange: '6',
            productDetailId: '9ac2e3b41ba74031ad6b68d4f52ce287',
            productDesc: '依托核心客户上下游供应商形成供应链，对核心客户的上下游发放融资贷款。',
            customerDesc: '企业',
            entryCriteria: '核心客户准入我行'
          },
          {
            id: '1-8',
            logoFileId: '',
            name: '中企云链供应链金融',
            institutionsUniscId: '08d32bab572b4dc3939086efcbf3b425',
            institutionsName: '华夏银行股份有限公司荆门分行',
            amount: '',
            startAmount: '1',
            endAmount: '1,000',
            startRange: '5.2',
            endRange: '6.5',
            productDetailId: 'a619cfd2d39b4ca1a7bb1e4523af220a',
            productDesc:
              '指融资申请人（卖方或保理商）通过云链平台将其持有的核心客户或纳入其担保范围的分子公司开立的云信为凭证的应收账款转让给我行，并向我行申请无追索权国内保理融资，利率根据客户信用风险评级和LPR定价；贷款额度最高不超过转让给我行的应收账款的100%。',
            customerDesc: '优质央企、地方国企或上市公司及其核心分子公司的上下游中小企业供应商。',
            entryCriteria: '暂无内容'
          },
          {
            id: '1-9',
            logoFileId: '',
            name: '数字供应链',
            institutionsUniscId: '7c76dce99f2443c29a3b2e1de133478c',
            institutionsName: '中国工商银行股份有限公司十堰分行',
            amount: '10,000',
            startAmount: '',
            endAmount: '',
            startRange: '3.85',
            endRange: '9.9',
            productDetailId: '8daa27cfc0514f27a2d8003d22bc02df',
            productDesc: '运用区块链技术，将核心企业、供应商、银行集中在一个平台上，基于核心企业的信用，以供应商对核心企业的应收账款债权转让为基础，对供应商发放的融资',
            customerDesc: '线上产品、成本低、效率高、选择多',
            entryCriteria: '应付账款、上游供应商较多、综合实力较强的核心企业，向核心企业交付货物后因赊销产生应收账款融资需求的上游供应商。'
          },
          {
            id: '1-10',
            logoFileId: '',
            name: '核心客户供应链',
            institutionsUniscId: 'efabf10e47f64629b00c984aee2a0ed9',
            institutionsName: '中国银行股份有限公司',
            amount: '1,000',
            startAmount: '',
            endAmount: '',
            startRange: '3.5',
            endRange: '4',
            productDetailId: '360fffee963447668b71a8da73d09795',
            productDesc: '核心客户供应链是指依托核心客户，根据核心客户与其上下游供应商真是贸易背景为其上下游供应商提供融资，即“1+N”模式',
            customerDesc: '核心客户上游客户如湖北富迪实业股份有限公司上游客户',
            entryCriteria: '1、借款人及实际控制人信用情况良好，无不良、逾期等情形 2、与核心客户存在真实贸易背景'
          }
        ]
      },
      {
        id: 'product-storage',
        name: '金融仓储类',
        tips: '提供仓储保管与监管、动产抵质押管理、咨询与评估、物流、质押品交易、信息化以及合作与拓展等多个方面的服务，有助于解决中小企业融资难的问题，促进金融业的稳健发展。',
        productList: [
          {
            id: '2-1',
            logoFileId: '3f5d992dc4f24b2dbdfc0d9f89b9e98a',
            name: '仓储设施贷款(项目)',
            institutionsUniscId: 'fa9c245158b24b348fa9d5761049c425',
            institutionsName: '中国农业发展银行荆门分行',
            amount: '50,000',
            startRange: '3.87',
            endRange: '5.75',
            productDetailId: 'b65a4bd0fe6448bea22e42b14ffdd109',
            productDesc: '用于解决借款人在涉农产业生产经营活动中的固定资产投资项目需求的本外币贷款。',
            customerDesc: '暂无内容',
            entryCriteria: '暂无内容'
          },
          {
            id: '2-2',
            logoFileId: 'd2be2e6b8ed344f3b4b16dfed1693aee',
            name: '核心客户供应链融资',
            institutionsUniscId: 'a638791cf8ec4baa9c7b8342ab2c85e9',
            institutionsName: '中国银行股份有限公司荆门分行',
            amount: '',
            startAmount: '12',
            endAmount: '1,500',
            startRange: '5.2',
            endRange: '5.2',
            productDetailId: 'aaa4f1684f4740a58f7479ec0fb9497b',
            productDesc:
              '“核心客户供应链业务主要是以核心客户推荐的供应链客户作为借款人，并以锁定借款人对核心客户的应收账款作为还款来源，从而将借款人的信用风险捆绑于核心客户，为供应链客户融资的业务。该业务项下合作模式包括但不限于核心客户担保、应收账款静态质押模式、应收账款动态质押模式或其他模式等。',
            customerDesc: '暂无内容',
            entryCriteria: '暂无内容'
          },
          {
            id: '2-3',
            logoFileId: '58575e0f46444239b03b270ff76e09d4',
            name: '物流E贷',
            institutionsUniscId: '17e1388ed1254b28801f40128872d4f9',
            institutionsName: '中信银行股份有限公司黄石分行',
            amount: '1,000',
            startRange: '7',
            endRange: '7',
            productDetailId: '13740d26fdbe48ce84cb64c26ecde54d',
            productDesc:
              '我行与代投保机构（以下简称“投保人”）合作，借款人委托投保人投保，在保险公司出具合格保单的前提下，我行以保单项下退保资金作为还款保障，向符合授信准入条件的小微企业提供的人民币流动资金贷款服务。',
            customerDesc: '有车险分期业务的公司，且符合国家企业划型标准，在我行单户授信额度不超过1000万的小微企业法人。',
            entryCriteria:
              '1、有固定经营场所营业执照；2、信用记录良好；3、持续经营6个月以上；4、借款企业实际控制人年龄在18-65周岁之间；5、借款企业“特流E贷车险分期”产品的申请额度和在我行已取得的授信额度之和不超过1000万元（含 ）。'
          },
          {
            id: '2-4',
            logoFileId: '9a1ab5ffbcba481abb66affa20d9fc77',
            name: '物流快贷',
            institutionsUniscId: '42665a70b27a419bb3e5aa4ab628a62c',
            institutionsName: '湖北襄阳农村商业银行股份有限公司',
            amount: '',
            startAmount: '30',
            endAmount: '50',
            startRange: '5.5',
            endRange: '7.83',
            productDetailId: 'fee642da2d4746fcb400d68fad755e8a',
            productDesc: '用于借款人购买牵引车、自卸车、载货车、专用车等具有运输用途非载人商用车，或从事汽车运输经营过程中产生的正常资金需求的经营类贷款。',
            customerDesc: '企业主,个体户。',
            entryCriteria: '辖内运输行业经营者。'
          }
        ]
      }
    ])
    const supplyChainFinanceNoData = reactive([
      {
        id: 'product-finance',
        name: '融资租赁类',
        tips: '提供包括融资、资产管理、设备促销、灵活配置、资本形态转化和税务优化在内的全方位服务，满足承租人在设备投资、资金配置和资产管理等方面的多样化需求。',
        noDataBgConstant: 'wx_supplyChain_noDataBg',
        productList: []
      },
      {
        id: 'product-loan',
        name: '小额贷款类',
        tips: '提供包括融资、多种贷款产品、简便的申请程序、信用评估与管理、咨询服务、资产转让服务以及风险管理等服务，满足客户短期的资金需求，提供相关的咨询和风险管理支持。',
        noDataBgConstant: 'wx_supplyChain_noDataBg',
        productList: []
      }
    ])
    // 金融机构
    const financeInstitutionData: FinanceInstitutionDataType[] = reactive([
      {
        id: 'jrcc',
        name: '湖北省金融仓储有限公司',
        imgBgConstant: 'wx_supplyChain_institutionCangchuBg',
        content:
          '<p>经营范围包括一般项目：动产质押物管理服务，仓单登记服务，普通货物仓储服务（不含危险化学品等需许可审批的项目），承接档案服务外包，信息咨询服务（不含许可类信息咨询服务），供应链管理服务……</p>',
        companyContent:
          '<p>湖北省金融仓储有限公司是湖北省首家由国有资本主导的金融仓储公司隶属于湖北宏泰集团有限公司。</p><p>湖北省金融仓储有限公司是一家专业从事第三方动产质押监管、动产监控管理、仓储输出管理（仓单质押融资）和供应链管理咨询等综合服务的机构，通过搭建线上线下数实结合的风控管理模式，结合地域特色、行业标准，建立规范化操作流程和先进内控制度，全力推动金融机构重塑动产质押信用体系，为金融机构提供专业可信的货品管理服务，助力中小企业解决融资难、融资贵的问题。</p>',
        // 产品与服务
        productService: [
          {
            imgBgConstant: 'wx_supplyChain_institutionCangchuBg1',
            name: '动产质押监管/动产监控管理',
            content: '受金融机构委托，通过对融资企业的存货实施第三方驻场监管/监控服务。'
          },
          {
            imgBgConstant: 'wx_supplyChain_institutionCangchuBg2',
            name: '物联网监控',
            content: '受金融机构委托，通过对融资企业加装物联网设备，并按金融机构要求对融资企业开展定期或不定期巡库服务。'
          },
          {
            imgBgConstant: 'wx_supplyChain_institutionCangchuBg3',
            name: '仓储管理服务',
            content: '为解决供应链上企业融资需求，以地域特色资源产品为基础，建立集中供应链仓储节点，由金储公司负责运营管理，对外提供仓储保管服务。'
          }
        ],
        // 功能优势
        functionAntages: [
          {
            name: '公信力强',
            imgBgConstant: 'wx_supplyChain_institutionCangchuStorageBg',
            content: '省属唯一国资金融仓储公司。'
          },
          {
            name: '产品丰富',
            imgBgConstant: 'wx_supplyChain_institutionCangchuInternetBg',
            content: '面向金融机构、供应链公司提供存货监管、仓储管理等一站式服务。'
          },
          {
            name: '运用数字化存货管理平台',
            imgBgConstant: 'wx_supplyChain_institutionCangchuSuperviseBg',
            content: '打通融资企业与金融机构基于“物的信用”供应链融资通道，实现存货资产数字化转变。'
          }
        ],
        // 合作机构
        cooperationList: [],
        // 联系我们
        addressInfo: {
          address: '<p>地址：湖北省武汉市洪山区欢乐大道1号宏泰大厦16楼</p>',
          phone: '电话：18627166829',
          time: '服务时间：08:30-17:30',
          mail: ''
        },
        imgLogoConstant: 'wx_supplyChain_institutionCangchuBgLogo'
      },
      {
        id: 'jksybl',
        name: '湖北金控商业保理有限公司',
        imgBgConstant: 'wx_supplyChain_institutionJinkongBg',
        content: '<p>经营范围包括进出口保理业务；国内及离岸保理业务；与商业保理相关的咨询服务。（依法须经审批的项目，经相关部门审批后方可开展经营活动）湖北金控商业保理有限公司对外投资1家公司。</p>',
        companyContent:
          '<p>湖北金控商业保理有限公司（以下简称“公司”）成立于 2017年7月19日，注册资金5亿元，是湖北宏泰集团有限公司（简称“宏泰集团”）所属的专业保理金融服务公司。</p><p>公司以国企、央企、上市公司为核心企业，实现了新兴产业类、政府信用类产业类、绿色金融类产业类等项目投放，快步形成产品多样化格局，为湖北省近百家知名企业提供了全面的金融服务，业务规模多年来保持全省排名第一。作为湖北省首家商业保理公司，2020年纳入全省监管的商业保理公司名单，并被评为“A”类企业，2019-2022年连续四年被国家税务总局湖北省税务局评为“A级纳税人”；2022年，荣获第三届年度湖北财经风云榜“年度最具影响力金融品牌”“年度最佳金融科技创新机构”等奖项；2022年10月纳入湖北省地方金融监督管理局监管“白名单”，成为湖北省7家被纳入“白名单”的商业保理公司之一；2023年4月荣获“2022年金融支持东湖高新区经济社会发展突出贡献奖”；2023年12月荣获湖北日报财经风云榜“最佳金融产品创新机构”奖项。</p>',
        // 产品与服务
        productService: [
          {
            imgBgConstant: 'wx_supplyChain_institutionJinkongBg1',
            name: '工程保理产品',
            content: '围绕省内重大项目，积极为建筑企业纾困，以工程保理为支点。已与中电建、中交二航局、中国一冶等知名建筑施工企业接洽并建立合作关系。'
          },
          {
            imgBgConstant: 'wx_supplyChain_institutionJinkongBg2',
            name: '政信业务',
            content: '以政信业务为核心，深入参与城镇化建设，推动县域经济发展。已实现与阳逻、孝感、恩施、黄石等多个地市区域政信客户的合作，成功投放十余家客户项目。'
          },
          {
            imgBgConstant: 'wx_supplyChain_institutionJinkongBg3',
            name: '产业类保理服务',
            content: '深入挖掘客户产业类资源，优先对产业底层资产进行营销。已在宜昌、孝感的新能源产业和十堰的生态修复产业中提供保理金融服务，并逐步实现产业链嵌入。'
          },
          {
            imgBgConstant: 'wx_supplyChain_institutionJinkongBg4',
            name: '咨询服务',
            content: '提供与商业保理业务相关的咨询服务，帮助客户更好地理解和使用保理产品'
          }
        ],
        // 功能优势
        functionAntages: [],
        // 合作机构
        cooperationList: [],
        // 联系我们
        addressInfo: {
          address: '<p>地址：武汉市洪山区梨园街道欢乐大道1号宏泰大厦22楼</p>',
          phone: '',
          time: '',
          mail: ''
        },
        url: 'https://www.hbhtgroup.com/cyqy_459/zhjrfw/202204/t20220414_10084.shtml'
      },
      {
        id: 'rzzdb',
        name: '湖北省融资再担保集团有限公司',
        imgBgConstant: 'wx_supplyChain_institutionDanbaoBg',
        content: '<p>湖北省融资再担保集团有限公司于2015年11月成立，为省级国有独资公司，注册资本金55亿元。公司承担的使命是，坚持政策性为主和提供准公共产品的定位……</p>',
        companyContent:
          '<p>为贯彻《国务院关于促进融资担保行业加快发展的意见》（国发〔2015〕43号）精神，推进政府主导的省级再担保机构基本实现全覆盖，构建国家融资担保基金、省级再担保机构、辖内融资担保机构的三层组织体系，充分发挥再担保“稳定器”和“放大器”作用，湖北省人民政府决定组建湖北省再担保集团有限公司（以下简称公司）。</p><p>公司于2015年11月在武汉挂牌成立，2017年12月调整为省政府国资委直接出资监管，2020年6月调整为省财政厅履行出资人职责，2022年1月划转入湖北宏泰集团，现注册资本金37.6569亿元。公司是全省政府性融资担保体系的核心和龙头、国家扶持政策整合的平台、政银担合作的窗口，按照“政府主导、专业管理、市场运作”原则，坚持政策性为主和提供准公共产品的功能定位，发挥再担保“增信、分险、规范、引领”功能，以股权投资和再担保业务为纽带，构建全省政府性融资担保体系，统一全省政府性融资担保机构的管理要求和服务标准，提升体系整体管理水平和抗风险能力，扩大全省小微企业和“三农”“双创”融资担保业务规模。</p>',
        // 产品与服务
        productService: [],
        // 功能优势
        functionAntages: [],
        // 合作机构
        cooperationList: [],
        // 联系我们
        addressInfo: {
          address: '<p>地址：武汉市洪山区欢乐大道1号东湖国贸中心A栋宏泰大厦26-27楼</p>',
          phone: '电话：027-87321268',
          time: '',
          mail: '邮箱：ywb@hbszdb.com'
        },
        url: 'http://hbszdb.com/index.html'
      },
      {
        id: 'jkrzzl',
        name: '湖北金控融资租赁有限公司',
        imgBgConstant: 'wx_supplyChain_institutionGaotouBg',
        content: '<p>经营范围包括融资租赁业务；租赁业务；向国内外购买租赁财产；租赁财产的残值处理及维修；租赁交易咨询；接受承租人的租赁保证金；向商业银行、商业保理公司转让应收租赁款……</p>',
        companyContent:
          '<p>湖北金控融资租赁有限公司成立于2014年11月27日，注册资金5亿元，公司以“打造省内标杆融资租赁公司”为战略目标，积极为全省经济社会发展提供优质高效的金融服务，于2015年3月2日被国家商务部、税务总局批准为“第十三批内资融资租赁业务试点企业”，于2021年10月27日，荣获“西湖论坛杯”租赁企业管理奖。公司立足服务全省实体产业转型发展，积极采取直租、售后回租、经营租赁产品，依托宏泰集团的资源优势、渠道优势、品牌优势和人才优势，发挥融资与融物相结合，创新服务模式。积极围绕省内重点行业、实体产业链、绿色金融、技改升级以及路网、水网、基础设施等公用民生事业，提供优质高效的融资租赁。目前，公司服务项目已遍布全省各地市（州），并先后与多家经融机构达成合作。</p>',
        // 产品与服务
        productService: [
          // {
          //   imgBgConstant: 'wx_supplyChain_institutionGaotouBg1',
          //   name: '现代物流业融资租赁',
          //   content: '近年来，武汉市现代物流业发展迅猛，截止2013年底，武汉城市圈已有A级物流企业78家，现代物流业固定资产投资在300亿元，融资租赁...'
          // },
          // {
          //   imgBgConstant: 'wx_supplyChain_institutionGaotouBg2',
          //   name: '新能源汽车融资租赁',
          //   content: '近年来，武汉市现代物流业发展迅猛，截止2013年底，武汉城市圈已有A级物流企业78家，现代物流业固定资产投资在300亿元，融资租赁...'
          // },
          // {
          //   imgBgConstant: 'wx_supplyChain_institutionGaotouBg3',
          //   name: '光电子信息产业融资租赁',
          //   content: '近年来，武汉市现代物流业发展迅猛，截止2013年底，武汉城市圈已有A级物流企业78家，现代物流业固定资产投资在300亿元，融资租赁...'
          // }
        ],
        // 功能优势
        functionAntages: [
          // {
          //   name: '盘活存量资产',
          //   imgBgConstant: 'wx_supplyChain_institutionGaotouBankBg',
          //   content: '售后回租将承租人固定资产盘活变现，将实物资产变为金融资产'
          // },
          // {
          //   name: '加速设备更新',
          //   imgBgConstant: 'wx_supplyChain_institutionGaotouUpdateBg',
          //   content: '售后回租将承租人固定资产盘活变现，将实物资产变为金融资产'
          // },
          // {
          //   name: '灵活使用资金',
          //   imgBgConstant: 'wx_supplyChain_institutionGaotouCapitalBg',
          //   content: '售后回租将承租人固定资产盘活变现，将实物资产变为金融资产'
          // },
          // {
          //   name: '调整负债结构',
          //   imgBgConstant: 'wx_supplyChain_institutionGaotouLiabilitiesBg',
          //   content: '售后回租将承租人固定资产盘活变现，将实物资产变为金融资产'
          // },
          // {
          //   name: '扩大投资规模',
          //   imgBgConstant: 'wx_supplyChain_institutionGaotouExpandBg',
          //   content: '售后回租将承租人固定资产盘活变现，将实物资产变为金融资产'
          // }
        ],
        // 合作机构
        cooperationList: [],
        // 联系我们
        addressInfo: {
          address: '<p>地址：武汉市洪山区梨园街道欢乐大道1号宏泰大厦31楼</p>',
          phone: '',
          time: '',
          mail: ''
        },
        url: 'https://www.hbhtgroup.com/cyqy_459/zhjrfw/202204/t20220414_10085.shtml'
      },
      {
        id: 'zjts',
        name: '重庆中金同盛小额贷款有限公司',
        imgBgConstant: 'wx_supplyChain_institutionZhongjinBg',
        content: '<p>2017年，重庆中金同盛小额贷款有限公司在重庆成立，注册资本金7亿元。目前由湖北省宏泰金融投资控股有限公司和银联商务股份有限公司分别持股52%和48%……</p>',
        companyContent:
          '<p>2017年，重庆中金同盛小额贷款有限公司在重庆成立，注册资本金7亿元。目前由湖北省宏泰金融投资控股有限公司和银联商务股份有限公司分别持股52%和48%。</p><p>公司秉承“科技驱动、普惠金融、纾困小微、国企使命”经营原则，央地国企联合持股，依托银联商务全国收单网络和商户资源，践行国企担当，用金融“活水”滴灌小微企业，以服务民营小微为己任，致力打造科技普惠型国有头部机构。自2018年起当选为重庆市小额贷款公司协会副会长单位。</p>',
        // 产品与服务
        productService: [
          {
            imgBgConstant: 'wx_supplyChain_institutionZhongjinBg1',
            name: '商e融',
            content: '由中金同盛小贷联合天天富平台及磁金融共同推出的针对银联商务收单商户的个人经营性贷款产品。'
          }
        ],
        // 功能优势
        functionAntages: [],
        // 合作机构
        cooperationList: [],
        addressInfo: {
          address: '<p>地址：重庆市渝北区新溉大道99号7号楼28层</p>',
          phone: '电话：021-67273955',
          time: '服务时间：24小时客服热线95534',
          mail: ''
        },
        url: 'https://www.chinaums.com/zjtsums/'
      },
      {
        id: 'kjrzdb',
        name: '湖北省科技融资担保有限公司',
        imgBgConstant: 'wx_supplyChain_institutionRongziBg',
        content: '<p>湖北省科技融资担保有限公司于2022年5月13日揭牌成立，由湖北省再担保集团出资，属于湖北宏泰集团旗下政策性金融板块的重要成员。</p>',
        companyContent:
          '<p>湖北省科技融资担保有限公司于2022年5月13日揭牌成立，由湖北省再担保集团出资，属于湖北宏泰集团旗下政策性金融板块的重要成员。</p><p>公司紧紧围绕湖北省委、省政府战略部署，以金融创新更好服务科技创新，聚焦全省高新技术企业、科技型中小企业和“专精特新”企业，通过业务引领、产品研发、培训指导和股权纽带等，发挥全省科技融资担保体系龙头作用，全面建成覆盖全省的科技融资担保体系。</p>',
        // 产品与服务
        productService: [
          {
            imgBgConstant: 'wx_supplyChain_institutionRongziBg1',
            name: '科担贷',
            content:
              '合作银行向符合条件的中小微科技型企业或其实际控制人、股东、高管、技术骨干提供经营性融资，以信用保证、知识产权质押等非实物资产抵（质）押方式作为主要反担保措施。省科担为借款人提供连带责任保证。'
          },
          {
            imgBgConstant: 'wx_supplyChain_institutionRongziBg2',
            name: '科担快贷',
            content:
              '合作银行依托大数据风控模型，借助国家公共信用信息中心构建企业信用综合评价体系，按照“3分钟申贷、0人工干预、一键式提款”模式，向科创类企业或企业主提供开展技术转化、产业升级的融资。省科担为借款人提供连带责任保证。'
          }
        ],
        // 功能优势
        functionAntages: [],
        // 合作机构
        cooperationList: [],
        addressInfo: {
          address: '<p>地址：湖北省武汉市东湖新技术开发区高新大道770号光谷科技大厦A座14层（1）室</br>湖北省武汉市洪山区欢乐大道1号宏泰大厦25楼</p>',
          phone: '电话：027-88100227/027-88100229',
          time: '',
          mail: '邮箱：operation@hbskjdb.com'
        },
        url: 'https://www.hbskjdb.com/'
      }
    ])
    // 核心企业
    const coreEnterpriseData: CoreEnterpriseDataType = reactive({
      gj: {
        name: '黄鹤楼酒业有限公司',
        content1:
          '<p>古井集团黄鹤楼酒业有限公司是集研发、生产、销售于一体的大型白酒企业，拥有武汉、咸宁、随州三大基地，员工2000余人。2016年，黄鹤楼酒与“中国老八大名酒”古井贡酒正式开启战略合作，开创“中国双名酒”新格局。</p>',
        content2:
          '<p>黄鹤楼酒历史悠久，公元223年就有“酒醉水淋群臣”的典故;公元1898年湖广总督张之洞将酒进献给光绪皇帝，被赐名“天成坊”，寓意“佳酿天成，国富民强”;1952年，成立国营武汉酒厂;1979年，产量突破一万吨，成为当时全国产量最大的酒厂;1984年第四届全国评酒会，获得“中国名酒”称号;1989年第五届全国评酒会蝉联“中国名酒”称号;2006年，获得“纯粮固态发酵”标志证书;2011年，被国家商务部认定为“中华老字号”品牌;2017年，被国家工商总局商标局认定为“中国驰名商标”。</p>',
        content3:
          '<p>目前公司主要的产品系列有大清香系列、陈香系列、生态原浆系列、楼系列。其中大清香系列传承百年汉汾酒酿造工艺，一经上市便获得市场广泛赞誉;陈香系列以“香气更优雅、入口更绵柔、回味更顺爽”的优良品质，深受广大消费者喜爱;生态原浆系列实现“品质、口感、包装”三大升级，更香柔、不上头，是喜宴用酒新选择;楼系列产品作为中国名酒类品牌，远销海外。</p>',
        content4: '<p>近年来，公司加大了基础设施和技术研发投入，加快了人才培育和管理体系建设。目前，公司拥有包括国家级白酒评委、高级工程师、酿酒高级技师在内的技术型人才30余位。</p>',
        content5:
          '<p>黄鹤楼酒业秉承“做真人，酿美酒，善其身，济天下”的企业价值观，以“向生产要质量，向质量要口感，向口感要风格，向风格要不同”的生产宗旨，在产品质量和品牌塑造上精益求精，追求卓越，努力做中国受欢迎的、受尊重的白酒企业。未来，将与古井贡酒一起实施“双名酒矩阵、双市场共振、双品牌驱动”战略，实现黄鹤楼酒名酒复兴目标。古井集团黄鹤楼酒业有限公司是集研发、生产、销售于一体的大型白酒企业，拥有武汉、咸宁、随州三大基地，员工2000余人。2016年，黄鹤楼酒与“中国老八大名酒”古井贡酒正式开启战略合作，开创“中国双名酒”新格局。</p>',
        content6: '',
        logoImg1: 'wx_supplyChain_coreEnterpriGjBg1',
        logoImg2: 'wx_supplyChain_coreEnterpriGjBg2',
        addressIcon: 'wx_supplyChain_addressIcon',
        phoneIcon: 'wx_supplyChain_phoneIcon',
        emailIcon: 'wx_supplyChain_emailIcon',
        addressList: [
          {
            name: '黄鹤楼酒业有限公司',
            address: '武汉市汉阳区鹦鹉大道558号',
            phone: '027-84528880',
            mail: '430050'
          },
          {
            name: '黄鹤楼(咸宁)酒业有限公司',
            address: '湖北省咸宁市高新技术产业园区金桂大道259号',
            phone: '0715-8190021',
            mail: '437000'
          },
          {
            name: '黄鹤楼(随州)酒业有限公司',
            address: '湖北省随州市曾都区随州大道与青年东路交叉口东北400米',
            phone: '0722-3581766',
            mail: '441300'
          }
        ],
        url: 'https://www.hhljy.com.cn'
      },
      ht: {
        name: '湖北省宏泰供应链管理有限公司（湖北省经贸有限公司）',
        content1:
          '<p>湖北省宏泰供应链管理有限公司成立于2017年7月，注册资金5亿元。公司作为大宗商品供应链企业，主要服务于上游及中游厂商的采购、库存及分销给下游用户等各个环节。从产业“中游”向“上下游”，从“贸易分销”到“加工制造”，贯穿于大宗商品的生产与流通全产业链，为客户提供全方位、多层次、个性化的集成服务，从而保障工业生产过程的连续性、促进工业技术进步、产业升级以及提高生产效率，致力于打造“具有核心竞争力的产业链组织者和供应链管理者”。</p>',
        content2:
          '<p>公司主要经营品类涵盖黑色金属、有色金属、能源化工、建筑材料等产业链上多个细分品种。目前，已在华中、华东、华南、华北构建了完善的服务网络，力争覆盖中西部、长三角、大湾区、环渤海等全国大部分区域。公司将以“贸易+服务+金融”的发展思路，做强做优做大大宗商品贸易业务，建设成为一家服务功能强、贸易品类突出、现金流强的综合性供应链服务管理企业，力争实现2022年-2024年营业收入达到30亿元、50亿元和80亿元的目标。</p>',
        addressIcon: 'wx_supplyChain_addressIcon',
        phoneIcon: 'wx_supplyChain_phoneIcon',
        emailIcon: 'wx_supplyChain_emailIcon',
        addressList: [
          {
            name: '湖北省宏泰供应链管理有限公司',
            address: '湖北省武汉市洪山区欢乐大道1号宏泰大厦28楼',
            phone: '027-84528880',
            mail: '430050'
          }
        ],
        url: ''
      }
    })
    // 供应链金融平台轮播
    const supplyChainPlatformActiveIndex = ref(0)
    const supplyChainPlatformChange: UniHelper.SwiperOnChange = e => {
      supplyChainPlatformActiveIndex.value = e.detail.current
    }
    // 供应链金融产品类型选择
    const productTypeChange = (index: number) => {
      supplyChainProductActiveIndex.value = 0
      productTypeActiveIndex.value = index
    }
    // 供应链金融产品轮播
    const supplyChainProductActiveIndex = ref(0)
    const supplyChainProductChange: UniHelper.SwiperOnChange = e => {
      supplyChainProductActiveIndex.value = e.detail.current
    }
    // 格式化产品数据
    const formatterProductData = () => {
      supplyChainFinanceData.map((item: SupplyChainFinanceItem) => {
        item.productList.forEach((productItem: ProductItem) => {
          productItem['logoUrl'] = productItem.logoFileId && fileDownload(productItem.logoFileId)
          productItem['rateRange'] = productItem.startRange + '%-' + productItem.endRange + '%'
          productItem['loanLimit'] = productItem.amount ? productItem.amount + ' 万元' : productItem.startAmount + '~' + productItem.endAmount + '万元'
        })
        item.newPoductList = splitArr(item.productList, 2) ?? []
      })
    }
    // 分割数组
    const splitArr = (arr: ProductItem[], size: number): Array<ProductItem[]> => {
      if (arr.length === 0) return []
      const result: Array<ProductItem[]> = []
      for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size))
      }
      return result
    }
    // 滚动到指定地点
    const scrollBackTop = () => {
      isBackTop.value = true
    }
    // 监听滚动
    const onScroll = (event: UniHelper.ScrollViewOnScrollEvent) => {
      scrollTop.value = event.detail.scrollTop
    }
    // 我要申请
    const productDetailHandle = (item: SupplyChainFinanceItem, childProductItem: ProductItem) => {
      const productDetail = JSON.parse(JSON.stringify(item))
      productDetail.productList = []
      linkJump(`/pagesSupplyChain/productDetail/index?parentProductInfo=${encodeURIComponent(JSON.stringify(productDetail))}&productInfo=${encodeURIComponent(JSON.stringify(childProductItem))}`)
    }
    // 机构查看详情
    const institutionDetailHandle = (item: FinanceInstitutionDataType) => {
      linkJump(`/pagesSupplyChain/institutionDetail/index?institutionInfo=${encodeURIComponent(JSON.stringify(item))}`)
      console.log('institutionDetailHandle', item)
    }
    // 核心企业详情
    const coreEnterpriseDetailHandle = (type: string) => {
      const item = coreEnterpriseData[type as 'gj' | 'ht']
      linkJump(`/pagesSupplyChain/coreEnterpriseDetail/index?enterpriseInfo=${encodeURIComponent(JSON.stringify(item))}`)
    }
    // 跳转
    const toLink = (url: string, title?: string) => {
      externalLinkJump(url, title)
    }
    // 下拉刷新
    const refresherrefresh = () => {
      refresherTriggered.value = true
      refreshData()
    }
    // 获取数据统计
    const getStatisticsData = (apiFunc: () => Promise<ApiResponse<any>>, apiType: string) => {
      apiFunc().then(({ data: responseData }: ApiResponse<any>) => {
        setStatisticsData(responseData, apiType)
      })
    }
    // 设置统计数据
    const setStatisticsData = (data: AnyObject, apiType: string) => {
      stats.forEach(stat => {
        if (stat.label && stat.apiType === apiType) {
          stat.count = data[stat.label]
        }
      })
    }
    const handleStartValue = (val: number) => {
      if (val > 0 && val > 10) {
        return val > 100 ? val - 100 : val - 10
      } else {
        return val
      }
    }
    // 刷新数据
    const refreshData = () => {
      try {
        // 获取首页数据统计
        getStatisticsData(countDisplay, 'countDisplay')
        // 获取供应链融资规模统计
        getStatisticsData(countLoanAmount, 'countLoanAmount')
        setTimeout(() => {
          refresherTriggered.value = false
        }, 50)
      } catch (error) {
        setTimeout(() => {
          refresherTriggered.value = false
        }, 50)
        console.log('error', error)
      }
    }
    onMounted(() => {
      // 获取首页数据统计
      getStatisticsData(countDisplay, 'countDisplay')
      // 获取供应链融资规模统计
      getStatisticsData(countLoanAmount, 'countLoanAmount')
      formatterProductData()
    })
    return {
      previewImg,
      scrollTop,
      refresherTriggered,
      isBackTop,
      swiper,
      financeTypeData,
      stats,
      cooperationPlatformData,
      supplyChainFinanceData,
      supplyChainFinanceNoData,
      financeInstitutionData,
      productTypeActiveIndex,
      productTypeChange,
      supplyChainProductActiveIndex,
      supplyChainProductChange,
      supplyChainPlatformActiveIndex,
      supplyChainPlatformChange,
      scrollBackTop,
      onScroll,
      productDetailHandle,
      institutionDetailHandle,
      coreEnterpriseDetailHandle,
      toLink,
      refresherrefresh,
      handleStartValue
    }
  }
})
</script>

<style lang="stylus" scoped>
@import './index.styl'
</style>
