const ACTION_SET_WORKFLOWS = "SET_WORKFLOWS";

const initialState = {
  workflows: [],
};

// Define plugin actions
export class Actions {
  static setWorkflows = (workflows) => ({
    type: ACTION_SET_WORKFLOWS,
    workflows
  });
}

// Define how actions influence state
export function reduce(state = initialState, action) {
  switch (action.type) {
    case ACTION_SET_WORKFLOWS:
      return {
        workflows: action.workflows,
      };
    default:
      return state;
  }

};
