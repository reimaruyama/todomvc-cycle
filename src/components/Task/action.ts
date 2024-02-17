export type Action =
  | {
      type: "check";
    }
  | {
      type: "uncheck";
    }
  | {
      type: "destroy";
    }
  | {
      type: "editStart";
    }
  | {
      type: "editInput";
      title: string;
    }
  | {
      type: "editDone";
    }
  | {
      type: "editCancel";
    };
