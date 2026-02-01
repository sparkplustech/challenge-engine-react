/**
 * Mock API Server for RTK Query
 * 
 * This simulates a REST API for development and testing.
 * In a real app, you would use a real backend API.
 */

export interface User {
  id: number
  name: string
  email: string
  username: string
  phone: string
}

export interface Post {
  id: number
  userId: number
  title: string
  body: string
}

// Mock data
let users: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', username: 'johndoe', phone: '123-456-7890' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', username: 'janesmith', phone: '234-567-8901' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', username: 'bobjohnson', phone: '345-678-9012' },
]

let posts: Post[] = [
  { id: 1, userId: 1, title: 'First Post', body: 'This is the first post' },
  { id: 2, userId: 1, title: 'Second Post', body: 'This is the second post' },
  { id: 3, userId: 2, title: 'Third Post', body: 'This is the third post' },
]

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export const mockApi = {
  // Users API
  async getUsers(): Promise<User[]> {
    await delay(500)
    return [...users]
  },

  async getUserById(id: number): Promise<User> {
    await delay(300)
    const user = users.find(u => u.id === id)
    if (!user) throw new Error('User not found')
    return user
  },

  async createUser(user: Omit<User, 'id'>): Promise<User> {
    await delay(400)
    const newUser: User = { ...user, id: users.length + 1 }
    users.push(newUser)
    return newUser
  },

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    await delay(400)
    const index = users.findIndex(u => u.id === id)
    if (index === -1) throw new Error('User not found')
    users[index] = { ...users[index], ...updates }
    return users[index]
  },

  async deleteUser(id: number): Promise<void> {
    await delay(300)
    users = users.filter(u => u.id !== id)
  },

  // Posts API
  async getPosts(): Promise<Post[]> {
    await delay(500)
    return [...posts]
  },

  async getPostById(id: number): Promise<Post> {
    await delay(300)
    const post = posts.find(p => p.id === id)
    if (!post) throw new Error('Post not found')
    return post
  },

  async createPost(post: Omit<Post, 'id'>): Promise<Post> {
    await delay(400)
    const newPost: Post = { ...post, id: posts.length + 1 }
    posts.push(newPost)
    return newPost
  },

  async updatePost(id: number, updates: Partial<Post>): Promise<Post> {
    await delay(400)
    const index = posts.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Post not found')
    posts[index] = { ...posts[index], ...updates }
    return posts[index]
  },

  async deletePost(id: number): Promise<void> {
    await delay(300)
    posts = posts.filter(p => p.id !== id)
  },
}
