/**
 * 金融产品数据
 */
export interface SupplyChainFinanceData extends Array<SupplyChainFinanceItem> {}
export interface SupplyChainFinanceItem {
  id: string
  name: string
  tips: string
  productList: ProductItem[]
  newPoductList?: Array<ProductItem[]>
}
export interface ProductItem {
  id: string
  logoFileId: string
  name: string
  institutionsUniscId: string
  institutionsName: string
  amount: string
  startAmount?: string
  endAmount?: string
  startRange: string
  endRange: string
  productDetailId: string
  productDesc: string
  customerDesc: string
  entryCriteria: string
  logoUrl?: string
  rateRange?: string
  loanLimit?: string
}

/**
 * 机构列表数据
 */
export interface FinanceInstitutionDataType {
  id: string
  name: string
  imgBgConstant: string
  content?: string
  companyContent?: string
  productService?: institutionProductServiceItem[]
  functionAntages?: AnyObject
  cooperationList?: AnyObject
  addressInfo: {
    address: string
    phone: string
    time: string
    mail: string
  }
  url?: string
}

export interface institutionProductServiceItem {
  imgBgConstant: string
  name: string
  content: string
}

/**
 * 核心企业数据
 */
export interface CoreEnterpriseDataType {
  gj: CoreEnterpriseItem
  ht: CoreEnterpriseItem
}

export interface CoreEnterpriseItem {
  name: string
  content1?: string
  content2?: string
  content3?: string
  content4?: string
  content5?: string
  content6?: string
  logoImg1?: string
  logoImg2?: string
  addressIcon?: string
  phoneIcon?: string
  emailIcon?: string
  addressList: CoreEnterpriseAddressItem[]
  url: string
}

interface CoreEnterpriseAddressItem {
  name: string
  address: string
  phone: string
  mail: string
}
