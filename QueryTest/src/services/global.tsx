
import { useState } from "react";

export const API_URL = "https://jsonplaceholder.typicode.com/posts";

export function useTableStates(){
     "use no memo";
const [isModeAddOpen, setIsModelAddOpen] = useState(false);

const [isModelOpen, setIsModelOpen] = useState(false);
return{

    isModeAddOpen,
    setIsModelAddOpen,

    isModelOpen,
    setIsModelOpen,
};
};

