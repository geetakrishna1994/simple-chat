import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
};
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    newUser: (state, action) => {
      console.log(action.payload);
      state.users.push(action.payload);
      state.users.sort((a, b) =>
        a.displayName.toLowerCase() < b.displayName.toLowerCase() ? -1 : 1
      );
    },
    setUsers: (state, action) => {
      state.users = action.payload;
      state.users.sort((a, b) =>
        a.displayName.toLowerCase() < b.displayName.toLowerCase() ? -1 : 1
      );
    },
    updateUser: (state, action) => {
      const userIdx = state.users.findIndex(
        (u) => u._id === action.payload._id
      );
      console.log(userIdx);
      if (userIdx > -1) {
        state.users[userIdx] = {
          ...state.users[userIdx],
          ...action.payload.updatedFields,
        };
      }
    },
    resetUsers: (state) => {
      return initialState;
    },
  },
});

export const { newUser, setUsers, updateUser, resetUsers } = usersSlice.actions;

export default usersSlice.reducer;
