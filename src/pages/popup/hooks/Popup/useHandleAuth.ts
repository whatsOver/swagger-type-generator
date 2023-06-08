import { ChangeEvent } from "react";
import { useState } from "react";
import useAuthStore from "../../store/auth";

const useHandleAuth = () => {
  const [authorized, setAuthorized] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAuthorized(e.target.value);
  };

  const setAuthToStore = useAuthStore((state) => state.setToken);

  const onSaveAuth = () => {
    chrome.storage.sync.set({ authorized });
    setAuthToStore(authorized);
  };

  return { authorized, onChangeAuth: onChange, onSaveAuth };
};

export default useHandleAuth;
