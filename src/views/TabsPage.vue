<template>
    <ion-page>
        <ion-tabs class="tabs">

            <ion-header>
                <ion-toolbar>
                    <div class="toolbar-wrapper">
                        <ion-title>{{pageTitle}}</ion-title>
                    </div>
                </ion-toolbar>
            </ion-header>

            <ion-router-outlet class="content"></ion-router-outlet>
            
            <div class="tab-bar-wrapper"> 
                <ion-tab-bar class="tab-wrapper-desktop">
                    <ion-tab-button class="tab" 
                        v-for="t,index in tabs" 
                        :tab="t.name" :href="t.href" 
                        @mouseover="() => openToast(index)" 
                        @mouseout="() => closeToast(index)">
                        <ion-icon aria-hidden="true" :icon="t.icon" />
                    </ion-tab-button>
                </ion-tab-bar>
            </div>

            <transition name="go-up">
                <div v-if="isShowTabs">
                    <ion-tab-bar class="tab-wrapper-smartphone" slot="bottom">
                        <ion-tab-button v-for="t in tabs" :tab="t.name" :href="t.href">
                            <ion-icon aria-hidden="true" :icon="t.icon" />
                            <ion-label >{{ t.label }}</ion-label>
                        </ion-tab-button>
                    </ion-tab-bar>
                </div>
            </transition>
        </ion-tabs>
    </ion-page>
</template>

<script lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet, IonToast, IonHeader, IonTitle, IonToolbar } from '@ionic/vue';
import { personCircleOutline, home, barChartOutline, } from 'ionicons/icons';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';

export default {
    name: 'TabsPage',
    components: {
        IonHeader,
        IonToolbar,
        IonTitle,
        IonToast,
        IonTabBar,
        IonTabButton,
        IonTabs,
        IonLabel,
        IonIcon,
        IonPage,
        IonRouterOutlet,
    },
    setup() {
        const route = useRoute()
        const store = useStore()
        let isShowTabs = computed(() => store.getters.isShowTabs)

        let tabs = [
            {name: "home", href: "/home", icon: home, label: "Главная", toastIsOpen: false},
            {name: "load", href: "/load", icon: barChartOutline, label: "Нагрузка", toastIsOpen: false},
            {name: "profile", href: "/profile", icon: personCircleOutline, label: "Профиль", toastIsOpen: false},
        ]


        const openToast = (index: number) => tabs[index].toastIsOpen = true
        const closeToast = (index: number) => tabs[index].toastIsOpen = false
        const pageTitle = computed(() => {
            let title:string = ""
            if (route.name == 'home'){
                title = 'Главная'
            } else if (route.name == 'load') {
                title = 'Нагрузка'
            } else if (route.name == 'profile') {
                title = 'Профиль'
            }
            return title
        })

        return {
            tabs,
            pageTitle,
            openToast,
            closeToast,
            isShowTabs,
        }
    }
}

</script>

<style scoped>
@import url(../theme/variables.css);
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

.tab-bar-wrapper{
    position: fixed;
    left: 0;
    top: 0;

    height: 100vh;
    width: 68px;
    background: var(--ion-tab-bar-background);
}

.tab-wrapper-desktop{
    position: absolute;
    left: 0;
    top: 68px;

    height: 200px;
    width: 68px;

    display: flex;
    flex-direction: column;
    justify-content: start;
    gap: 16px;
    position: absolute;
    top:0;

    margin-top: 68px;
}

.tab-wrapper-smartphone{
    display: flex;
    flex-direction: row;
    gap: 16px;
}

.tab{
    position: relative;
    height: 56px;
    width: 56px;
    border-radius: 4px;
    background: var(--ion-color-step-150);
}

.tab__toast{
    position: absolute;
    right: 0;
    top: 0;
}

ion-toolbar{
    display: flex;
    justify-content: center;
    align-items: center;
}

.toolbar-wrapper{
    min-width: 350px;
	max-width: 660px;
    margin: 0 auto;
}

.content{  
	min-width: 350px;
	max-width: 660px;

    margin: 0 auto;
    overflow-y: auto;
	height: 100%;
	width: 100%;
}

.content > .ion-page > * > * {
    margin: 0 20px;
}

.content > * {
    overflow-y: hidden;
}

@media (max-width: 768px){
    .toolbar-wrapper{
        width: 100vw;
    }
	.content {
		width: 100vw;
	}
    .tab-bar-wrapper{
        display: none;
    }

    .tab-wrapper-smartphone{
        display: flex;
    }
}
@media (min-width: 768px){
    .toolbar-wrapper{
        width: 60vw;
    }
	.content {
		width: 60vw;
	}

    .tab-bar-wrapper{
        display: flex;
    }

    .tab-wrapper-smartphone{
        display: none;
    }
}
</style>
