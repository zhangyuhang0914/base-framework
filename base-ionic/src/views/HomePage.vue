<template lang="pug">
ion-page
  ion-header(:translucent="true")
    ion-toolbar
      ion-title {{ 'Blank' }}
  ion-content(:fullscreen="true")
    ion-header(collapse="condense")
      ion-toolbar
        ion-title(size="large") {{ 'Blank' }}
    #container
      .avatar-lazy(v-avatar:today="'https://gimg3.baidu.com/topone/src=https%3A%2F%2Fbkimg.cdn.bcebos.com%2Fpic%2F5fdf8db1cb134954b37001e85c4e9258d0094ad4%3Fx-bce-process%3Dimage%2Fresize%2Cm_pad%2Cw_348%2Ch_348%2Ccolor_ffffff&refer=http%3A%2F%2Fwww.baidu.com&app=2011&size=f200,200&n=0&g=0n&er=404&q=75&fmt=auto&maxorilen2heic=2000000?sec=1692118800&t=d9eba140d99346ddfd25fe5d00b16944'")
      strong {{ 'Ready to create an app?' }}
      p {{ 'Start with Ionic' }}
        a(target="_blank" rel="noopener noreferrer" href="https://ionicframework.com/docs/components") {{ 'UI Components' }}
</template>

<script lang="ts">
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar
} from '@ionic/vue'
import { defineComponent, ref, onMounted } from 'vue'
import { Device } from '@capacitor/device'
export default defineComponent({
  name: 'homePage',
  components: { IonContent, IonHeader, IonPage, IonTitle, IonToolbar },
  setup(props, context) {
    const today = ref('今天周日')
    const logDeviceInfo = async () => {
      const info = await Device.getInfo()
      console.log(info)
    }
    const logBatteryInfo = async () => {
      const info = await Device.getBatteryInfo()
      console.log(info)
    }
    onMounted(() => {
      function createArr<T>(len: number, value: T): T[] {
        let res = []
        for (let i = 0; i < len; i++) {
          res.push(value)
        }
        return res
      }
      let arr = createArr(1, 'zhangyuhang')
      console.log('arr', arr, arr[0].length, context)
      logDeviceInfo()
      logBatteryInfo()
    })
    return {
      today
    }
  }
})
</script>

<style scoped>
.avatar-lazy {
  width: 50px;
  height: 50px;
}
#container {
  text-align: center;

  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;

  color: #8c8c8c;

  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
