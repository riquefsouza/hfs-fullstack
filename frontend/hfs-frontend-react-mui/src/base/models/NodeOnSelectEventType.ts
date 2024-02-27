import { TreeNode } from "primereact/treenode";

export const emptyTreeNode: TreeNode = {
    'label': '',
    'data': '0',
    'children': []
};

export type NodeOnSelectEventType = { originalEvent?: Event; node: TreeNode; data?: any; };