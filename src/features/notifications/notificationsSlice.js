import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
} from "@reduxjs/toolkit"
import { client } from "../../api/client"

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (_, { getState }) => {
    const [latestNotification] = selectAllNotifications(getState())
    const latestTimestamp = latestNotification ? latestNotification.date : ""
    const response = await client.get(
      `/fakeApi/notifications?since=${latestTimestamp}`
    )
    return response.data
  }
)

const notificationsAdapter = createEntityAdapter({
  // Sort with newest first
  sortComparer: (a, b) => b.date.localeCompare(a.date),
})
const initialState = notificationsAdapter.getInitialState()

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    allNotificationsRead(state, action) {
      Object.values(state.entities).forEach((notification) => {
        notification.read = true
      })
    },
  },
  extraReducers(builder) {
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      Object.values(state.entities).forEach((notification) => {
        // Any notifications we've read are no longer new
        notification.isNew = !notification.read
      })
      notificationsAdapter.upsertMany(state, action.payload)
    })
  },
})

export const { allNotificationsRead } = notificationsSlice.actions
export default notificationsSlice.reducer

// Export the customized selectors for this adapter using `getSelectors`
export const { selectAll: selectAllNotifications } =
  notificationsAdapter.getSelectors((state) => state.notifications)
