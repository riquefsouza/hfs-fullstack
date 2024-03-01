<template>
    <v-form ref="form">
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
              <v-select v-model="selectedTypeReport" :items="items" 
                  label="Escolha o tipo de relatório:" required 
                  @update:modelValue="$emit('changeTypeReport', { pTypeReport: selectedTypeReport })">
                  <template #item="data">
                      <v-list-subheader v-if="data.props.header">
                          {{ data.props.header }}
                      </v-list-subheader>
                      <v-list-item v-else v-bind="data.props">
                      </v-list-item>
                  </template>
              </v-select>
          </v-col>
          <v-col cols="12" md="4">
              <v-checkbox v-model="selectedForceDownload" label="Forçar download:" required
                  @change="$emit('changeForceDownload', { forceDownload: selectedForceDownload })">
              </v-checkbox>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </template>
  
  <script lang="ts">
  import { ref, onMounted } from 'vue';
  import { PDFReport, ReportService, SelectItemGroup } from '../services/ReportService';
  
  export default {
      setup() {
          const reportService = ref<ReportService>(new ReportService());
          const typeReport = ref<SelectItemGroup[]>();
          const selectedTypeReport = ref<SelectItemGroup>();
          const selectedForceDownload = ref<boolean>(true);
  
          const form = ref();
                
          const items = ref<any[]>([]);  
  
          onMounted(() => {
              typeReport.value = reportService.value.getTypeReport();
  
              typeReport.value.forEach((group: SelectItemGroup) =>{
                  items.value.push({ props: { header: group.label } });
  
                  group.items?.forEach((item: SelectItemGroup) => {
                      items.value.push({
                          title: item.label,
                          value: item
                      });
                  });
              });
  
              selectedTypeReport.value = PDFReport;
              selectedForceDownload.value = true;            
          });
          
          /*
          async function validate () {
              const { valid } = await form.value.validate()
  
              if (valid) alert('Form is valid')
          }
  
          function reset () {
              form.value.reset()
          }
  
          function resetValidation () {
              form.value.resetValidation()
          }        
          */
         
          return { reportService, typeReport, selectedTypeReport, selectedForceDownload, form, items }
      }
  }
  </script>