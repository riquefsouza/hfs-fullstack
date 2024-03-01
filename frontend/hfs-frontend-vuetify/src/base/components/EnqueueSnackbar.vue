<script lang="ts">
import { ref } from 'vue';

const snackbar = ref<boolean>(false);
const message = ref<string>('');
const timeout = ref<number>(3000);

export default function snackBar(msg: string, duration: number) {
    message.value = msg;
    timeout.value = duration;
    snackbar.value = true;
}    
</script>

<template>
    <div class="text-center">
        <v-snackbar v-model="snackbar" :timeout="timeout" density="compact" icon="mdi-plus">
            {{ message }}

            <template v-slot:actions>
                <v-btn color="red" density="compact" icon="close" @click="snackbar = false"></v-btn>
            </template>
        </v-snackbar>
    </div>
</template>
