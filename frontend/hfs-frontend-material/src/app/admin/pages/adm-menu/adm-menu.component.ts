import { Component, OnInit } from '@angular/core';
import { ReportParamForm } from 'src/app/base/models/ReportParamsForm';
import { ItypeReport } from 'src/app/base/services/ReportService';
import { AdmMenuService } from '../../service/AdmMenuService';
import { AdmMenu, emptyAdmMenu } from '../../api/AdmMenu';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { AdmMenuDialogDelete } from './dialogs/adm-menu.dialog-delete';
import { AdmMenuDialogDetails } from './dialogs/adm-menu.dialog-details';
import {FlatTreeControl} from '@angular/cdk/tree';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { AdmPage } from '../../api/AdmPage';
import { AdmPageService } from '../../service/AdmPageService';
import { TreeNode } from 'src/app/base/models/TreeNode';

interface MenuFlatNode {
  expandable: boolean;
  name: string;
  data: any;
  select: boolean;
  level: number;
};

@Component({
  templateUrl: './adm-menu.component.html',
  styleUrls: ["./adm-menu.component.css"],
  providers: [AdmMenuService, AdmPageService]
})
export class AdmMenuComponent implements OnInit {

  listaAdmMenu: AdmMenu[] = [];

  admMenu: AdmMenu;

  selectedAdmMenu: AdmMenu;

  submitted: boolean;

  cols: any[];

  exportColumns: any[];

  listaNodeMenu: TreeNode[] = [];

  //selectedNodeMenu: TreeNode;

  menuRoot: TreeNode;

  listaAdmPage: AdmPage[] = [];

  listaAdmMenuParent: AdmMenu[] = [];

  reportParamForm: ReportParamForm;

  deleteAdmMenuDialog: boolean = false;  

