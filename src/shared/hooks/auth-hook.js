import { useState, useCallback, useEffect } from "react";
let logoutTimer;
export const useAuth = () => {
  const [token, setToken] = useState(false);
  const [UserId, setisUserId] = useState(false);
  const [tokenexpirationdate, settokenexpirationdate] = useState();

  const login = useCallback((uid, token, expirationDate) => {
    setToken(token);
    setisUserId(uid);
    console.log(new Date(new Date().getTime() + 1000 * 60 * 60));
    const MytokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);
    settokenexpirationdate(MytokenExpirationDate);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        userId: uid,
        token: token,
        expiration: MytokenExpirationDate.toISOString(),
      })
    );
  }, []);
  const logout = useCallback(() => {
    settokenexpirationdate(null);
    setToken(null);
    setisUserId(null);
    localStorage.removeItem("userData");
  }, []);

  useEffect(() => {
    console.log(tokenexpirationdate);
    if (token && tokenexpirationdate) {
      const remainingtime =
        tokenexpirationdate.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingtime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [token, logout, tokenexpirationdate]);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    if (
      storedData &&
      storedData.token &&
      new Date(storedData.expiration) > new Date()
    ) {
      login(
        storedData.userId,
        storedData.token,
        new Date(storedData.expiration)
      );
    }
  }, [login]);
  return { token, login, logout, UserId };
};
