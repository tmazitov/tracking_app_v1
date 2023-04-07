<template>
  <ion-app>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet, useIonRouter } from '@ionic/vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { AccessTokenPairAPI } from './api/auth/auth';
export default {
  name: 'App',
  components: {
    IonApp, IonRouterOutlet
  },
  setup(){
    const route = useRoute()
    if (route.name != 'auth' && AccessTokenPairAPI.getAccess() == null){
      const router = useIonRouter()
      sessionStorage.setItem("origin_path", route.fullPath)
      router.replace({name:'auth'}) 
    }

    const store = useStore()
    store.dispatch('setup-user')
  }
}

</script>
