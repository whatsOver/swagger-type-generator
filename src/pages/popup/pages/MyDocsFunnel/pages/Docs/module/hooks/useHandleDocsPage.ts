import { DEFAULT_DOC_ITEM } from "@/entities/docs/model/data/docs";
import { useDocsStore } from "@/entities/docs/model/hooks/useDocsStore";
import { DocItem } from "@/entities/docs/model/types/docs";
import useRouter, { navigationPath } from "@/shared/hooks/useRouter";
import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { v4 as uuidV4 } from "uuid";

type Mode = "VIEW" | "ADD";

export const useHandleDocsPage = () => {
  const router = useRouter();
  const { docsState, createDoc } = useDocsStore();

  const [mode, setMode] = useState<Mode>("VIEW");

  const [doc, setDoc] = useState<DocItem>(DEFAULT_DOC_ITEM);

  const onChangeTitle = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDoc((prev) => ({ ...prev, title: e.target.value }));
    },
    []
  );

  const onChangeDescription = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setDoc((prev) => ({ ...prev, description: e.target.value }));
    },
    []
  );

  const onChangeColor = useCallback((color: string) => {
    setDoc((prev) => ({ ...prev, color }));
  }, []);

  const onClickAdd = useCallback(() => {
    setMode("ADD");
  }, []);

  const onClickCloseAdd = useCallback(() => {
    setMode("VIEW");
    setDoc({ ...doc, title: "", description: "" });
  }, []);

  const onPressEnter = useCallback(async () => {
    if (!doc.title.trim()) {
      toast.error("Title cannot be empty!");
      return;
    }
    const newDoc = await createDoc({
      title: doc.title.trim(),
      description: doc.description.trim() || undefined,
      createdAt: new Date().toISOString(),
      id: uuidV4(),
      color: doc.color,
      swaggerDocs: DEFAULT_DOC_ITEM.swaggerDocs,
    });
    if (newDoc) {
      toast.success(`"${newDoc.title}" added successfully!`);
      onClickCloseAdd();
    } else {
      toast.error("Failed to add document.");
    }
  }, [doc, onClickCloseAdd]);

  const onClickDocItem = useCallback((id: string) => {
    router.push(navigationPath.API_문서_리스트_퍼널(id).API_문서_리스트_페이지);
  }, []);

  return {
    mode,
    docsState,
    doc,
    onChangeTitle,
    onChangeDescription,
    onChangeColor,
    onClickAdd,
    onClickCloseAdd,
    onPressEnter,
    onClickDocItem,
  };
};
