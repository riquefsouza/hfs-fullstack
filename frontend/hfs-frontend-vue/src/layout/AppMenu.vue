<script setup>
import { ref } from 'vue';

import AppMenuItem from './AppMenuItem.vue';

const model = ref([
    {
        label: 'Cadastros',
        items: [
            { label: 'Funcionários', to: '/hfs/funcionario' }
        ]
    },
    {
        label: 'Administrativo',
        items: [
            { label: 'Categoria dos Parâmetros', to: '/admin/admParameterCategory' },
            { label: 'Parâmetros', to: '/admin/admParameter' },
            { label: 'Perfis', to: '/admin/admProfile' },
            { label: 'Páginas', to: '/admin/admPage' },
            { label: 'Menus', to: '/admin/admMenu' }
        ]
    },
    {
        label: 'Sistema',
            items: [
                { label: 'Usuário logado', to: '/system/usuario' },
                { label: 'Configuração de Tela', to: '/system/config' },
            ]
    }
]);
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
