import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store";
import { validateToken } from "../store/slices/authSlice";
import { fetchCredits } from "../store/slices/creditsSlice";

export const useAuth = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state: RootState) => state.auth);
  const credits = useSelector((state: RootState) => state.credits);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token && !auth.isAuthenticated && !auth.loading) {
      dispatch(validateToken() as any);
    }
  }, [dispatch, auth.isAuthenticated, auth.loading]);

  useEffect(() => {
    if (auth.isAuthenticated && !credits.loading) {
      dispatch(fetchCredits() as any);
    }
  }, [dispatch, auth.isAuthenticated]);

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    loading: auth.loading,
    error: auth.error,
    credits: credits.remaining,
    creditsLoading: credits.loading,
  };
};
