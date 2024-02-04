type Action = { type: string; payload?: any };

export const initialState = {
  storyBody: [],
};

function storyReducer(state: any, action: Action) {
  switch (action.type) {
    // Add your reducer cases here
    default:
      return state;
  }
}

export default storyReducer;
