<template>
  <ion-page v-if="isAuthorized">
    <ion-tabs>
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom" >
        <ion-tab-button tab="home" href="/home">
          <ion-icon aria-hidden="true" :icon="home" />
          <ion-label>Главная</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tab2">
          <ion-icon aria-hidden="true" :icon="ellipse" />
          <ion-label>Tab 2</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tab3">
          <ion-icon aria-hidden="true" :icon="square" />
          <ion-label>Tab 3</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script lang="ts">
import { AccessTokenPairAPI } from '@/api/auth/auth';
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet, useIonRouter } from '@ionic/vue';
import { ellipse, square, home } from 'ionicons/icons';
import { useRoute } from 'vue-router';

export default {
  name:'TabsPage',
  components: {
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonLabel,
    IonIcon,
    IonPage,
    IonRouterOutlet,
  },
  setup(){
    let isAuthorized:boolean = true
    const route = useRoute()
    if (route.name != 'auth' && AccessTokenPairAPI.getAccess() == null){
      const router = useIonRouter()
      sessionStorage.setItem("origin_path", route.fullPath)
      router.replace({name:'auth'}) 
      isAuthorized = false     
    }

    return {
      isAuthorized,
      home,
      ellipse,
      square
    }
  }
}
</script>
