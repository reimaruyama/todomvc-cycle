import { type Stream } from "xstream";
import { State } from "./state";
import * as dom from "@cycle/dom";

export function view(state$: Stream<State>): Stream<dom.VNode> {
    return state$.map(state => {
        const title = state.title;
        const completed = state.completed;
        const editing = state.editing;
        const todoRootClasses = {
            completed,
            editing,
        };
        const vdom = dom.li(
          ".todoRoot",
          { class: todoRootClasses, attrs: { "data-todo-id": state.id } },
          [
            dom.div(".view", [
              dom.input(".toggle", {
                props: { type: "checkbox", checked: completed },
              }),
              dom.label(title),
              dom.button(`.destroy`),
            ]),
            dom.input(".edit", {
              props: { type: "text" },
              hook: {
                update: (_oldVNode: any, element: any) => {
                  const { elm } = element;
                  // TODO: make JS side effect Driver
                  // https://stackoverflow.com/questions/35051281/how-do-i-focus-an-input-with-cycle-js-and-rxjs
                  elm.value = title;
                  if (editing) {
                    elm.focus();
                    elm.selectionStart = elm.value.length;
                  }
                },
              },
            }),
          ]
        );

        return vdom;
    })
}