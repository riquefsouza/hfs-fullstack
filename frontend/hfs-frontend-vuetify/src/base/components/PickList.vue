<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card style="width: 100%; height: 100%;">
                    <v-card-title style="font-weight: bold; font-size: medium;">Disponível</v-card-title>                    
                    <v-card-text style="border-style: solid; border-width: 1px; border-radius: 10px;width: 100%; height: 300px;">
                        <v-list select-strategy="classic" style="overflow: auto;  height: 290px">
                            <v-list-item v-for="(item, index) in sourceLista" :value="item" @click="sourceHandleToggle(index)">
                                <template v-slot:prepend="{ isActive }">
                                    <v-list-item-action start>
                                        <v-checkbox-btn :model-value="sourceIsActive(index, isActive)"></v-checkbox-btn>
                                    </v-list-item-action>
                                </template>

                                <v-list-item-title>{{ item.description }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>                
            </v-col>
            <v-col cols="1">
                <v-btn icon="keyboard_arrow_right" color="primary" @click="addTarget()"
                    style="display: block; top: 30%; left: 50%; transform: translate(-50%, -50%); margin-bottom: 10px;"></v-btn>
                <v-btn icon="keyboard_double_arrow_right" color="primary" @click="addAllTarget()"
                    style="display: block; top: 30%; left: 50%; transform: translate(-50%, -50%); margin-bottom: 10px;"></v-btn>
                <v-btn icon="keyboard_arrow_left" color="primary" @click="addSource()"
                    style="display: block; top: 30%; left: 50%; transform: translate(-50%, -50%); margin-bottom: 10px;"></v-btn>
                <v-btn icon="keyboard_double_arrow_left" color="primary" @click="addAllSource()"
                    style="display: block; top: 30%; left: 50%; transform: translate(-50%, -50%); margin-bottom: 10px;"></v-btn>
            </v-col>
            <v-col>
                <v-card style="width: 100%; height: 100%;">
                    <v-card-title style="font-weight: bold; font-size: medium;">Selecionada</v-card-title>                    
                    <v-card-text style="border-style: solid; border-width: 1px; border-radius: 10px;width: 100%; height: 300px;">
                        <v-list select-strategy="classic" style="overflow: auto;  height: 290px">
                            <v-list-item v-for="(item, index) in targetLista" :value="item" @click="targetHandleToggle(index)">
                                <template v-slot:prepend="{ isActive }">
                                    <v-list-item-action start>
                                        <v-checkbox-btn :model-value="targetIsActive(index, isActive)"></v-checkbox-btn>
                                    </v-list-item-action>
                                </template>

                                <v-list-item-title>{{ item.description }}</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>                
            </v-col>
        </v-row>
    </v-container>
</template>

<style>
.verticalButtons {
    display: block; top: 35%; left: 50%; transform: translate(-50%, -50%)
}
</style>

<script lang="ts">
import { ref, onBeforeUpdate, PropType } from 'vue';
import { Entidade } from '../models/Entidade';

/*
interface PickListProps<T extends Entidade> {
  source: T[];
  target: T[];
}
*/
export default {
    props: {
        source: { type: Array as PropType<Entidade[]>, required: true },
        target: { type: Array as PropType<Entidade[]>, required: true }
    },
    //setup <T extends Entidade>(props: PickListProps<T>) {
    setup (props) {
        const form = ref();
        const sourceLista = ref<Entidade[]>([]);
        const targetLista = ref<Entidade[]>([]);
        const sourceChecked = ref<number[]>([]);
        const targetChecked = ref<number[]>([]);
        const sourceSelected = ref<Entidade[]>([]);
        const targetSelected = ref<Entidade[]>([]);

        onBeforeUpdate(() => {
            sourceLista.value = [...props.source];
            targetLista.value = [...props.target];
        });

        const findIndexById = (lista: Entidade[], id: number): number => {
            let index = -1;
            for (let i = 0; i < lista.length; i++) {

            if (lista[i].id === id) {
                index = i;
                break;
            }
            }
            return index;
        }

        const sourceHandleToggle = (index: number) => {
            const currentIndex = sourceChecked.value.indexOf(index);
            const newChecked = [...sourceChecked.value];
            const newSourceSelected = [...sourceSelected.value];

            if (currentIndex === -1) {
                newChecked.push(index);
                newSourceSelected.push(sourceLista.value[index]);
            } else {
                newChecked.splice(currentIndex, 1);
                newSourceSelected.splice(currentIndex, 1);
            }

            sourceChecked.value = newChecked;
            sourceSelected.value = newSourceSelected;
        };  

        const targetHandleToggle = (index: number) => {
            const currentIndex = targetChecked.value.indexOf(index);
            const newChecked = [...targetChecked.value];
            const newSourceSelected = [...targetSelected.value];

            if (currentIndex === -1) {
                newChecked.push(index);
                newSourceSelected.push(targetLista.value[index]);
            } else {
                newChecked.splice(currentIndex, 1);
                newSourceSelected.splice(currentIndex, 1);
            }

            targetChecked.value = newChecked;
            targetSelected.value = newSourceSelected;
        };  

        const addTarget = () => {
            if (sourceSelected.value.length > 0) {
                sourceSelected.value.forEach(item => {
                    targetLista.value.push(item);

                    if (item.id){
                        let index = findIndexById(sourceLista.value, item.id);
                        sourceLista.value.splice(index, 1);  
                    }
                });

                sourceChecked.value = [];
                sourceSelected.value = [];    
            }  
        }

        const addAllTarget = () => {
            sourceLista.value.forEach((item: Entidade) => {
                targetLista.value.push(item);
            });
            sourceLista.value.splice(0, sourceLista.value.length);
            sourceChecked.value = [];
            sourceSelected.value = [];
        }

        const addSource = () => {
            if (targetSelected.value.length > 0) {
                targetSelected.value.forEach(item => {
                    sourceLista.value.push(item);

                    if (item.id){
                        let index = findIndexById(targetLista.value, item.id);
                        targetLista.value.splice(index, 1);
                    }
                });
                targetChecked.value = [];
                targetSelected.value = [];
            }
        }

        const addAllSource = () => {
            targetLista.value.forEach((item: Entidade) => {
                sourceLista.value.push(item);
            });
            targetLista.value.splice(0, targetLista.value.length);
            targetChecked.value = [];
            targetSelected.value = [];
        }

        const sourceIsActive = (index: number, _isActive: boolean): boolean => {            
            return sourceChecked.value.indexOf(index) !== -1;
        }

        const targetIsActive = (index: number, _isActive: boolean): boolean => {
            return targetChecked.value.indexOf(index) !== -1;
        }

        return { form, sourceLista, sourceChecked, sourceHandleToggle, targetLista, targetChecked, targetHandleToggle, 
            addTarget, addAllTarget, addSource, addAllSource, sourceIsActive, targetIsActive }
    }
}
</script>