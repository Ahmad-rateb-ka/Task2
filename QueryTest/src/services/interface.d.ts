export interface User {
  id: number;
  title: string | undefined;
  body: string | undefined;
}

export interface viewProps {
  Language: string;
}

export interface EditProps {
  IsModelOpen: boolean;
  setIsModelOpen: (open: boolean) => void;
  FormData: User | undefined;
}

export interface AddFuncProps {
  isModeAddOpen: boolean;
  setIsModelAddOpen: (open: boolean) => void;
}
