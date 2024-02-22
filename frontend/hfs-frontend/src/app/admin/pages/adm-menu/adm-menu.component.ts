import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { TreeNode } from 'primeng/api';
import { ReportParamForm } from 'src/app/base/models/ReportParamsForm';
import { ItypeReport } from 'src/app/base/services/ReportService';
import { AdmMenu } from '../../api/AdmMenu';
import { AdmPage } from '../../api/AdmPage';
import { AdmMenuService } from '../../service/AdmMenuService';
import { AdmPageService } from '../../service/AdmPageService';

@Component({
  templateUrl: './adm-menu.component.html',
  providers: [MessageService, AdmMenuService, AdmPageService]
})
export class AdmMenuComponent implements OnInit {

  admMenuDialog: boolean;

  listaAdmMenu: AdmMenu[] = [];

  admMenu: AdmMenu;

  selectedAdmMenu: AdmMenu;

  submitted: boolean;

  cols: any[];

  exportColumns: any[];

  listaNodeMenu: TreeNode[] = [];

  selectedNodeMenu: TreeNode;

  menuRoot: TreeNode;

  listaAdmPage: AdmPage[] = [];

  listaAdmMenuParent: AdmMenu[] = [];

  reportParamForm: ReportParamForm;

  deleteAdmMenuDialog: boolean = false;

  constructor(private messageService: MessageService,
    private admMenuService: AdmMenuService,
    private admPageService: AdmPageService) {
    this.reportParamForm = {
      reportType: 'PDF',
      forceDownload: true
    };
  }

  ngOnInit(): void {
    this.atualizarArvore();

    this.cols = [
      { field: 'id', header: 'Id' },
      { field: 'description', header: 'Description' }
    ];

    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
  }

  atualizarArvore(): void {
    this.listaNodeMenu = [];
    this.listaAdmMenu = [];
    this.listaAdmMenuParent = [];
    
    this.admPageService
      .findAll()
      .then(data => this.listaAdmPage = data);      

    this.admMenuService
      .findAll()
      .then(data => {
        this.listaAdmMenu = data;

        this.listaAdmMenuParent = this.listaAdmMenu.filter(menu => menu.idMenuParent == null);

        this.updateMenusTree(this.listaAdmMenu);
      });
  }

  updateMenusTree(listaAdmMenu: AdmMenu[]): void {
    this.listaNodeMenu = [];
    this.menuRoot = {
      'label': 'Menu do sistema',
      'data': '0',
      'children': []
    };

    listaAdmMenu.forEach((itemMenu: AdmMenu) => {
      const m: TreeNode = {};
      m.data = itemMenu;
      m.label = itemMenu.description;      

      if (itemMenu.idPage === null) {
        m.children = this.mountSubMenu(itemMenu);
        this.menuRoot.children.push(m);
      }
    });

    this.listaNodeMenu.push(this.menuRoot);

    this.expandAll();
  }

  isSubMenu(menu: AdmMenu): boolean {
    return menu.idPage === null;
  }

  getAdmSubMenus(menuPai: AdmMenu): AdmMenu[] {
    return this.listaAdmMenu.filter(menu => menu.idMenuParent === menuPai.id);
  }

  mountSubMenu(menu: AdmMenu): TreeNode[] {
    const lstSubMenu: TreeNode[] = [];

    this.getAdmSubMenus(menu).forEach((subMenu: AdmMenu) => {

      if (this.isSubMenu(subMenu)) {
        const m: TreeNode = {};
        m.data = subMenu;
        m.label = subMenu.description;
        m.children = this.mountSubMenu(subMenu);
      } else {
        const m: TreeNode = {};
        m.data = subMenu;
        m.label = subMenu.description;
        lstSubMenu.push(m);
      }
    });

    return lstSubMenu;
  }

  nodeSelect(event: any) {
    this.selectedAdmMenu = event.node.data;
    this.selectedNodeMenu = event.node;
  }

  onChangedTypeReport(typeReport: ItypeReport) {
    this.reportParamForm.reportType = typeReport.type;
  }

  onChangedForceDownload(forceDownload: boolean) {
    this.reportParamForm.forceDownload = forceDownload;
  }

  onExport() {
    this.admMenuService.report(this.reportParamForm).then(() => {
      this.messageService.add({ severity: 'info', summary: 'Menu Exportado', detail: 'Menu Exportado', life: 1000 });
    });
  }

  onInsert() {
    this.admMenu = {};
    this.submitted = false;
    this.admMenuDialog = true;
  }

  onEdit(admMenu: AdmMenu) {
    this.admMenu = { ...admMenu };
    this.admMenuDialog = true;
  }

  onDelete(admMenu: AdmMenu) {
    this.deleteAdmMenuDialog = true;
    this.admMenu = { ...admMenu };
  }

  confirmDelete(admMenu: AdmMenu) {
    this.deleteAdmMenuDialog = false;
    this.admMenuService.delete(admMenu.id).then(obj => {
      this.listaAdmMenu = this.listaAdmMenu.filter(val => val.id !== admMenu.id);
      this.admMenu = {};
      this.updateMenusTree(this.listaAdmMenu);
      this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Menu Excluído', life: 3000 });
    });
  }

  hideDialog() {
    this.admMenuDialog = false;
    this.submitted = false;
  }

  onSave() {
    this.submitted = true;
    if (this.admMenu.admPage!=null){
      this.admMenu.idPage = this.admMenu.admPage.id;
    }
    if (this.admMenu.admMenuParent!=null){
      this.admMenu.idMenuParent = this.admMenu.admMenuParent.id;
    }

    if (this.admMenu.description.trim()) {
      if (this.admMenu.id) {
        this.admMenuService.update(this.admMenu).then((obj: AdmMenu) => {
          this.admMenu = obj;

          this.selectedNodeMenu.label = this.admMenu.description;
          this.selectedNodeMenu.data = this.admMenu;

          this.listaAdmMenu[this.admMenuService
            .findIndexById(this.listaAdmMenu, this.admMenu.id)] = this.admMenu;

            this.admMenuDialog = false;
            this.admMenu = {};
            this.updateMenusTree(this.listaAdmMenu);
  
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Menu Atualizado', life: 3000 });
        });
      } else {
        this.admMenuService.insert(this.admMenu).then((obj: AdmMenu) => {
          this.admMenu = obj;

          this.listaAdmMenu.push(this.admMenu);

          this.listaAdmMenuParent = this.listaAdmMenu.filter(menu => menu.idMenuParent == null);

          this.admMenuDialog = false;
          this.admMenu = {};
          this.updateMenusTree(this.listaAdmMenu);
    
          this.messageService.add({ severity: 'success', summary: 'Sucesso', detail: 'Menu Criado', life: 3000 });
        });
      }

    }

  }

  expandAll() {
    this.listaNodeMenu.forEach((node) => {
        this.expandRecursive(node, true);
    });
  }

  collapseAll() {
    this.listaNodeMenu.forEach((node) => {
        this.expandRecursive(node, false);
    });
  } 

  private expandRecursive(node: TreeNode, isExpand: boolean) {
    node.expanded = isExpand;
    if (node.children) {
        node.children.forEach((childNode) => {
            this.expandRecursive(childNode, isExpand);
        });
    }
  }

}
