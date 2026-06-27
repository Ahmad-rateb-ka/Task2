import axios from "axios";
import type { User } from "./interface";
import { API_URL } from "./global";



export const AddService={
    add:async (user:User): Promise<User> =>
    {
        const response=await axios.post(API_URL,user);
        return response.data;
    }
};

export const DeleteService={
    delete:async (US:User): Promise<User> =>
    {
        await axios.delete(`${API_URL}/${US.id}`);
        return US;
    }
};

export const EditService={
    Edit:async (user:User):Promise<User>=>{
        const response =await axios.put(`${API_URL}/${user.id}`, user)
        return response.data;
    }
};


