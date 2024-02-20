<template>
    <div class="p-fluid formgrid grid">
        <div class="field col-4 md-4">
            <label for="cmbTypeReport">Escolha o tipo de relatório:</label>
            <Dropdown id="cmbTypeReport" v-model="selectedTypeReport" :options="typeReport"
                optionLabel="label" optionGroupLabel="label" optionGroupChildren="items" 
                @change="$emit('changeTypeReport', { pTypeReport: selectedTypeReport })">
            </Dropdown>
        </div>
        <!--
        <div class="field col-4 md-4">
            <label for="forceDownload" style="margin: 4px;">Forçar download:</label>
            <Checkbox id="forceDownload" v-model="selectedForceDownload" :binary="true" 
                @change="$emit('changeForceDownload', { forceDownload: selectedForceDownload })">
            </Checkbox>
        </div>
        -->
    </div>
</template>

<script lang="ts">
import { ref, onMounted } from 'vue';
//import { PDFReport, ReportService, SelectItemGroup } from '@/base/services/ReportService';
import { PDFReport, ReportService, SelectItemGroup } from '../services/ReportService';

export default {
    setup() {
        const reportService = ref<ReportService>(new ReportService());
        const typeReport = ref<SelectItemGroup[]>();
        const selectedTypeReport = ref<SelectItemGroup>();
        const selectedForceDownload = ref<boolean>(true);

        onMounted(() => {
            typeReport.value = reportService.value.getTypeReport();
            selectedTypeReport.value = PDFReport;
            selectedForceDownload.value = true;            
        })

        return { reportService, typeReport, selectedTypeReport, selectedForceDownload }
    }
}
</script>