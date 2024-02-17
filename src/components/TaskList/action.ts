export type Action = {
    type: 'add';
    payload: string;
} | {
    type: 'changeRoute';
    path: string;
} | {
    type: 'destroyCompletedTodos';
};
