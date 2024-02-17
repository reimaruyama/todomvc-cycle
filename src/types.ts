import { MainDOMSource, VNode } from "@cycle/dom";
import { HistoryInput, Location } from "@cycle/history";
import { Reducer, StateSource } from "@cycle/state";
import { type MemoryStream, type Stream } from "xstream";
import { StorageSource, StorageRequest } from "@cycle/storage";

export type Sources<State> = {
  DOM: MainDOMSource;
  state: StateSource<State>;
  History: MemoryStream<Location>;
  storage: { local: StorageSource };
};

export type Sink<State> = {
  DOM: Stream<VNode>;
  state: Stream<Reducer<State>>;
  History: Stream<HistoryInput>;
  storage: Stream<StorageRequest>;
};

export function reducer<State>(
  reduceFn: (preState: State) => State
): Reducer<State> {
  // NOTE: Care undefined in `Reducer<T>` definition.
  return (arg: State | undefined): State | undefined =>
    arg === undefined ? undefined : reduceFn(arg);
}

export function merge<State>(diff: Partial<State>): Reducer<State> {
  return reducer((preState: State) => ({ ...preState, ...diff }));
}
