import { useError } from './errorContext'; 

function MyPage() {
  const { showError } = useError();

  const handleLogin = async () => {
    try {
      throw new Error("كلمة المرور التي أدخلتها غير صحيحة!");
    } catch (error: any) {
      showError(error.message || "حدث خطأ غير متوقع");
    }
  };

  return (
    <div onLoad={handleLogin}></div>
  );
}

export default MyPage;