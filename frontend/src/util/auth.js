import { redirect } from "react-router-dom";

export function getTokenDuration() {
  const storedExpirationDate = localStorage.getItem("expiration");
  const expirationDate = new Date(storedExpirationDate); // Date 객체로 변환
  const now = new Date();
  const duration = expirationDate.getTime() - now.getTime(); // 두 날짜의 차이가 음수이면 유효기간 만료
  return duration;
}

export function getAuthToken() {
  const token = localStorage.getItem("token");

  const tokenDuration = getTokenDuration();

  if (!token) {
    return null;
  }

  if (tokenDuration < 0) {
    return "EXPIRED";
  }

  return token;
}

// 토큰 정보 얻는 함수를 loader()로 감싸기
export function loader() {
  return getAuthToken();
}

export function checkAuthLoader() {
  const token = getAuthToken();

  if (!token) {
    return redirect("/auth");
  }

  return null;
}
