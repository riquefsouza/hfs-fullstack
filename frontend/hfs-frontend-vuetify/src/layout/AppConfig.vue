<script setup>
import { ref } from 'vue';
import { useLayout } from '@/layout/composables/layout';

defineProps({
    simple: {
        type: Boolean,
        default: false
    }
});
const scales = ref([12, 13, 14, 15, 16]);
const visible = ref(false);

const { changeThemeSettings, setScale, layoutConfig } = useLayout();

const onConfigButtonClick = () => {
    visible.value = !visible.value;
};
const onChangeTheme = (theme, mode) => {
    const elementId = 'theme-css';
    const linkElement = document.getElementById(elementId);
    const cloneLinkElement = linkElement.cloneNode(true);
    const newThemeUrl = linkElement.getAttribute('href').replace(layoutConfig.theme.value, theme);
    cloneLinkElement.setAttribute('id', elementId + '-clone');
    cloneLinkElement.setAttribute('href', newThemeUrl);
    cloneLinkElement.addEventListener('load', () => {
        linkElement.remove();
        cloneLinkElement.setAttribute('id', elementId);
        changeThemeSettings(theme, mode === 'dark');
    });
    linkElement.parentNode.insertBefore(cloneLinkElement, linkElement.nextSibling);
};
const decrementScale = () => {
    setScale(layoutConfig.scale.value - 1);
    applyScale();
};
const incrementScale = () => {
    setScale(layoutConfig.scale.value + 1);
    applyScale();
};
const applyScale = () => {
    document.documentElement.style.fontSize = layoutConfig.scale.value + 'px';
};

const changeMenuMode = (valor) => {
    layoutConfig.menuMode.value = valor;
};

const changeInputStyle = (valor) => {
    layoutConfig.inputStyle.value = valor;
};

</script>

<template>
    <div class="grid">
        <div class="col-12">
            <div class="card px-6 py-6">    
                <h5>Esquema de cor</h5>
                <div class="grid">
                    <div class="col-2">
                        <v-btn icon="light_mode" :style="{ marginRight: '10px' }" @click="onChangeTheme('lara-light-indigo', 'light')"></v-btn>
                        <v-btn icon="dark_mode" @click="onChangeTheme('lara-dark-indigo', 'dark')"></v-btn>                        
                    </div>
                </div>

                <h5>Escala</h5>
                <div class="grid">
                    <div class="col-2">
                        <v-btn icon="remove" @click="decrementScale()" :disabled="layoutConfig.scale.value === scales[0]" :style="{ marginRight: '10px' }"></v-btn>
                        <v-btn icon="add" @click="incrementScale()" :disabled="layoutConfig.scale.value === scales[scales.length - 1]"></v-btn>
                    </div>    
                </div>

                <h5>Tipo de menu</h5>
                <div class="flex">
                    <v-radio-group>
                        <v-radio label="Static" value="static" @click="changeMenuMode('static')"></v-radio>
                        <v-radio label="Overlay" value="overlay" @click="changeMenuMode('overlay')" ></v-radio>                        
                    </v-radio-group>
                </div>

                <h5>Estilo de entrada</h5>
                <div class="flex">
                    <v-radio-group>
                        <v-radio label="Outlined" value="outlined" @click="changeInputStyle('outlined')"></v-radio>
                        <v-radio label="Filled" value="filled" @click="changeInputStyle('filled')"></v-radio>
                    </v-radio-group>
                </div>

                <h5>Efeito cascata</h5>
                <v-btn-toggle rounded="xl">
                    <v-btn icon="toggle_off" @click="layoutConfig.ripple.value = true"></v-btn>
                    <v-btn icon="toggle_on" @click="layoutConfig.ripple.value = false"></v-btn>
                </v-btn-toggle>                    
        </div>
    </div>
</div>
</template>

<style lang="scss" scoped></style>
