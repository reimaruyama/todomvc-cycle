import "../node_modules/todomvc-app-css/index.css";
import "../node_modules/todomvc-common/base.css";

import { run } from "@cycle/run";
import { makeDOMDriver } from "@cycle/dom";
import * as TaskList from "./components/TaskList";
import { withState } from "@cycle/state";
import storageDriver from "@cycle/storage";
import { makeHistoryDriver } from "@cycle/history";

const main = TaskList.component;

run(withState(main), {
  DOM: makeDOMDriver(".todoapp"),
  History: makeHistoryDriver(),
  storage: storageDriver,
});
