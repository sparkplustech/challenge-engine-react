import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { mockApi, type Post, type User } from './mockServer'

const toQueryError = (error: unknown) => ({
  status: 'CUSTOM_ERROR' as const,
  error: error instanceof Error ? error.message : 'The request failed',
})

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/' }),
  tagTypes: ['User', 'Post'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      queryFn: async () => {
        try {
          return { data: await mockApi.getUsers() }
        } catch (error) {
          return { error: toQueryError(error) }
        }
      },
      providesTags: (result) => result
        ? [
            ...result.map(({ id }) => ({ type: 'User' as const, id })),
            { type: 'User' as const, id: 'LIST' },
          ]
        : [{ type: 'User' as const, id: 'LIST' }],
    }),
    getPosts: builder.query<Post[], void>({
      queryFn: async () => {
        try {
          return { data: await mockApi.getPosts() }
        } catch (error) {
          return { error: toQueryError(error) }
        }
      },
      providesTags: (result) => result
        ? [
            ...result.map(({ id }) => ({ type: 'Post' as const, id })),
            { type: 'Post' as const, id: 'LIST' },
          ]
        : [{ type: 'Post' as const, id: 'LIST' }],
    }),
    getPostById: builder.query<Post, number>({
      queryFn: async (id) => {
        try {
          return { data: await mockApi.getPostById(id) }
        } catch (error) {
          return { error: toQueryError(error) }
        }
      },
      providesTags: (_result, _error, id) => [{ type: 'Post', id }],
    }),
    addPost: builder.mutation<Post, Omit<Post, 'id'>>({
      queryFn: async (post) => {
        try {
          return { data: await mockApi.createPost(post) }
        } catch (error) {
          return { error: toQueryError(error) }
        }
      },
      async onQueryStarted(post, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData('getPosts', undefined, (draft) => {
            draft.push({ ...post, id: Date.now() })
          }),
        )

        try {
          await queryFulfilled
        } catch {
          patchResult.undo()
        }
      },
      invalidatesTags: (_result, error) => error ? [] : [{ type: 'Post', id: 'LIST' }],
    }),
  }),
})

export const {
  useGetUsersQuery,
  useGetPostsQuery,
  useGetPostByIdQuery,
  useAddPostMutation,
} = apiSlice
