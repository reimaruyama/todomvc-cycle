import { intent } from "./intent";
import { model } from "./model";
import { view } from "./view";
import { State } from "./state";
import { Sink, Sources } from "../../types";

export function main(
  sources: Sources<State>
): Pick<Sink<State>, "DOM" | "state"> {
  const state$ = sources.state.stream;
  const vdom$ = view(state$);
  const action$ = intent(sources);
  const reducer$ = model(action$);

  return {
    DOM: vdom$,
    state: reducer$,
  };
}
