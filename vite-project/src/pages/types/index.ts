export interface LoginValues {
  email: string;
  password: string;
}
export interface RegisterValues {
  fname: string;
  lname: string;
  email: string;
  password: string;
  confirmPassword?: string;
  role: "admin" | "employee";
  department:
  | ""
  | "Web Development"
  | "Android Development"
  | "iOS Development"
  | "Designing";
}
export interface TaskFormValues {
  title: string;
}

export interface TaskFormProps {
  onSubmit: (values: Task) => Promise<void> | void;
  refresh: boolean;
}

export interface ApiOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  token?: string | null; // optional and nullable
  headers?: Record<string, string>; // optional custom headers
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: {
    id: string;
    fname: string;
    lname: string;
    email: string;
    role: string;
    department: string;
  };
}
export interface LoginResponse {
  message: string;
  token: string;
  user: user;
}
export interface user {
  id: string | null;
  fname: string;
  lname: string;
  email: string;
  role: "admin" | "employee";

  department: string;
}

export interface Task {
  _id?: string | null;
  title: string;

  userId: string;
  createRole: string;
  createDepartment: string;
  status: "pending" | "completed";
  adminId?: string | null;
  statusChangeRole?: "none" | "admin" | "employee";
  createdAt?: Date | string | null;
  updatedAt?: string | null | undefined;
}
export interface updatedata{
  title:string,
    adminId?: string | null;


}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetTasksResponse {
  message: string;
  tasks: Task[];
  pagination: Pagination;
}
export interface GetTaskResponse {
  message: string;
  task: Task;
}

export interface taskStatusChange{
  status:"completed" |"pending"
  statusChangeRole:string,
  adminId:string
}

export interface CreateTaskResponse {
  message: string;
  task: Task;
}


export interface ForgotPasswordValues {
  email: string,
  password: string,
  confirmPassword?: string,
}

export interface ForgotPasswordResponse {
  message: string
}

export interface UserByRoleResponse {
  success: boolean;
  data: UserWithTaskCount;
}

export interface ProfileEditModalProps {
  user: user |null;
  onClose?: () => void;
  onUpdate: (data: Partial<user>) => void;
}

export interface UpdateProfile{
  message:string,
  data:user
}
export interface User {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  role: string;
  state: string;
  department: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  __v?: number; // optional, since it’s system-generated
}

//------------------------------Admin dashboard types----------------------------------------------------------
export interface DepartmentUserCount {
  departmentName: string;
  totalUsers: number;
  totalTasks: number;
  totalCompleted: number;
  completedPercent: number;
}

// Type for the API response
export interface DepartmentUserCountResponse {
  success: boolean;
  data: DepartmentUserCount[];
}

// Type for a single user with task count
export interface UserWithTaskCount {
  _id: string;
  fname: string;
  lname: string;
  email: string;
  role: string;
  state: string;
  department: string;
  tasks: Task[];
  totalTasks: number;
  completedTasks: number;
  completionPercentage: number;
}

// Type for the API response
export interface UsersByRoleResponse {
  success: boolean;
  data: UserWithTaskCount[];
}

export interface PopUpFormProps {
  user?: UserWithTaskCount;
  onClose: () => void;
  onSubmit: (data: Task) => void;
}

export interface ShowTasksProps {
  user: UserWithTaskCount;
  onClose: () => void;
}

export interface GetTasksByUserIdResponse {
  message: string;
  tasks: Task[];
}

export interface GetAllUserResponse{
  success:string;
  data:User[];
}
