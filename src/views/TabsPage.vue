<template>
    <ion-page>
        <ion-tabs class="tabs">
            <ion-router-outlet></ion-router-outlet>
            <transition name="go-up">
                <ion-tab-bar slot="bottom" v-if="isShowTabs">
                    <ion-tab-button tab="home" href="/home">
                        <ion-icon aria-hidden="true" :icon="home" />
                        <ion-label>Главная</ion-label>
                    </ion-tab-button>
    
                    <ion-tab-button tab="create-order" href="/order/create">
                        <ion-icon aria-hidden="true" :icon="addCircleOutline" />
                        <ion-label>Новый заказ</ion-label>
                    </ion-tab-button>
    
                    <ion-tab-button tab="tab3" href="/tab3">
                        <ion-icon aria-hidden="true" :icon="square" />
                        <ion-label>Tab 3</ion-label>
                    </ion-tab-button>
                </ion-tab-bar>
            </transition>
        </ion-tabs>
    </ion-page>
</template>

<script lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet, useIonRouter } from '@ionic/vue';
import { square, home, addCircleOutline } from 'ionicons/icons';
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
    name: 'TabsPage',
    components: {
        IonTabBar,
        IonTabButton,
        IonTabs,
        IonLabel,
        IonIcon,
        IonPage,
        IonRouterOutlet,
    },
    setup() {
        const store = useStore()
        let isShowTabs = computed(() => store.getters.isShowTabs)

        return {
            isShowTabs,
            home,
            addCircleOutline,
            square
        }
    }
}

</script>

<style scoped>
.tabs{
    position: relative;
}
.go-up-enter-active{
    animation: go-up .35s;
}
.go-up-leave-active{
    animation: go-up .35s reverse;
}

@keyframes go-up {
    from {
        transform: translateY(100%)
    }
    to {
        transform: translateY(0%)
    }
}

</style>
