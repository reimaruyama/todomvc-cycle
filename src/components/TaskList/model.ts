import { Stream } from "xstream";
import { Action } from "./action";
import { assertNever } from "../../assertNever";
import { State } from "./state";
import { Reducer } from "@cycle/state";

export function model(action$: Stream<Action>): Stream<Reducer<State>> {
  return action$.map((action) => {
    switch (action.type) {
      case "add":
        return State.addTask({ title: action.payload });
      case "changeRoute":
        return State.changeFilter({ filterTag: pathToFilterTag(action.path) });
      case "destroyCompletedTodos":
        return State.destroyCompletedTodos();
      default:
        throw assertNever(action);
    }
  });
}

function pathToFilterTag(path: string): State["filterTag"] {
  switch (path) {
    case "/":
    case "#/":
      return "all";
    case "#/active":
      return "active";
    case "#/completed":
      return "completed";
    default:
      return "all";
  }
}
