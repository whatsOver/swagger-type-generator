/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

const useRouter = () => {
  const navigate = useNavigate();
  return useMemo(() => {
    return {
      back(steps = 1) {
        navigate(-steps);
      },
      push(path: RoutePath, state?: any) {
        navigate(
          {
            pathname: path,
          },
          {
            state,
          }
        );
      },
    };
  }, [navigate]);
};

export default useRouter;

export type RoutePath = "/request" | "/";
