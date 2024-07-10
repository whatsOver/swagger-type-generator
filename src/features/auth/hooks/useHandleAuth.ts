import { useAuthStore } from "@/entities/auth/model/auth-store";
import { ChangeEvent, useState } from "react";

const useHandleAuth = () => {
  const [authorized, setAuthorized] = useState("");

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAuthorized(e.target.value);
  };

  const setAuthToStore = useAuthStore((state) => state.setToken);

  const onSaveAuth = () => {
    setAuthToStore(authorized);
  };

  return { authorized, onChangeAuth: onChange, onSaveAuth };
};

export default useHandleAuth;
