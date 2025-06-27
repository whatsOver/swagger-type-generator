export type Mode = ApiMode | SchemaMode;

export type ApiMode =
  | "RESPONSE"
  | "TS"
  | "ERROR"
  | "AXIOS"
  | "FETCH"
  | "LOADING"
  | "ZOD";

export type SchemaMode =
  | Exclude<ApiMode, "LOADING" | "RESPONSE" | "ERROR">
  | "BASE";
export type SchemaType = "REQUEST_TYPE" | "RESPONSE_TYPE";

export type RequestState =
  | { type: "API_RESPONSE"; mode: ApiMode }
  | {
      type: "SCHEMA_DEFINITION";
      schemaType: SchemaType;
      mode: SchemaMode;
    };

type RequestAction =
  | { type: "INITIALIZE" }
  | { type: "INITIALIZE_TYPE" }
  | { type: "SET_API_MODE"; payload: ApiMode }
  | {
      type: "SET_SCHEMA_MODE";
      payload: SchemaMode;
      schemaType?: SchemaType;
    }
  | {
      type: "SET_SCHEMA_TYPE";
      payload: SchemaType;
      mode?: SchemaMode;
    };

export const initialState: RequestState = {
  type: "API_RESPONSE",
  mode: "RESPONSE",
};

export const requestReducer = (
  state: RequestState,
  action: RequestAction
): RequestState => {
  switch (action.type) {
    case "INITIALIZE":
      return {
        ...state,
        ...initialState,
      };

    case "INITIALIZE_TYPE": {
      if (state.type === "API_RESPONSE") {
        return {
          ...state,
          mode: "RESPONSE",
        };
      }
      return {
        ...state,
        mode: "BASE",
      };
    }

    case "SET_API_MODE":
      return {
        ...state,
        type: "API_RESPONSE",
        mode: action.payload,
      };

    case "SET_SCHEMA_MODE":
      if (state.type === "SCHEMA_DEFINITION") {
        return {
          ...state,
          mode: action.payload,
          ...(action.schemaType && { schemaType: action.schemaType }),
        };
      }
      return {
        type: "SCHEMA_DEFINITION",
        schemaType: action.schemaType || "REQUEST_TYPE",
        mode: action.payload,
      };

    case "SET_SCHEMA_TYPE":
      if (state.type === "SCHEMA_DEFINITION") {
        return {
          ...state,
          schemaType: action.payload,
          ...(action.mode && { mode: action.mode }),
        };
      }
      return {
        type: "SCHEMA_DEFINITION",
        schemaType: action.payload,
        mode: action.mode || "BASE",
      };

    default:
      return state;
  }
};
