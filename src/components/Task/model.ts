import { type Stream } from "xstream";
import { Action } from "./action";
import { State } from "./state";
import { assertNever } from "../../assertNever";
import { Reducer } from "@cycle/state";

export function model(action$: Stream<Action>): Stream<Reducer<State>> {
  return action$.map((action) => {
    switch (action.type) {
      case "check":
      case "uncheck":
        return State.check({ completed: action.type === "check" });
      case "destroy":
        return State.destroy();
      case "editStart":
        return State.editStart();
      case "editInput":
        return State.editInput({ title: action.title });
      case "editDone":
        return State.editDone();
      case "editCancel":
        return State.editCancel();
      default:
        throw assertNever(action);
    }
  });
}
