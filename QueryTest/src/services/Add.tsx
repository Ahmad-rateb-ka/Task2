import { useMutation, useQueryClient } from "@tanstack/react-query";
import { API_URL } from "./global";
import type { AddFuncProps, User } from "./interface.d";
import axios from "axios";
import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button as MUIButton,
} from "@mui/material";

function AddFunc({ isModeAddOpen, setIsModelAddOpen }: AddFuncProps) {
  const queryClient = useQueryClient();

  const [formAdding, setFormAdding] = useState<User | null>(null);

  const AddMutation = useMutation({
    mutationFn: async (US: User) => {
      const NewRow = await axios.post(API_URL, US);
      return NewRow.data;
    },
    onSuccess: () => {
      const confirmedNewUser: User = {
        id: Date.now(),
        title: formAdding?.title,
        body: formAdding?.body,
      };
      queryClient.setQueryData<User[]>(["users"], (oldItems) => {
        return oldItems ? [confirmedNewUser, ...oldItems] : [confirmedNewUser];
      });

      alert("the row is added successfully!");
      setFormAdding(null);
      setIsModelAddOpen(false);
    },
    onError: (e) => {
      alert("حدث خطأ أثناء الإضافة: " + e.message);
    },
  });

  return (
    <>
      <Dialog
        open={isModeAddOpen}
        onClose={() => setIsModelAddOpen(false)}
        disableEnforceFocus
      >
        <DialogTitle>Add user information</DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (formAdding) {
              AddMutation.mutate(formAdding);
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
              id="txt_id"
              label="title"
              variant="outlined"
              fullWidth
              value={formAdding?.title || ""}
              onChange={(e) => {
                setFormAdding((pre) =>
                  pre
                    ? { ...pre, title: e.target.value }
                    : ({ title: e.target.value } as User),
                );
              }}
              required
            />
            <TextField
              label="body"
              variant="outlined"
              fullWidth
              value={formAdding?.body || ""}
              onChange={(e) =>
                setFormAdding((pre) =>
                  pre
                    ? { ...pre, body: e.target.value }
                    : ({ body: e.target.value } as User),
                )
              }
              required
            />
          </DialogContent>
          <DialogActions
            sx={{ justifyContent: "space-between", padding: "1rem" }}
          >
            <MUIButton onClick={() => setIsModelAddOpen(false)} color="inherit">
              cancel
            </MUIButton>
            <MUIButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={AddMutation.isPending}
            >
              {AddMutation.isPending ? "Adding..." : "Add"}
            </MUIButton>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
export default AddFunc;
