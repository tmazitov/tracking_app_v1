<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Главная</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Главная</ion-title>
        </ion-toolbar>
      </ion-header>
      <DateViewer />
      {{ user }}
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import DateViewer from '@/components/DateViewer.vue';
import { reactive, computed } from 'vue';
import { useStore } from 'vuex';

export default {
  name: 'HomePage',
  components: {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent, DateViewer
  },
  setup(){
    const store = useStore()
    const data = reactive({
      
    })
    const user = computed(() => store.getters.userMainInfo)

    return {
      user,
    }
  }
}
</script>
