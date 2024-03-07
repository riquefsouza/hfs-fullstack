<template>
    <v-toolbar>
        <span class="spacer"></span>
        <v-btn @click="expandAll" variant="elevated" :style="{ marginRight: '10px' }">Expandir todos</v-btn>
        <v-btn @click="collapseAll" variant="elevated" :style="{ marginRight: '10px' }">Recolher todos</v-btn>
    </v-toolbar>

    <ul ref="root" id="treeviewUL">
        <li v-for="(item, index) in nodeLista">
            <span :id="item.key" class="caret" @click="caretOnClick($event, item)">{{ item.label }}</span>
            <ul class="nested">
                <li v-for="(subitem, subindex) in item.children" style="margin-top: 10px; margin-left: 20px;">
                    <span :id="subitem.key" class="folha" @click="folhaOnClick($event, subitem)">{{ subitem.label }}</span>
                </li>
            </ul>
        </li>
    </ul>
</template>

<script lang="ts">
import { ref, onBeforeUpdate, PropType } from 'vue';
import { TreeNode } from '../../base/models/TreeNode';

export default {
    props: {
        menuRoot: { type: Array as PropType<TreeNode[]>, required: true },
        expandAll: { type: Boolean, required: false },
        collapseAll: { type: Boolean, required: false }
    },
    emits: ['onNodeSelected'],
    methods: {
        desmarcarTodas() {
            let folha = document.getElementsByClassName("folha");
            let j: number = 0;

            if (folha){
                for (j = 0; j < folha.length; j++) {
                    folha[j].classList.remove("tree-item-select");
                }
            }

            let caret = document.getElementsByClassName("caret");
            let k: number = 0;

            if (caret){
                for (k = 0; k < caret.length; k++) {
                    caret[k].classList.remove("tree-item-select");
                }
            }
        },        
        folhaOnClick(evento: any, selectedNode: TreeNode) {
            this.desmarcarTodas();

            evento.target.classList.toggle("tree-item-select");

            this.$emit('onNodeSelected', { node: selectedNode });
        },
        caretOnClick(evento: any, selectedNode: TreeNode) {
            let toggler = evento.target;
            let paiElemento = toggler.parentElement;
            paiElemento.querySelector(".nested").classList.toggle("active");
            toggler.classList.toggle("caret-down");

            this.desmarcarTodas();
            toggler.classList.toggle("tree-item-select");

            this.$emit('onNodeSelected', { node: selectedNode });
        }
    },    
    setup(props) {
        const root = ref<HTMLElement | null>(null);
        const nodeLista = ref<TreeNode[]>([]);

        onBeforeUpdate(() => {
            nodeLista.value = [...props.menuRoot];                  
        });

        const expandAll = () => {
            let caret = document.getElementsByClassName("caret");
            let k: number = 0;

            if (caret){
                for (k = 0; k < caret.length; k++) {
                    let paiElemento = caret[k].parentElement;
                    if (paiElemento){
                        let nested = paiElemento.querySelector(".nested");
                        if (nested){
                            if (!nested.classList.contains("active")){
                                nested.classList.add("active");  
                            }                                
                        }                        
                    }
                    if (!caret[k].classList.contains("caret-down")){
                        caret[k].classList.add("caret-down");
                    }                    
                }
            }
        }

        const collapseAll = () => {
            let caret = document.getElementsByClassName("caret");
            let k: number = 0;

            if (caret){
                for (k = 0; k < caret.length; k++) {
                    let paiElemento = caret[k].parentElement;
                    if (paiElemento){
                        let nested = paiElemento.querySelector(".nested");
                        if (nested){
                            if (nested.classList.contains("active")){
                                nested.classList.remove("active");  
                            }                                
                        }                        
                    }
                    if (caret[k].classList.contains("caret-down")){
                        caret[k].classList.remove("caret-down");
                    }                    
                }
            }
        }

        return { root, nodeLista, expandAll, collapseAll }
    }
}
</script>

<style scoped>
ul,
#treeviewUL {
    list-style-type: none;
}

#treeviewUL {
    margin: 0;
    padding: 0;
}

.caret {
    cursor: pointer;
    -webkit-user-select: none;   /* Safari 3.1+ */
    -moz-user-select: none;    /* Firefox 2+ */
    -ms-user-select: none;    /* IE 10+ */
    user-select: none;
}

.caret::before {
    content: "\25B6";
    color: black;
    display: inline-block;
    margin-right: 6px;
    margin-top: 10px;
}

.folha {
    cursor: pointer;
    margin-top: 10px;
}

.caret-down::before {
    -ms-transform: rotate(90deg); /* IE 9 */
    -webkit-transform: rotate(90deg); /* Safari */    
    transform: rotate(90deg);
}

.nested {
    display: none;
}

.active {
    display: block;
}

.tree-item-select {
    margin-top: 10px;
    background-color: lightblue;
    color: blue;    
    border: 1px solid blue;
    padding: 5px;
    border-radius: 15px;        
}

.margem-top-10 {
    margin-top: 10px;
}
</style>