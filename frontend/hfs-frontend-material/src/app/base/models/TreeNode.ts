export interface TreeNode<T = any> {
    label?: string;
    data?: T;
    children?: TreeNode<T>[];
    expanded?: boolean;
}
