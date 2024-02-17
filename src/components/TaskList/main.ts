import { Reducer, makeCollection } from "@cycle/state";
import xs, { Stream } from "xstream";
import { State } from "./state";
import isolate from "@cycle/isolate";
import * as Task from "../Task";
import { intent } from "./intent";
import { view } from "./view";
import { model } from "./model";
import { Sink, Sources, reducer } from "../../types";
import { StorageRequest } from "@cycle/storage";

export function main(
  sources: Sources<State>
): Pick<Sink<State>, "DOM" | "state" | "storage"> {
  const state$ = sources.state.stream;
  const items = isolate(
    makeCollection({
      item: Task.component,
      itemKey: (childState: Task.State) => String(childState.id),
      itemScope: (_) => _,
      collectSinks: (instances) => {
        return {
          DOM: instances.pickCombine("DOM"),
          state: instances.pickMerge("state"),
        };
      },
    }),
    {
      state: {
        get: (state: State) => {
          return state.todos;
        },
        set: (state: State, childState: Task.State) => {
          return { ...state, todos: childState };
        },
      },
      DOM: null,
    }
  )(sources);

  const action$ = intent(sources);
  const childReducer$ = items.state;

  const childDom$ = items.DOM;
  const storage$ = state$.map(
    (state): StorageRequest => ({
      target: "local",
      action: "setItem",
      key: "todos-cycle",
      value: JSON.stringify(state),
    })
  );

  const sourceList$ = sources.storage.local
    .getItem("todos-cycle")
    .take(1)
    .map((stored: unknown) =>
      reducer((preState: State): State => {
        if (typeof stored !== "string") {
          return State.initial;
        }
        // TODO: Parse strictly
        try {
          const result = JSON.parse(stored) as State;
          if (Array.isArray(result.todos)) {
            return result;
          }
          return preState ?? State.initial;
        } catch (e) {
          return preState ?? State.initial;
        }
      })
    ) satisfies Stream<Reducer<State>>;
  const vdom$ = view(state$, childDom$);

  const reducer$ = model(action$);

  return {
    DOM: vdom$,
    state: xs.merge(
      xs.of(() => State.initial),
      sourceList$,
      childReducer$,
      reducer$
    ),
    storage: storage$,
  };
}
