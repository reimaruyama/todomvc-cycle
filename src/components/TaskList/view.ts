import xs, { Stream } from "xstream";
import { State } from "./state";
import { VNode } from "@cycle/dom";
import * as dom from "@cycle/dom";

export function view(
  state$: Stream<State>,
  childDom$: Stream<VNode[]>
): Stream<VNode> {
  return xs.combine(state$, childDom$).map(([state, childDom]) => {
    const domZippedTodos = state.todos.map((_, index) => ({
      ..._,
      DOM: childDom[index],
    }));
    const filteredTodoDoms = domZippedTodos
      .filter((todo) => {
        switch (state.filterTag) {
          case "all":
            return true;
          case "active":
            return todo.completed === false;
          case "completed":
            return todo.completed;
          default:
            return true;
        }
      })
      .map((todo) => todo.DOM);

    const allCompleted = state.todos.every((todo) => todo.completed);
    const amountCompleted = state.todos.filter((todo) => todo.completed).length;
    const amountActive = state.todos.length - amountCompleted;
    const sectionStyle = { display: state.todos.length ? "" : "none" };

    const mainSection = dom.section(".main", { style: sectionStyle }, [
      dom.input(".toggle-all", {
        props: { type: "checkbox", completed: allCompleted },
      }),
      dom.ul(".todo-list", filteredTodoDoms),
    ]);
    const newTaskInput = dom.header(".header", [
      dom.h1("todos"),
      dom.input(".new-todo", {
        props: {
          type: "text",
          placeholder: "What needs to be done?",
          autofocus: true,
          name: "newTodo",
        },
        hook: {
          update: (_oldVNode: any, { elm }: any) => {
            elm.value = "";
          },
        },
      }),
    ]);

    const footerStyle = { display: state.todos.length ? "" : "none" };
    const footerSection = dom.footer(".footer", { style: footerStyle }, [
      dom.span(".todo-count", [
        dom.strong(String(amountActive)),
        " item" + (amountActive !== 1 ? "s" : "") + " left",
      ]),
      dom.ul(".filters", [
        renderFilterButton(state, "all", "/#/", "All"),
        renderFilterButton(state, "active", "/#/active", "Active"),
        renderFilterButton(state, "completed", "/#/completed", "Completed"),
      ]),
      amountCompleted > 0
        ? dom.button(
            ".clear-completed",
            "Clear completed (" + amountCompleted + ")"
          )
        : null,
    ]);

    return dom.div([newTaskInput, mainSection, footerSection]);
  });
}

function renderFilterButton(
  state: State,
  filterTag: State["filterTag"],
  path: string,
  label: string
) {
  return dom.li([
    dom.a(
      {
        props: { href: path },
        class: { selected: state.filterTag === filterTag },
      },
      label
    ),
  ]);
}
