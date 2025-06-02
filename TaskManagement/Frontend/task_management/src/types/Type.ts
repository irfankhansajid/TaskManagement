export type TaskStatus   = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export type UserRole = 'USER' | 'ADMIN';

export interface User {
    id       : number;
    username : string;
    email    : string;
    name     : string;
    role     : UserRole;
    createdAt: string;
    updatedAt: string;
}

export interface Project {
    id          : number;
    name        : string;
    description?: string;
    owner       : User;
    tasks      ?: Task[];
    createdAt   : string;
    updatedAt   : string;
}

export interface Task {
    id          : number;
    title       : string;
    description?: string;
    status      : TaskStatus;
    priority    : TaskPriority;
    dueDate     : string; 
    assignedTo    ?: User;
    project     ?: Project;
    createdAt   : string;
    updatedAt   : string;
}

export interface AuthResponse {
    token: string;
    user : User;
}