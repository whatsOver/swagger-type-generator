import { vars } from "@/shared/ui/styles/theme.css";
import { DocItem } from "../types/docs";

export const DEFAULT_DOC_ITEM: DocItem = {
  id: "",
  title: "",
  description: "",
  color: vars.color.red,
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
