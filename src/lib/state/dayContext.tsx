import { type Dispatch, createContext, useContext, useReducer } from "react";

// export type Node = React.FC<{ form: UseFormReturn<z.infer<typeof daySchema>> }>;
export type Node = React.FC;

type ReducerTypes = "ADD" | "REMOVE";

export type Reducer = Dispatch<{ type: ReducerTypes; node: Node }>;

export type Context = {
  node: Node;
  key: string;
}[];

const DayFormContext = createContext<Context | null>(null);
const DayFormDispatchContext = createContext<Reducer>(() => null);

/**
 *
 * @param children: React.ReactNode
 * @param initialState: Context | undefined
 * this is used when the form is in edit mode and renders forms to the provider based on the data given to the create/edit forms
 * @returns form context provider
 *
 */

export const DayProvider = ({
  children,
  initialState,
}: {
  children: React.ReactNode;
  initialState?: Node[];
}) => {
  if (!initialState) initialState = [];

  const initState: Context = initialState.map((node, index) => ({
    node,
    key: index.toString(),
  }));

  const [forms, dispatch] = useReducer(dayFormReducer, initState);
  return (
    <DayFormContext.Provider value={forms}>
      <DayFormDispatchContext.Provider value={dispatch}>
        {children}
      </DayFormDispatchContext.Provider>
    </DayFormContext.Provider>
  );
};

export const useDayForm = () => {
  return useContext(DayFormContext);
};

export const useDayFormDispatch = () => {
  return useContext(DayFormDispatchContext);
};

export const dayFormReducer = (
  state: Context,
  action: { type: ReducerTypes; node: Node },
) => {
  const key = state.length + 1;
  switch (action.type) {
    case "ADD": {
      return [...state, { node: action.node, key: key.toString() }];
    }
    case "REMOVE": {
      return state.filter(({ node }) => node !== action.node);
    }
    default: {
      return state;
    }
  }
};
