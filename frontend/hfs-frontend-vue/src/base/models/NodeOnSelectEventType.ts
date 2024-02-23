import { TreeNode } from "primevue/tree";

export const emptyTreeNode: TreeNode = {
    'key': '',
    'label': '',
    'data': '0',
    'children': []
};

export type NodeOnSelectEventType = { originalEvent?: Event, node: TreeNode, data?: any };