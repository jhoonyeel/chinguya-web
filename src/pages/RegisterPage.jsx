// src/pages/RegisterPage.jsx  ← 교체
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../shared/auth/AuthContext";

const getErrMessage = (e) =>
  e?.response?.data?.detail || e?.message || "회원가입 실패";

export const RegisterPage = () => {
  const { register, login } = useAuth();
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [nickname, setNickname] = useState("");
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
      await register(email, pw, nickname);
      await login(email, pw);
      nav("/chat", { replace: true });
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
          <h1 className="text-xl font-semibold text-center mb-4">회원가입</h1>
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
              aria-describedby="reg-email-help"
            />
            <p id="reg-email-help" className="mt-1 text-xs text-gray-500">
              이메일 형식이어야 합니다.
            </p>
          </label>

          <label className="block">
            <div className="text-sm mb-1">닉네임</div>
            <input
              className="w-full border rounded p-3"
              type="text"
              autoComplete="nickname"
              placeholder="별명"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
            />
          </label>

          <label className="block">
            <div className="text-sm mb-1">비밀번호</div>
            <input
              className="w-full border rounded p-3"
              type="password"
              autoComplete="new-password"
              placeholder="8자 이상"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              required
              minLength={8}
              onInvalid={onInvalidPw}
              onInput={clearValidity}
              aria-describedby="reg-pw-help"
            />
            <p id="reg-pw-help" className="mt-1 text-xs text-gray-500">
              비밀번호는 8자 이상이어야 합니다.
            </p>
          </label>

          {err && (
            <p className="text-sm text-red-600" role="alert">
              ⚠ {err}
            </p>
          )}

          <div className="space-y-2 pt-1">
            <button
              className="w-full border rounded p-3"
              disabled={pending}
              type="submit"
            >
              {pending ? "처리 중..." : "가입하고 시작하기"}
            </button>
            <div className="text-sm text-center mt-1">
              <Link to="/login" className="underline">
                로그인으로 돌아가기
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
