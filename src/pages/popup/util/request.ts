import { filter, map, pipe, reduce, toArray } from "@fxts/core";
import { Parameters, Schemas } from "../api/docs";

type FormValues = {
  [key: string]: string;
};

const getQueryParams = (params: Parameters[], formValues: FormValues) =>
  pipe(
    params,
    filter((param) => formValues[param.name]),
    map((param) => ({ [param.name]: formValues[param.name] })),
    reduce(Object.assign)
  );

const getParams = (params: Parameters[]) =>
  pipe(
    params,
    filter((param) => param.in !== "body"),
    map((param) => param.name),
    toArray,
    (params) => params.join(", ")
  );

const replacePathParams = (path: string, formValues: FormValues) =>
  pipe(
    path.split("/"),
    map((part) => (part.startsWith(":") ? formValues[part.slice(1)] : part)),
    reduce((acc, part) => `${acc}/${part}`)
  );

const getBody = (body: Schemas, formValues: FormValues) =>
  pipe(
    Object.keys(body.properties),
    filter((property) => formValues[property]),
    map((property) => ({ [property]: formValues[property] })),
    reduce(Object.assign)
  );

const getRequestBodyKey = (body: Schemas) =>
  pipe(Object.keys(body.properties), toArray, (properties) =>
    properties.join(", ")
  );

export {
  getQueryParams,
  getParams,
  replacePathParams,
  getBody,
  getRequestBodyKey,
};
