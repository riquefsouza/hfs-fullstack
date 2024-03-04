export interface TreeNode<T = any> {
    key?: string;
    label?: string;
    data?: T;
    children?: TreeNode<T>[];
    expanded?: boolean;
}
