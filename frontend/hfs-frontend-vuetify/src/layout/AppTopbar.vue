<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '../layout/composables/layout';
import { useRouter } from 'vue-router';
import keycloakService from '@/main.ts';

const { layoutConfig, onMenuToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const router = useRouter();

onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return `layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};

const logout = async () => {
    await keycloakService.logout();
};

const onConfigClick = () => {
    //topbarMenuActive.value = false;
    router.push('/system/config');
};
const onUsuarioClick = () => {
    //topbarMenuActive.value = false;
    router.push('/system/usuario');
};

const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};
const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
};
const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};
</script>

<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo">
            <span>HFS FULLSTACK</span>
        </router-link>

        <v-btn icon="menu" class="layout-menu-button" @click="onMenuToggle()"></v-btn>

        <v-btn icon="more_vert" class="layout-topbar-menu-button" @click="onTopBarMenuButton()"></v-btn>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <button :style="{ marginRight: '10px' }" @click="onUsuarioClick()" class="p-link layout-topbar-button">
                <v-icon icon="person"></v-icon>
                <span>Perfil</span>
            </button>

            <button :style="{ marginRight: '10px' }" @click="onConfigClick()" class="p-link layout-topbar-button">
                <v-icon icon="settings"></v-icon>
                <span>Configurações</span>
            </button>

            <button :style="{ marginRight: '10px' }" @click="logout()" class="p-link layout-topbar-button">
                <v-icon icon="logout"></v-icon>
                <span>Sair</span>
            </button>
        </div>
    </div>
</template>

<style lang="scss" scoped></style>
