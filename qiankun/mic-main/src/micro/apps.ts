export const getApps = (props: AnyObject) => {
  return [
    {
      name: 'microDispatch',
      entry: import.meta.env.MODE === 'production' ? window.location.origin + '/icpMicDispatch/' : `//${window.location.hostname}:7911/`,
      container: '#frameSection',
      activeRule: '/mic-dispatch',
      props: props
    },
    {
      name: 'microScreen',
      entry: import.meta.env.MODE === 'production' ? window.location.origin + '/icpMicScreen/' : `//${window.location.hostname}:7912/`,
      container: '#frameSection',
      activeRule: '/mic-screen',
      props: props
    }
  ]
}
