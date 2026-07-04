import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { EditProps, User } from "./interface.d";
import { AddService, DeleteService } from "./PostServices";
import { API_URL, useTableStates } from "./global";
import axios from "axios";

export const UserAdded = () => {
  const queryClient = useQueryClient();

  const { setIsModelAddOpen } = useTableStates();

  const AddMutation = useMutation({
    mutationFn: AddService.add,
    onSuccess: (data, variables) => {
      const confirmedNewUser: User = {
        id: data?.id ?? Date.now(),
        title: data?.title ?? variables.title,
        body: data?.body ?? variables.body,
      };

      queryClient.setQueryData<User[]>(["users"], (oldItems = []) => {
        return [
          confirmedNewUser,
          ...oldItems.filter((item) => item.id !== confirmedNewUser.id),
        ];
      });

      alert("the row is added successfully!");
      setIsModelAddOpen(false);
    },
    onError: (e) => {
      alert("حدث خطأ أثناء الإضافة: " + e.message);
    },
  });

  return {
    addUser: AddMutation.mutate,
    isAdding: AddMutation.isPending,
    isSuccess: AddMutation.isSuccess,
  };
};

export const UserEdited = ({
  setIsModelOpen,
}: EditProps) => {
 

  const queryClient = useQueryClient();



  const EditMUtation = useMutation({
    mutationFn: async (US: User) => {
      const response = await axios.put(`${API_URL}/${US.id}`, US);
      return response.data;
    },
    onSuccess: (data: User) => {
      setIsModelOpen(false);
      alert("the data is edited successfully");
      queryClient.setQueryData<User[]>(["users"], (oldData) => {
        if (!oldData) return [];
        return oldData.map((user) => (user.id === data.id ? data : user));
      });
    },
    onError: (e) => {
      alert(e.message);
    },
  });
  return {
    editpro: EditMUtation.mutate,
    editSucess: EditMUtation.isSuccess,
    editpanding: EditMUtation.isPending,
  };
};

export const useDeleteUser = () => {
  const queryclient = useQueryClient();

  const DeleteMutation = useMutation({
    mutationFn: DeleteService.delete,
    onSuccess: (deletedUser: User) => {
      queryclient.setQueryData<User[]>(["users"], (oldData) => {
        if (!oldData) {
          return [];
        }
        return oldData.filter((user) => user.id !== deletedUser.id);
      });
      alert("the is deleted Successfully ");
      queryclient.setQueryData<User[]>(["users"], (oldData = []) => {
        return oldData.filter((user) => user.id !== deletedUser.id);
      });
    },
    onError: (e) => {
      alert(e.message);
    },
  });

  return {
    deleteUser: DeleteMutation.mutate,
    isDeleting: DeleteMutation.isPending,
  };
};
