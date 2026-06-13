import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { EditProps, User } from "./interface.d";
import axios from "axios";
import { API_URL } from "./global";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button as MUIButton,
} from "@mui/material";
import { useEffect, useState } from "react";

function EditFun({ IsModelOpen, setIsModelOpen, FormData }: EditProps) {
  const [formData, setFormData] = useState<User | null>(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (FormData) {
      setFormData(FormData);
    }
  }, [FormData, IsModelOpen]);

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

  return (
    <>
      <Dialog
        open={IsModelOpen}
        onClose={() => setIsModelOpen(false)}
        disableEnforceFocus
      >
        <DialogTitle>Edit user information</DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (formData) {
              EditMUtation.mutate(formData);
            }
          }}
        >
          <DialogContent
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "1.5rem",
              minWidth: "300px",
            }}
          >
            <TextField
              label="title"
              variant="outlined"
              fullWidth
              value={formData?.title || ""}
              onChange={(e) =>
                setFormData((pre) =>
                  pre ? { ...pre, title: e.target.value } : null,
                )
              }
              required
            />
            <TextField
              label="body"
              variant="outlined"
              fullWidth
              value={formData?.body || ""}
              onChange={(e) =>
                setFormData((pre) =>
                  pre ? { ...pre, body: e.target.value } : null,
                )
              }
              required
            />
          </DialogContent>
          <DialogActions
            sx={{ justifyContent: "space-between", padding: "1rem" }}
          >
            <MUIButton onClick={() => setIsModelOpen(false)} color="inherit">
              cancel
            </MUIButton>
            <MUIButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={EditMUtation.isPending}
            >
              {EditMUtation.isPending ? "Editing..." : "Edit"}
            </MUIButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
export default EditFun;
