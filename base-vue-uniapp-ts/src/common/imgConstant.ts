// 图片fileId映射关系
interface IimgConstant {
  [key: string]: string
}
const imgConstant: IimgConstant = {
  wx_user_about: '6694814f3daf4fa388f744b7284a690a',
  'wx_common_no-data': '3b6f1662a26c4e9c9695b7738eb232e7',
  wx_login_header: '0e3442b3359243a2aa78ca40ecc2e07d',
  wx_login_logo: 'e40ebffe0fa74dc88b03eb6b4e2d82a7',
  wx_index_hotRecommendation: '88434f9679ab4f9da9d10afe8e69fed6',
  wx_index_producGuaranteeMode: '056b96be27f7429b8ec08d2f4f4b941f',
  wx_index_statistics: '6f426f5d129d479686aee2d85916a333',
  wx_index_statisticsTips: '745468372b704417a2f887efbc0e6d52',
  wx_index_servicesZone: '16446321cecc4f40986d5ed258bb05a5',
  wx_login_needLogin: '27ba75b83b3a43429b33dd769b5cc084',
  // 供应链服务中心-首页
  wx_supplyChain_bannerBg: '0d25c43996df4f23b61190556c5bce6d', // 首页banner
  wx_supplyChain_commonTipsBg: 'a61f04c9f40e4adda513f4d524b865dd', // 通用标题背景
  wx_supplyChain_cooperationPlatformBg: '321a7e5c17dd401da9efd023a50a9f8b', // 服务平台背景
  wx_supplyChain_eLianTongLogo: '3bfd7ae926f04d3bb06e1825ac017155', // 鄂链通logo
  wx_supplyChain_ePiaoTongLogo: '308dd095afb9405c8cb6951ab6adb2a6', // 鄂票通logo
  wx_supplyChain_noDataBg: '55a3a94c62924a60ba0e42f2a25e4461', // 暂无数据背景
  wx_supplyChain_institutionCangchuBg: '47ee1a3e150543c7bb07627060ace05c', // 湖北省金融仓储有限公司
  wx_supplyChain_institutionJinkongBg: '3b2e17371e514da89230fe21ddc69ddd', // 湖北金控商业保理有限公司
  wx_supplyChain_institutionDanbaoBg: '0b3855b1857a44aba643f057dc5eda4a', // 湖北省融资再担保集团有限公司
  wx_supplyChain_institutionGaotouBg: '85a3057083b2473e9ac18ab846958ca2', // 湖北金控融资租赁有限公司
  wx_supplyChain_institutionZhongjinBg: 'd6b4c1eb26e34e51930b69efa7863928', // 重庆中金同盛小额贷款有限公司
  wx_supplyChain_institutionRongziBg: 'fe6d8993149543fdade4aa89963ac02a', // 湖北省科技融资担保有限公司
  wx_supplyChain_coreEnterpriseGjLogo: '3f9054fafa264f1b976f2d6cfe605380', // 古井集团
  wx_supplyChain_coreEnterpriseHtLogo: '75090afedc0748c8b5bfc08997fa5611', // 宏泰
  // 供应链服务中心-产品详情
  wx_supplyChain_productDetailBannerBg: 'e92c5abca6e041fb867c03cb031da8b0', // 供应链-产品详情背景
  // 供应链服务中心-机构详情
  wx_supplyChain_institutionDetailBannerBg: '53cb500f2a69497aa86ded60c6ebae9c', // 背景
  wx_supplyChain_institutionDetailCompany: '060eb3407b6d4dc4bae5eb6740c6e38f', // 公司
  wx_supplyChain_institutionDetailService: '43c8e2ee571047d585bfe0bf646ca76d', // 产品与服务
  wx_supplyChain_institutionDetailAntages: '88b3fba2093944f98419c9d96dcbddc9', // 功能与优势
  wx_supplyChain_institutionDetailCooperative: '36dbb52915444e8c9af4b0cea7ff7e47', // 合作机构
  wx_supplyChain_institutionDetailInfo: 'b83a089103374cdc89597cf26c1f36ea', // 联系我们
  wx_supplyChain_institutionDetailAddress: '6d38ca4546ef48daaf53a8c0fad097ba', // 地址
  wx_supplyChain_institutionGaotouBankBg: 'f882997cda5c4b9ab0fdbe62bc1b51b4', // 盘活存量资产
  wx_supplyChain_institutionGaotouUpdateBg: '137ec05956aa4fd9acb219654013ccc0', // 加速设备更新
  wx_supplyChain_institutionGaotouCapitalBg: '82ad9d42088d4fe89064e16869477172', // 灵活使用资金
  wx_supplyChain_institutionGaotouLiabilitiesBg: '4644cb0041024dcfab10585bb58c6340', // 调整负债结构
  wx_supplyChain_institutionGaotouExpandBg: '0b31e74d1d154666a4e0383655cec711', // 扩大投资规模
  wx_supplyChain_institutionCangchuStorageBg: '199f45f4ae0449a1b1008228fb8bf620', // 仓储
  wx_supplyChain_institutionCangchuInternetBg: '5a70ff2e5e4a4eb29ada8b2cbc9fa3ba', // 物联网
  wx_supplyChain_institutionCangchuSuperviseBg: '3bdbf13518f242d7ac500381af43abd9', // 监管
  wx_supplyChain_institutionCangchuBg1: 'e31bab26837c4bbcb554e3e507867884', // 湖北省金融仓储有限公司-背景1
  wx_supplyChain_institutionCangchuBg2: '5de6db1dc35d493baa25adbcadaddd99', // 湖北省金融仓储有限公司-背景2
  wx_supplyChain_institutionCangchuBg3: '02f29f5951bb488f83fb1ac2dc3d0c54', // 湖北省金融仓储有限公司-背景3
  wx_supplyChain_institutionCangchuBgLogo: '89cff590ba984bc58a7e7ddc2819444a', // 湖北省金融仓储有限公司-公司地址logo
  wx_supplyChain_institutionGaotouBg1: '5e6e9e9645054058927dd3caaa7455cd', // 湖北金控融资租赁有限公司-背景1
  wx_supplyChain_institutionGaotouBg2: '23e371ec4062426b9031272962311a4c', // 湖北金控融资租赁有限公司-背景2
  wx_supplyChain_institutionGaotouBg3: '3dc783232bab4bf6b0e3b3a016e93072', // 湖北金控融资租赁有限公司-背景3
  wx_supplyChain_institutionJinkongBg1: 'ef3293b1b8e840a2862dc018b54d9c0b', // 湖北金控商业保理有限公司-背景1
  wx_supplyChain_institutionJinkongBg2: '937592bbdb774a35943258d088cb1c62', // 湖北金控商业保理有限公司-背景2
  wx_supplyChain_institutionJinkongBg3: '9a5cff1e4e114987aa32f1d99278a707', // 湖北金控商业保理有限公司-背景3
  wx_supplyChain_institutionJinkongBg4: 'e1996da6c0e54b5bb6d637fb83b9a935', // 湖北金控商业保理有限公司-背景4
  wx_supplyChain_institutionRongziBg1: '0258d01d9f21462c855523c1896a2654', // 湖北省科技融资担保有限公司-背景1
  wx_supplyChain_institutionRongziBg2: '962a7e9995cf42c89b6575b1e096c17d', // 湖北省科技融资担保有限公司-背景2
  wx_supplyChain_institutionZhongjinBg1: '4c76dcee933a4ba1af03a4656135beaf', // 重庆中金同盛小额贷款有限公司背景1
  wx_supplyChain_institutionDetailPhone: '14f0be6dccce499ab1dc52a9f3fa2808', // 手机
  wx_supplyChain_institutionDetailEmail: '47a46539081b4f01ae26ad5ece9ffe00', // 邮箱
  // 供应链服务中心-核心企业详情
  wx_supplyChain_coreEnterpriseBannerBg: '8bc540bd1afd41af8074bf786d53d208', // 背景
  wx_supplyChain_coreEnterpriseTitleLeft: 'e0f55c0004664599823f4f464f8b7407', // 标题背景
  wx_supplyChain_coreEnterpriseTitleRight: '76ffb0d4ffd64b6991d733306d0c0ee6', // 标题背景
  wx_supplyChain_coreEnterpriGjBg1: '924795ecb9b4449381c9f2fea330eca4', // 古井集团背景
  wx_supplyChain_coreEnterpriGjBg2: '50a48fe7b3a343dcb03c3680a0dd4804', // 古井集团背景
  wx_supplyChain_addressIcon: '8505c5cf5706419f95c66bdd726b2f4b', // 联系方式地址
  wx_supplyChain_phoneIcon: '79bd387888d34090a7e6fa27c9397d27', // 联系方式电话
  wx_supplyChain_emailIcon: '9726da56e66c487cb9f3eae3612a6128', // 联系方式邮箱
  // 服务专区-首页
  wx_servicesZone_guaranteeZoneLogo: 'b87747c5789441b79b9485e667cc7754', // 担保专区
  wx_servicesZone_greenFinanceZoneLogo: 'd5d43cc616f94061b3e87b743b884d76', // 绿色金融专区
  wx_servicesZone_regionShareholdMarketLogo: '6ec3aa1cca8c463e8a47b28fd07e2c7a', // 区域性股权市场
  wx_servicesZone_trukingLoanCodeLogo: '1af2766da0b34099895ee6f1c423ec9d', // 楚天贷款码
  wx_servicesZone_rongdanCodeLogo: '77c7e870a3764553945630954be27713', // 荆楚融担码
  wx_servicesZone_technologyFinanceZoneLogo: '80dc8469f46a4758b755992ebfec399d', // 科技金融
  wx_servicesZone_talentZoneLogo: '6a0d8014068b47f1b479b6df7ede64c7', // 人才专区
  wx_servicesZone_villageDevelopZoneLogo: 'dc9b657b08ec4df09ee5002ca2db6ada', // 乡村振兴
  wx_servicesZone_supplyChainFinanceLogo: '2b76f45b6b5948cbb63c493eaafcd8ac', // 供应链金融
  wx_servicesZone_efinSgccLogo: '5f056df0152c4f3da953214b8fc5c362', // 电e金服
  wx_servicesZone_ifaCcbLogo: '4b10e8dcd92d4e76868153f648b099a3', // 融智赋能
  // 服务专区-区域股权市场
  wx_servicesZone_marketLogo: 'f3836abe63fd4f07a5071ab823f8dc77', // banner
  wx_servicesZone_qrCode: '5cae59bc950545d794c3659fb078fc6f', // “专精特新”专板简介
  wx_servicesZone_serviceProduct: 'e77085fc6ba643ba95c34068ea60b2a2', // 服务与产品
  wx_servicesZone_policyFile: '482215bcd7ed46f5a7057b32c1f0084e', // 政策文件
  wx_servicesZone_centerWx: '0ab9cccee26347e38697562f00033ff2', // 中心微信
  wx_servicesZone_schoolWx: '3bdabfe0fa154f1ab3717cf40e9b9a43', // 学院微信
  wx_servicesZone_superWx: 'fd09121efc0a49278c352f8ebaf62576', // 四板优品微信
  // 服务专区-通用专区
  wx_servicesZone_commonBannerBg: '2d154ac685da442c9b8fc1775f836fc4' // 通用专区-banner背景
}

export default imgConstant
