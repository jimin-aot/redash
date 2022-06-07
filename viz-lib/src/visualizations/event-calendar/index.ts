import { merge } from "lodash";

import Renderer from "./Renderer";
import Editor from "./Editor";

const DEFAULT_OPTIONS = {
  projectName: "",
};

export default {
  type: "EVENT_CALENDAR",
  name: "Event Calendar",
  getOptions: (options: any) => merge({}, DEFAULT_OPTIONS, options),
  Renderer,
  Editor,
  defaultRows: 8,
};
