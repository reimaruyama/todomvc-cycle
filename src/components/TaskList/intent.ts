import xs, { Stream } from "xstream";
import { Action } from "./action";
import { ENTER_KEY } from "../../utils";
import { Sources } from "../../types";
import { State } from "./state";

export function intent(sources: Sources<State>): Stream<Action> {
  const newTodo$ = sources.DOM.select(".new-todo")
    .events("keydown")
    .filter((ev) => ev.keyCode === ENTER_KEY)
    .map((ev) => String((ev.target as HTMLInputElement).value).trim())
    .filter((value) => value.length > 0)
    .map((payload) => ({ type: "add", payload } satisfies Action));

  const destroyCompletedTodos$ = sources.DOM.select(".clear-completed")
    .events("click")
    .mapTo({ type: "destroyCompletedTodos" } satisfies Action);

  const changeRoute$ = sources.DOM.select(".filters a")
    .events("click")
    .map((event) => {
      const path = (event.target as HTMLAnchorElement).hash;
      return { type: "changeRoute", path } satisfies Action;
    });

  return xs.merge(newTodo$, changeRoute$, destroyCompletedTodos$);
}
