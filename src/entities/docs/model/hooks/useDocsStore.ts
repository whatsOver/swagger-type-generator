import { SwaggerDocs } from "@/entities/swagger/types";
import { useKeyStorage } from "@/shared/hooks/useStorage";
import { storage } from "@/shared/module/storageFactory";
import { useCallback } from "react";
import { DocItem, DocsStorageState, PathInfo } from "../types/docs";

export const docsStorage = storage<DocsStorageState>("DOCS_LIST", {
  docsList: [],
});

export const useDocsStore = () => {
  const [docsState, setDocsState] = useKeyStorage<DocsStorageState>(
    "DOCS_LIST",
    {
      docsList: [],
    }
  );

  const createDoc = useCallback(
    async (doc: DocItem) => {
      await setDocsState((prev) => ({
        ...prev,
        docsList: [...prev.docsList, doc],
      }));
      return doc;
    },
    [setDocsState]
  );

  const deleteDoc = useCallback(
    async (id: string) => {
      await setDocsState((prev) => ({
        ...prev,
        docsList: prev.docsList.filter((doc) => doc.id !== id),
      }));
    },
    [setDocsState]
  );

  const deleteDocs = useCallback(
    async (ids: string[]) => {
      await setDocsState((prev) => ({
        ...prev,
        docsList: prev.docsList.filter((doc) => !ids.includes(doc.id)),
      }));
    },
    [setDocsState]
  );

  const updateDoc = useCallback(
    async (id: string, doc: DocItem) => {
      await setDocsState((prev) => ({
        ...prev,
        docsList: prev.docsList.map((d) => (d.id === id ? doc : d)),
      }));
    },
    [setDocsState]
  );

  const updateDocsList = useCallback(
    async (docsList: DocItem[]) => {
      await setDocsState((prev) => ({ ...prev, docsList }));
    },
    [setDocsState]
  );

  const updateDocSwaggerDocs = useCallback(
    async (id: string, swaggerDocs: SwaggerDocs) => {
      await setDocsState((prev) => ({
        ...prev,
        docsList: prev.docsList.map((d) =>
          d.id === id
            ? {
                ...d,
                swaggerDocs: {
                  ...d.swaggerDocs,
                  ...swaggerDocs,
                },
              }
            : d
        ),
      }));
    },
    [setDocsState]
  );

  const addPathToDoc = useCallback(
    async (id: string, pathInfo: PathInfo) => {
      // 동일 path 정보가 있으면 error return
      const lowerCaseMethod = pathInfo.method.toLowerCase();
      const existingPath = docsState.docsList.find((d) =>
        Object.values(d.swaggerDocs.paths).some(
          (path) => path[lowerCaseMethod] === pathInfo.information
        )
      );
      if (existingPath) {
        throw new Error("동일한 path 정보가 이미 존재합니다.");
      }
      await setDocsState((prev) => ({
        ...prev,
        docsList: prev.docsList.map((d) =>
          d.id === id
            ? {
                ...d,
                swaggerDocs: {
                  ...d.swaggerDocs,
                  paths: {
                    ...d.swaggerDocs.paths,
                    [pathInfo.path]: {
                      ...d.swaggerDocs.paths[pathInfo.path],
                      [lowerCaseMethod]: pathInfo.information,
                    },
                  },
                },
              }
            : d
        ),
      }));
    },
    [setDocsState]
  );

  const updatePathInfo = useCallback(
    async (id: string, pathInfo: PathInfo) => {
      await setDocsState((prev) => ({
        ...prev,
        docsList: prev.docsList.map((d) =>
          d.id === id ? { ...d, pathInfo } : d
        ),
      }));
    },
    [setDocsState]
  );

  const deletePathInfo = useCallback(
    async (id: string, pathInfo: PathInfo) => {
      await setDocsState((prev) => ({
        ...prev,
        docsList: prev.docsList.map((d) =>
          d.id === id ? { ...d, pathInfo } : d
        ),
      }));
    },
    [setDocsState]
  );

  return {
    docsState,
    createDoc,
    deleteDoc,
    deleteDocs,
    updateDoc,
    updateDocsList,
    updateDocSwaggerDocs,
    addPathToDoc,
    updatePathInfo,
    deletePathInfo,
  };
};
