// 작업 함수만 있는 라우트 생성
import { redirect } from "react-router-dom";

export function action() {
  localStorage.removeItem("token");
  localStorage.removeItem("expiration"); // 토큰 삭제
  return redirect("/");
}
