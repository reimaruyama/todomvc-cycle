import { Reducer } from "@cycle/state";
import * as Task from "../Task";
import { merge, reducer } from "../../types";

const initial = {
  todos: [],
  filterTag: "all",
  incrementalId: 0,
} satisfies State;

export type State = {
  incrementalId: number;
  todos: Task.State[];
  filterTag: FilterTag;
};
export const State = {
  initial,
  addTask,
  changeFilter,
  destroyCompletedTodos,
};

function addTask({ title }: { title: string }): Reducer<State> {
  return reducer(function addTaskReducer(preState: State): State {
    const nextId = preState.incrementalId + 1;
    return {
      ...preState,
      todos: [...preState.todos, Task.State.initial({ id: nextId, title })],
      incrementalId: nextId,
    };
  });
}

function changeFilter({ filterTag }: { filterTag: FilterTag }): Reducer<State> {
  return merge<State>({ filterTag });
}

function destroyCompletedTodos(): Reducer<State> {
  return reducer((preState: State) => ({
    ...preState,
    todos: preState.todos.filter((todo) => !todo.completed),
  }));
}

const filterTags = ["all", "active", "completed"] as const;
type FilterTag = (typeof filterTags)[number];
