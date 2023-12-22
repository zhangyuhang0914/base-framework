export const getApps = (props: AnyObject) => {
  return [
    {
      name: 'mic-pc-home',
      entry: process.env.NODE_ENV === 'production' ? window.location.origin + '/micPcHome/' : `//${window.location.hostname}:8081/`,
      container: '#frameSection',
      activeRule: '/mic-pc-home',
      props: Object.assign(props, { name: 'mic-pc-home' })
    },
    {
      name: 'mic-pc-dispatch',
      entry: process.env.NODE_ENV === 'production' ? window.location.origin + '/micPcDispatch/' : `//${window.location.hostname}:8082/`,
      container: '#frameSection',
      activeRule: '/mic-pc-dispatch',
      props: Object.assign(props, { name: 'mic-pc-dispatch' })
    }
  ]
}
