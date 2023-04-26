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
    setup() {
        const store = useStore()
        store.dispatch('setup-user')

        const route = useRoute()

        if (route.name != 'auth' && AccessTokenPairAPI.getAccess() == null) {
            const router = useIonRouter()
            sessionStorage.setItem("origin_path", route.fullPath)
            router.replace({ name: 'auth' })
        }
    }
}

</script>ы

<style>
@import url(./theme/variables.css);

ion-backdrop {
    opacity: 0.7;
    background: #242424;
    z-index: 11;
    display: flex;
    justify-content: center;
    align-items: center;
}

  /* Firefox */
* {
    scrollbar-width: auto;
    scrollbar-color: #8f54a0 ;
}

  /* Chrome, Edge, and Safari */
*::-webkit-scrollbar {
    width: 10px;
}

*::-webkit-scrollbar-track {
    background: var(--ion-color-step-200);
    border-radius: 4px;
}

*::-webkit-scrollbar-thumb {
    background: var(--ion-color-step-100);
    border: 4px solid var(--ion-color-step-100);
    border-radius: 4px;
}

.alert-wrapper.sc-ion-alert-md {
    z-index: 12;
}

body {
    overflow-y: auto;
}
ion-chip.gold{
    --background: rgb(255, 215, 0, 0.1);
    --color: rgb(255, 215, 0, 0.8);
}

</style>
