import { combineReducers } from "redux";


import authReducer from '../slices/authSlice';
const rootReducer = combineReducers({
  // Add your individual reducers here
 auth: authReducer,

});
export default rootReducer;