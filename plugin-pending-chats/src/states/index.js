import { combineReducers } from 'redux';

import { reduce as workflowsReducer } from './WorkflowState';
// Register your redux store under a unique namespace
export const namespace = 'transfers';

// Combine the reducers
export default combineReducers({
  workflows: workflowsReducer
});
