import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { API_URL } from "./global";
import type { User } from "./interface.d";
import { useQueryClient } from "@tanstack/react-query";


export function useDeleteUser()
{
  const queryclient=useQueryClient();

 const DeleteMutation = useMutation({
  mutationFn: async (US: User) => {
    await axios.delete(`${API_URL}/${US.id}`);
    return US;
  },
  onSuccess: (deletedUser: User) => {
    queryclient.setQueryData<User[]>(["users"], (oldData) => {
      if (!oldData) {
        return [];
      }
      return oldData.filter((user) => user.id !== deletedUser.id);
    });
    alert("the is deleted Successfully ");
    queryclient.invalidateQueries({ queryKey: ["users"] });
  },
  onError: (e) => {
    alert(e.message);
  },
});

return{
  deleteUser:DeleteMutation.mutate,
  isDeleting:DeleteMutation.isPending,
}
}
