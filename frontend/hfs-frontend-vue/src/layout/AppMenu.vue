<script setup>
import { ref, onBeforeMount } from 'vue';
import AppMenuItem from './AppMenuItem.vue';
import keycloakService from '@/main.ts';

const model = ref([]);

const sistemaItemMenu = ref( { 
    label: 'Sistema',
    items: [
        { label: 'Usuário logado', to: '/system/usuario' },
        { label: 'Configuração de Tela', to: '/system/config' },
    ]
});

onBeforeMount(() => {
    const menus = keycloakService.getMenus();

    if (menus && menus.length > 0) {
        menus.forEach(item => {
            model.value.push(item);
        });        
        model.value.push(sistemaItemMenu.value);
    }
});

</script>

<template>
    <ul class="layout-menu">
        <template v-for="(item, i) in model" :key="item">
            <app-menu-item v-if="!item.separator" :item="item" :index="i"></app-menu-item>
            <li v-if="item.separator" class="menu-separator"></li>
        </template>
    </ul>
</template>

<style lang="scss" scoped></style>
