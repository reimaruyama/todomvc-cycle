import xs, { Stream } from "xstream";
import { Action } from "./action";
import { ENTER_KEY, ESC_KEY } from "../../utils";
import { Sources } from "../../types";
import { State } from "./state";

export function intent(sources: Sources<State>): Stream<Action> {
  const state$ = sources.state.stream;
  const checkInput$ = sources.DOM.select(".toggle")
    .events("change")
    .map((ev) => {
      const checked = (ev.target as HTMLInputElement).checked;
      return { type: checked ? "check" : "uncheck" } satisfies Action;
    });

  const destroyInput$ = state$
    .map((state) =>
      sources.DOM.select(`.todoRoot[data-todo-id="${state.id}"] .destroy`)
        .events("click")
        .mapTo({ type: "destroy" } satisfies Action)
    )
    .flatten();

  const editStart$ = state$
    .map((state) => {
      return sources.DOM.select(`.todoRoot[data-todo-id="${state.id}"] label`)
        .events("dblclick")
        .mapTo({ type: "editStart" } satisfies Action);
    })
    .flatten();

  const editTextInput$ = sources.DOM.select(".edit");
  const editDone$ = xs
    .merge(
      editTextInput$.events("keyup").filter((ev) => ev.keyCode === ENTER_KEY),
      editTextInput$.events("blur", {}, true)
    )
    .mapTo({ type: "editDone" } satisfies Action);

  const editChancel$ = editTextInput$
    .events("keyup")
    .filter((ev) => ev.keyCode === ESC_KEY)
    .mapTo({ type: "editCancel" } satisfies Action);

  const editInput$ = sources.DOM.select(".edit")
    .events("input")
    .map((ev) => {
      return {
        title: (ev.target as HTMLInputElement).value,
        type: "editInput",
      } satisfies Action;
    });

  return xs.merge(
    checkInput$,
    destroyInput$,
    editStart$,
    editInput$,
    editChancel$,
    editDone$
  );
}