  private _transformer = (node: TreeNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.label,
      data: node.data,
      select: false,
      level: level,
    };
  };

  treeControl = new FlatTreeControl<MenuFlatNode>(
    node => node.level,
    node => node.expandable,
  );

  treeFlattener = new MatTreeFlattener(
    this._transformer,
    node => node.level,
    node => node.expandable,
    node => node.children,
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
  
  constructor(private admMenuService: AdmMenuService,
    private admPageService: AdmPageService,
    private snackBar: MatSnackBar, public dialog: MatDialog) {
    this.reportParamForm = {
        reportType: 'PDF',
        forceDownload: true
    };
  }

  hasChild = (_: number, node: MenuFlatNode) => node.expandable;
    
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

        this.dataSource.data = this.listaNodeMenu;

        this.treeControl.expandAll();
      });
  }

  updateMenusTree(listaAdmMenu: AdmMenu[]): void {
    this.listaNodeMenu = [];
    /*
    this.menuRoot = {
      'label': 'Menu do sistema',
      'data': '0',
      'children': []
    };
    */

    listaAdmMenu.forEach((itemMenu: AdmMenu) => {
      const m: TreeNode = {};
      m.data = itemMenu;
      m.label = itemMenu.description;      

      if (itemMenu.idPage === null) {
        m.children = this.mountSubMenu(itemMenu);
        //this.menuRoot.children.push(m);

        this.listaNodeMenu.push(m);
      }
    });

    //this.listaNodeMenu.push(this.menuRoot);    
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

  nodeParentSelect(node: MenuFlatNode) {
    this.selectedAdmMenu = node.data;
    //this.selectedNodeMenu = event.node;
  }

  nodeSelect(node: MenuFlatNode) {
    this.selectedAdmMenu = node.data;
    //this.selectedNodeMenu = event.node;
  }

  itemParentSelect(node: MenuFlatNode) {    
    this.deselectAll();
    node.select = true;
  }

  itemSelect(node: MenuFlatNode) {    
    this.deselectAll();
    node.select = true;
  }  

  onChangedTypeReport(typeReport: ItypeReport) {
    this.reportParamForm.reportType = typeReport.type;
  }

  onChangedForceDownload(forceDownload: boolean) {
    this.reportParamForm.forceDownload = forceDownload;
  }

  onExport() {
    this.admMenuService.report(this.reportParamForm).then(() => {
      this.snackBar.open('Categoria de parâmetro exportada', 'info', { duration: 3000 });
    });
  }

  openDialogDetails(param: AdmMenu){
    const dialogRef = this.dialog.open(AdmMenuDialogDetails, { 
      data: { 
        listaAdmPage: this.listaAdmPage, 
        listaAdmMenuParent: this.listaAdmMenuParent,
        entidade: param
      } 
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.admMenu = result.entidade;
        this.onSave(this.admMenu.admPage, this.admMenu.admMenuParent);
      }
    });
  }

  onInsert() {
    this.admMenu = emptyAdmMenu;
    this.admMenu.admMenuParent = emptyAdmMenu;
    this.openDialogDetails(emptyAdmMenu);
  }

  onEdit(admMenu: AdmMenu) {
    this.admMenu = { ...admMenu };
    this.openDialogDetails(this.admMenu);
  }

  onSave(admPage: AdmPage, admMenuParent: AdmMenu) {    
    if (admPage!=null){
      this.admMenu.idPage = admPage.id;
    }
    if (admMenuParent!=null){
      this.admMenu.idMenuParent = admMenuParent.id;
    }

    if (this.admMenu.description.trim()) {
        if (this.admMenu.id) {
          this.admMenuService.update(this.admMenu).then((obj: AdmMenu) => {
            this.admMenu = obj;

            //this.selectedNodeMenu.label = this.admMenu.description;
            //this.selectedNodeMenu.data = this.admMenu;
  
            this.listaAdmMenu[this.admMenuService
              .findIndexById(this.listaAdmMenu, this.admMenu.id)] = this.admMenu;

            this.listaAdmMenu = [...this.listaAdmMenu];
            this.admMenu = emptyAdmMenu;
            this.updateMenusTree(this.listaAdmMenu);
      
            this.snackBar.open('Categoria de parâmetro Atualizada', 'Sucesso', { duration: 3000 });
          });
        } else {
          this.admMenuService.insert(this.admMenu).then((obj: AdmMenu) => {
            this.admMenu = obj;
            this.listaAdmMenu.push(this.admMenu);

            this.listaAdmMenu = [...this.listaAdmMenu];
            this.admMenu = emptyAdmMenu;
            this.updateMenusTree(this.listaAdmMenu);
    
            this.snackBar.open('Categoria de parâmetro Criada', 'Sucesso', { duration: 3000 });
          });
        }

    }
  }

  onDelete(admMenu: AdmMenu) {
    const dialogRef = this.dialog.open(AdmMenuDialogDelete, { 
      data: { 
        lista: this.listaAdmMenu, 
        entidade: admMenu
      } 
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result){
        this.listaAdmMenu = result.lista;
        this.admMenu = result.entidade;
        this.confirmDelete();
      }
    });
      
  } 

  confirmDelete() {
    this.admMenuService.delete(this.admMenu.id).then(obj => {
      this.listaAdmMenu = this.listaAdmMenu.filter(val => val.id !== this.admMenu.id);
      this.admMenu = emptyAdmMenu;     
      this.updateMenusTree(this.listaAdmMenu); 
      this.snackBar.open('Categoria de parâmetro excluído', 'Sucesso', { duration: 3000 });
    });
  }  

  expandAll() {
    this.treeControl.expandAll();
  }

  collapseAll() {
    this.treeControl.collapseAll();
  } 

  deselectAll() {
    this.treeControl.dataNodes.forEach((node) => {
        this.selectRecursive(node, false);
    });
  } 

  private selectRecursive(node: MenuFlatNode, isSelect: boolean) {
    node.select = isSelect;
    if (node.data.children) {
        node.data.children.forEach((childNode) => {
            this.selectRecursive(childNode, isSelect);
        });
    }
  }

}
