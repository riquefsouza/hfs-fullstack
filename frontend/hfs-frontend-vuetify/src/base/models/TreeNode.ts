export const emptyTreeNode: TreeNode = {
    'key': '',
    'label': '',
    'data': '0',
    'children': [],
    expanded: false
};

export interface TreeNode<T = any> {
    key?: string;
    label?: string;
    data?: T;
    children?: TreeNode<T>[];
    expanded?: boolean;
}
