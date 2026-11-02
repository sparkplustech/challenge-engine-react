import type { Task } from '../components/TaskList'

export const ADD_TASK = 'ADD_TASK' as const
export const UPDATE_TASK = 'UPDATE_TASK' as const
export const DELETE_TASK = 'DELETE_TASK' as const
export const TOGGLE_TASK = 'TOGGLE_TASK' as const
export const SET_TASKS = 'SET_TASKS' as const

export type TaskUpdate = Partial<Omit<Task, 'id'>> & { id: Task['id'] }

export type TaskAction =
  | { type: typeof ADD_TASK; payload: Task }
  | { type: typeof UPDATE_TASK; payload: TaskUpdate }
  | { type: typeof DELETE_TASK; payload: Task['id'] }
  | { type: typeof TOGGLE_TASK; payload: Task['id'] }
  | { type: typeof SET_TASKS; payload: Task[] }

export const addTask = (task: Task): TaskAction => ({ type: ADD_TASK, payload: task })
export const updateTask = (id: Task['id'], updates: Omit<TaskUpdate, 'id'>): TaskAction => ({
  type: UPDATE_TASK,
  payload: { id, ...updates },
})
export const deleteTask = (id: Task['id']): TaskAction => ({ type: DELETE_TASK, payload: id })
export const toggleTask = (id: Task['id']): TaskAction => ({ type: TOGGLE_TASK, payload: id })
export const setTasks = (tasks: Task[]): TaskAction => ({ type: SET_TASKS, payload: tasks })

export default function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case ADD_TASK:
      return [...state, action.payload]
    case UPDATE_TASK:
      return state.map((task) =>
        task.id === action.payload.id ? { ...task, ...action.payload } : task,
      )
    case DELETE_TASK:
      return state.filter((task) => task.id !== action.payload)
    case TOGGLE_TASK:
      return state.map((task) =>
        task.id === action.payload ? { ...task, completed: !task.completed } : task,
      )
    case SET_TASKS:
      return action.payload
    default: {
      const exhaustiveAction: never = action
      return exhaustiveAction
    }
  }
}
