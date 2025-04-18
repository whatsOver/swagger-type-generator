import { DocItem } from "../types/docs";

export const DEFAULT_DOC_ITEM: DocItem = {
  id: "",
  title: "",
  description: "",
  color: "",
  createdAt: "",
  swaggerDocs: {
    components: {
      schemas: {},
    },
    info: {
      title: "",
      version: "",
    },
    paths: {},
  },
};
