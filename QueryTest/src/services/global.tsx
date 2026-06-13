
import { useState } from "react";
import type { User } from "./interface.d";

export const API_URL = "https://jsonplaceholder.typicode.com/posts";





export function useTableStates(){
const [isModeAddOpen, setIsModelAddOpen] = useState(false);

const [isModelOpen, setIsModelOpen] = useState(false);
return{

    isModeAddOpen,
    setIsModelAddOpen,

    isModelOpen,
    setIsModelOpen,
};
};

