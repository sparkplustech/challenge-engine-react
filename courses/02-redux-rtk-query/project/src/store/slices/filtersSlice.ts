import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type PostSortOrder = 'newest' | 'oldest'

interface FiltersState {
  filterUserId: number | null
  sortBy: PostSortOrder
}

const initialState: FiltersState = {
  filterUserId: null,
  sortBy: 'newest',
}

const filtersSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    setFilterUserId: (state, action: PayloadAction<number | null>) => {
      state.filterUserId = action.payload
    },
    setSortBy: (state, action: PayloadAction<PostSortOrder>) => {
      state.sortBy = action.payload
    },
  },
})

export const { setFilterUserId, setSortBy } = filtersSlice.actions
export default filtersSlice.reducer
