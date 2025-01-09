import { redirect } from "react-router-dom";

import AuthForm from "../components/AuthForm";

function AuthenticationPage() {
  return <AuthForm />;
}

export default AuthenticationPage;

// AuthForm이 제출될 때마다 트리거될 작업 정의
export async function action({ request }) {
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";

  if (mode !== "login" && mode !== "signup") {
    throw new Response(JSON.stringify({ message: "Unsupported mode." }), {
      status: 422,
    });
  }

  const data = await request.formData();
  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };

  const response = await fetch("http://localhost:8080/" + mode, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  console.log(authData);

  if (response.status === 422 || response.status === 401) {
    return response;
  }

  if (!response.ok) {
    throw new Response(
      JSON.stringify({ message: "Could not authenticatie user." }),
      { status: 500 }
    );
  }
  // 토큰 추출
  const resData = await response.json();
  const token = resData.token;

  // 로컬스토리지에 저장
  localStorage.setItem("token", token);
  // 토큰 만료 날짜 생성
  const expiration = new Date();
  expiration.setHours(expiration.getHours() + 1);
  // 토큰 만료 날짜 로컬스토리지에 저장
  localStorage.setItem("expiration", expiration.toISOString());

  // soon: manage that token
  return redirect("/");
}
