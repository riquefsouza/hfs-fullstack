import { Component, OnInit } from '@angular/core';
import { ReportParamForm } from 'src/app/base/models/ReportParamsForm';
import { ItypeReport } from 'src/app/base/services/ReportService';
import { AdmParameterCategoryService } from '../../service/AdmParameterCategoryService';
import { AdmParameterCategory } from '../../api/AdmParameterCategory';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  templateUrl: './adm-parameter-category.component.html',
  styleUrls: ["./adm-parameter-category.component.css"],
  providers: [AdmParameterCategoryService]
})
export class AdmParameterCategoryComponent implements OnInit {

  admParameterCategoryDialog: boolean;

  listaAdmParameterCategory: AdmParameterCategory[];

  admParameterCategory: AdmParameterCategory;

  selectedAdmParameterCategories: AdmParameterCategory[];

  submitted: boolean;

  cols: any[] = [];

  reportParamForm: ReportParamForm;

  deleteAdmParameterCategoryDialog: boolean = false;

  deleteAdmParameterCategoriesDialog: boolean = false;

  constructor(private admParameterCategoryService: AdmParameterCategoryService,
    private snackBar: MatSnackBar) {
      this.reportParamForm = {
        reportType: 'PDF',
        forceDownload: true
      };
    }

  ngOnInit(): void {
    this.admParameterCategoryService.findAll()
      .then(data => this.listaAdmParameterCategory = data);

    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'description', header: 'Descrição' },
      { field: 'order', header: 'Ordem' }
    ];

  }

  onChangedTypeReport(typeReport: ItypeReport) {
    this.reportParamForm.reportType = typeReport.type;
  }

  onChangedForceDownload(forceDownload: boolean) {
    this.reportParamForm.forceDownload = forceDownload;
  }

  onExport() {
    this.admParameterCategoryService.report(this.reportParamForm).then(() => {
      this.snackBar.open('Categoria de parâmetro exportada', 'info', { duration: 3000 });
    });
  }

  onInsert() {
    this.admParameterCategory = {};
    this.submitted = false;
    this.admParameterCategoryDialog = true;
  }

  onEdit(admParameterCategory: AdmParameterCategory) {
    this.admParameterCategory = { ...admParameterCategory };
    this.admParameterCategoryDialog = true;
  }

  hideDialog() {
    this.admParameterCategoryDialog = false;
    this.submitted = false;
  }

  onSave() {
    this.submitted = true;

    if (this.admParameterCategory.description.trim()) {
        if (this.admParameterCategory.id) {
          this.admParameterCategoryService.update(this.admParameterCategory).then((obj: AdmParameterCategory) => {
            this.admParameterCategory = obj;
            this.listaAdmParameterCategory[this.admParameterCategoryService
              .findIndexById(this.listaAdmParameterCategory, this.admParameterCategory.id)] = this.admParameterCategory;
            this.snackBar.open('Categoria de parâmetro Atualizada', 'Sucesso', { duration: 3000 });
          });
        } else {
          this.admParameterCategoryService.insert(this.admParameterCategory).then((obj: AdmParameterCategory) => {
            this.admParameterCategory = obj;
            this.listaAdmParameterCategory.push(this.admParameterCategory);
            this.snackBar.open('Categoria de parâmetro Criada', 'Sucesso', { duration: 3000 });
          });
        }

        this.listaAdmParameterCategory = [...this.listaAdmParameterCategory];
        this.admParameterCategoryDialog = false;
        this.admParameterCategory = {};
    }
  }

  deleteSelected() {
      this.deleteAdmParameterCategoriesDialog = true;
  }

  onDelete(admParameterCategory: AdmParameterCategory) {
      this.deleteAdmParameterCategoryDialog = true;
      this.admParameterCategory = { ...admParameterCategory };
  } 

  confirmDeleteSelected() {
      this.deleteAdmParameterCategoriesDialog = false;
      this.listaAdmParameterCategory = this.listaAdmParameterCategory.filter(val => !this.selectedAdmParameterCategories.includes(val));

      let excluiu = false;
      this.selectedAdmParameterCategories.forEach((item) => {
        this.admParameterCategoryService.delete(item.id).then(obj => {
          excluiu = true;
        });
      });
  
      if (excluiu) {
        this.snackBar.open('Categorias de parâmetro excluídos', 'Sucesso', { duration: 3000 });
        this.selectedAdmParameterCategories = [];
      }
  }

  confirmDelete() {
    this.deleteAdmParameterCategoryDialog = false;
    this.admParameterCategoryService.delete(this.admParameterCategory.id).then(obj => {
      this.listaAdmParameterCategory = this.listaAdmParameterCategory.filter(val => val.id !== this.admParameterCategory.id);
      this.admParameterCategory = {};        
      this.snackBar.open('Categoria de parâmetro excluído', 'Sucesso', { duration: 3000 });
    });
  }

}
