export const dayFormReducer = (
  state: React.ReactNode[],
  action: { type: string; node: React.ReactNode },
) => {
  switch (action.type) {
    case "ADD":
      return [...state, action.node];
    case "REMOVE":
      return state.filter((node) => node !== action.node);
    default:
      return state;
  }
};
