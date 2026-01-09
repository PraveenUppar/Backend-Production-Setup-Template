declare const createTodoService: (userId: string, tododata: {
    title: string;
    completed: boolean;
}) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    completed: boolean;
    userId: string;
}>;
declare const getTodoService: (page: number, limit: number) => Promise<{}>;
declare const deleteTodoService: (id: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    completed: boolean;
    userId: string;
}>;
declare const patchTodoService: (id: string, tododata: any) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    completed: boolean;
    userId: string;
}>;
export { createTodoService, getTodoService, deleteTodoService, patchTodoService, };
//# sourceMappingURL=todo.service.d.ts.map