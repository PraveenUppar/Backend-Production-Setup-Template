interface TodoData {
    title: string;
    completed: boolean;
}
interface UpdateData {
    title?: string;
    completed?: boolean;
}
declare const createTodoService: (userId: string, tododata: TodoData) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    completed: boolean;
    userId: string;
}>;
declare const getTodoService: () => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    completed: boolean;
    userId: string;
}[]>;
declare const deleteTodoService: (id: string) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    completed: boolean;
    userId: string;
}>;
declare const patchTodoService: (id: string, tododata: UpdateData) => Promise<{
    id: string;
    createdAt: Date;
    updatedAt: Date;
    title: string;
    completed: boolean;
    userId: string;
}>;
export { createTodoService, getTodoService, deleteTodoService, patchTodoService, };
//# sourceMappingURL=todo.service.d.ts.map