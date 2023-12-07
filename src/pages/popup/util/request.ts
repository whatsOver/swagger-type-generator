import { filter, keys, map, pipe, reduce, toArray } from "@fxts/core";
import { Parameters, Schemas } from "../api/docs";
import { FormValues } from "../hooks/useForm";

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

const getQueryParamsArray = (params: Parameters[]) =>
  pipe(
    params,
    filter((param) => param.in !== "body"),
    filter((param) => param.in === "query"),
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
    keys(body.properties),
    filter((property) => formValues[property]),
    map((property) => ({ [property]: formValues[property] })),
    reduce(Object.assign)
  );

const generateFormData = (body: Schemas, formValues: FormValues) => {
  const form = new FormData();
  const filteredProperty = pipe(
    keys(body.properties),
    filter((property) => formValues[property]),
    toArray
  );

  filteredProperty.forEach((property) => {
    if (Array.isArray(formValues[property])) {
      (formValues[property] as string[]).forEach((value) => {
        form.append(property, value);
      });
    } else {
      form.append(property, formValues[property] as string);
    }
  });

  return form;
};

const getRequestBodyKey = (body: Schemas) =>
  pipe(Object.keys(body.properties), toArray, (properties) =>
    properties.join(", ")
  );

export {
  getQueryParams,
  getQueryParamsArray,
  getParams,
  replacePathParams,
  getBody,
  generateFormData,
  getRequestBodyKey,
};
