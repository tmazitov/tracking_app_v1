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
    const store = useStore()
    store.dispatch('setup-user')

    const route = useRoute()
    
    if (route.name != 'auth' && AccessTokenPairAPI.getAccess() == null){
      const router = useIonRouter()
      sessionStorage.setItem("origin_path", route.fullPath)
      router.replace({name:'auth'}) 
    }
  }
}

</script>ы

<style>
ion-backdrop {
	opacity: 0.7;
	background: #242424;
	z-index: 11;
	display: flex;
	justify-content: center;
	align-items: center;
}
.alert-wrapper.sc-ion-alert-md{
  z-index: 12;
}

body{
  overflow-y: auto;
}
</style>
