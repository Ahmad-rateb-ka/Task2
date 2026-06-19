import { createContext, useState, useContext, type ReactNode } from "react";

interface ErrorContextType {
  error: string | null;
  showError: (message: string) => void;
  clearError: () => void;
}

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

// 3. تعريف نوع الـ Props للـ Provider لتقبل المكونات الأبناء
interface ErrorProviderProps {
  children: ReactNode;
}

export const ErrorProvider = ({ children }: ErrorProviderProps) => {
  const [error, setError] = useState<string | null>(null);

  const showError = (message: string) => setError(message);
  const clearError = () => setError(null);

  return (
    <ErrorContext.Provider value={{ error, showError, clearError }}>
      {error && (
        <div
          style={{
            background: "red",
            color: "white",
            padding: "10px",
            position: "fixed",
            top: 0,
            width: "100%",
            zIndex: 9999,
          }}
        >
          🚨 خطأ مركزي: {error}
          <button onClick={clearError} style={{ marginLeft: "20px" }}>
            إغلاق
          </button>
        </div>
      )}
      {children}
    </ErrorContext.Provider>
  );
};

export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error("useError must be used within an ErrorProvider");
  }
  return context;
};
