import { type Dispatch, createContext, useContext, useReducer } from "react";
import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import type { daySchema } from "~/components/forms/day/schema";

export type Node = React.FC<{ form: UseFormReturn<z.infer<typeof daySchema>> }>;

type ReducerTypes = "ADD" | "REMOVE";

export type Reducer = Dispatch<{ type: ReducerTypes; node: Node }>;

type Context = {
  node: Node;
  key: string;
}[];

const DayFormContext = createContext<Context | null>(null);
const DayFormDispatchContext = createContext<Reducer>(() => null);

const initialState: Context = [];

export const DayProvider = ({ children }: { children: React.ReactNode }) => {
  const [forms, dispatch] = useReducer(dayFormReducer, initialState);

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
