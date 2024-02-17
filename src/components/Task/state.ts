import { Reducer } from "@cycle/state";
import { merge, reducer } from "../../types";

export type State = Common & EditState;
export const State = {
  initial,
  check,
  destroy,
  editStart,
  editInput,
  editDone,
  editCancel,
};

type Common = {
  id: number;
  completed: boolean;
  title: string;
};

type EditState = EditActive | EditInActive;

type EditActive = {
  editing: true;
  backedUpTitle: string;
};

type EditInActive = {
  editing: false;
  backedUpTitle: null;
};

function initial({ id, title }: { id: number; title: string }): State {
  return {
    id,
    title,
    completed: false,
    editing: false,
    backedUpTitle: null,
  };
}

function check({ completed }: { completed: boolean }): Reducer<State> {
  return merge<State>({ completed });
}

function destroy(): Reducer<State> {
  /**
   * > To delete a child instance, the child component to be deleted can send a reducer which returns undefined.
   * ref: https://cycle.js.org/api/state.html#cycle-state-source-usage-how-to-handle-a-dynamic-list-of-nested-components
   */
  return (_preState: State | undefined): State | undefined => undefined;
}

function editStart(): Reducer<State> {
  return reducer(
    (preState: State): State => ({
      ...preState,
      editing: true,
      backedUpTitle: preState.title,
    })
  );
}

function editInput({ title }: { title: string }): Reducer<State> {
  return reducer(
    (preState: State): State => ({
      ...preState,
      title,
    })
  );
}

function editDone(): Reducer<State> {
  return reducer((preState: State): State => {
    if (preState.editing === true) {
      return { ...preState, editing: false, backedUpTitle: null };
    }
    return preState;
  });
}

function editCancel(): Reducer<State> {
  return reducer((preState: State): State => {
    if (preState.editing === true) {
      return {
        ...preState,
        editing: false,
        title: preState.backedUpTitle,
        backedUpTitle: null,
      };
    }
    return preState;
  });
}
