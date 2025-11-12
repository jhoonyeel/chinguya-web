// src/pages/LoginPage.jsx  ← 교체
import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../shared/auth/AuthContext";
import { checkupStore } from "../shared/lib/checkup";

const getErrMessage = (e) =>
  e?.response?.data?.detail || e?.message || "로그인 실패";

export const LoginPage = () => {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [pending, setPending] = useState(false);
  const [err, setErr] = useState("");

  const onInvalidEmail = (e) =>
    e.target.setCustomValidity("올바른 이메일 형식을 입력해 주세요.");
  const onInvalidPw = (e) => {
    if (e.target.validity.valueMissing)
      e.target.setCustomValidity("비밀번호를 입력해 주세요.");
    else if (e.target.validity.tooShort)
      e.target.setCustomValidity("비밀번호는 8자 이상이어야 합니다.");
  };
  const clearValidity = (e) => e.target.setCustomValidity("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    setErr("");
    try {
      const me = await login(email, pw);
      const need = checkupStore.needsCheckup(me.id, 14);
      if (need) nav("/checkup", { replace: true });
      else nav(loc.state?.from?.pathname || "/chat", { replace: true });
    } catch (e) {
      setErr(getErrMessage(e));
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="w-full min-h-[100dvh] bg-gray-50 flex items-center justify-center">
      <div className="w-[300px]">
        <form
          className="p-4 space-y-3 bg-white border rounded-xl shadow-sm"
          onSubmit={onSubmit}
          noValidate
        >
          <h1 className="text-xl font-semibold text-center">로그인</h1>
          <label className="block">
            <div className="text-sm mb-1">이메일</div>
            <input
              className="w-full border rounded p-3"
              type="email"
              inputMode="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              onInvalid={onInvalidEmail}
              onInput={clearValidity}
              aria-describedby="login-email-help"
            />
            <p id="login-email-help" className="mt-1 text-xs text-gray-500">
              이메일 형식이어야 합니다.
            </p>
          </label>

          <label className="block">
            <div className="text-sm mb-1">비밀번호</div>
            <input
              className="w-full border rounded p-3"
              type="password"
              autoComplete="current-password"
              placeholder="8자 이상"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
              minLength={8}
              onInvalid={onInvalidPw}
              onInput={clearValidity}
              aria-describedby="login-pw-help"
            />
            <p id="login-pw-help" className="mt-1 text-xs text-gray-500">
              비밀번호는 8자 이상이어야 합니다.
            </p>
          </label>

          {err && (
            <p className="text-sm text-red-600" role="alert">
              ⚠ {err}
            </p>
          )}

          <button className="w-full border rounded p-3" disabled={pending}>
            {pending ? "처리 중..." : "로그인"}
          </button>

          <div className="text-sm text-center mt-1">
            계정이 없나요?{" "}
            <Link to="/register" className="underline">
              회원가입
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};
