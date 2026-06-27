import { Container, IconButton, Tooltip, Button as MUIButton, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { API_URL } from "../services/global";
import type { User, viewProps } from "../services/interface";
import { useTableStates } from "../services/global";
import { UserAdded, useDeleteUser,UserEdited} from "../services/userRepo";


function View(Language: viewProps) {
  const [formData, setFormData] = useState<User | null>(null);
  const [formAdding, setFormAdding] = useState<User | null>(null);
  const { addUser, isAdding } = UserAdded();

  const { isModelOpen, isModeAddOpen, setIsModelAddOpen, setIsModelOpen } =
    useTableStates();
  const { deleteUser, isDeleting } = useDeleteUser();
  const { editpro, editpanding } = UserEdited({
    IsModelOpen: isModelOpen,
    setIsModelOpen,
    FormData: formData ?? undefined,
  });

  const FetchData = async () => {
    const response = await axios.get(API_URL);
    return response.data;
  };

  const {
    data: users = [],
    isLoading,
    isError,
    error,
  } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: FetchData,
  });

  if (isError) {
    return (
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        حدث خطأ أثناء جلب البيانات:{" "}
        {error instanceof Error ? error.message : "خطأ غير معروف"}
      </Container>
    );
  }
  const { t, i18n } = useTranslation();

  useEffect(() => {
    document.body.dir = i18n.language === "ar" ? "rtl" : "ltr";
    document.body.lang = i18n.language;
    i18n.changeLanguage(Language.Language);

    localStorage.setItem("LANG", Language.Language);
  }, [i18n.language, Language]);

  const columns = useMemo<MRT_ColumnDef<User>[]>(
    () => [
      {
        accessorKey: "id",
        header: t("id"),
        size: 80,
      },
      {
        accessorKey: "title",
        header: t("title"),
        size: 80,
      },
      {
        accessorKey: "body",
        header: t("body"),
        size: 80,
      },
    ],
    [i18n.language, t],
  );

  const table = useMaterialReactTable({
    columns,
    data: users,
    state: {
      isLoading: isLoading,
    },
    // تنسيق الحاوية الخارجية المحيطة بالجدول (الورقة الخلفية)
    muiTablePaperProps: {
      elevation: 3, // إضافة تأثير الظل البرمجي
      sx: {
        borderRadius: "5px", // تدوير حواف الجدول
        border: "1px solid #e0e0e0", // إضافة إطار خارجي
        overflow: "hidden",
        mt: "100px",
      },
    },

    // تنسيق خلايا سطر الترويسة (Header) العلوي
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: "#f5f5f5",
        color: "#1a1a1a", 
        fontWeight: "bold", 
        fontSize: "15px", 
        borderBottom: "2px solid #ccc",   
      },
    },

    // تنسيق خلايا محتوى الجدول (Body Cells) بشكل عام
    muiTableBodyCellProps: {
      sx: {
        fontSize: "14px",
        padding: "12px 16px",// المسافات الداخلية للخلايا
        textAlign:Language.Language ==="ar"?"right":"left",
         
      },
      
    },
    
    enableRowActions: true,
    positionActionsColumn: "last",
    renderRowActions: ({ row }) => (
      <>
        <Tooltip title="edit">
          <IconButton
            color="primary"
            onClick={() => {
              setFormData(row.original);
              setIsModelOpen(true);
            }}
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="delete">
          <IconButton
            color="error"
            disabled={isDeleting}
            onClick={() => {
              if (confirm("Are You Sure?")) {
                deleteUser(row.original);
              }
            }}
          >
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      </>
    ),
    renderTopToolbarCustomActions: () => {
      return (
        <>
          <MUIButton
            color="success"
            variant="contained"
            onClick={() => {
              setIsModelAddOpen(true);
              console.log(isModeAddOpen);
            }}
          >
            <AddIcon />
            &nbsp; Add New Row
          </MUIButton>
        </>
      );
    },
  });

  return (
    <>
      <MaterialReactTable table={table} />


{/* start adding dialog */}
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
              addUser(formAdding);
              setFormAdding(null);
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
              disabled={isAdding}
              >
              {isAdding ? "Adding..." : "Add"}
            </MUIButton>
          </DialogActions>
        </form>
      </Dialog>

        {/* End adding dialog */}

        {/*  start editing dialog */}

      <Dialog
        open={isModelOpen}
        onClose={() => {
          setIsModelOpen(false);
          setFormData(null);
        }}
        disableEnforceFocus
        >
        <DialogTitle>Edit user information</DialogTitle>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (formData) {
              editpro(formData);
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
            <MUIButton
              onClick={() => {
                setIsModelOpen(false);
                setFormData(null);
              }}
              color="inherit"
            >
              cancel
            </MUIButton>
            <MUIButton
              type="submit"
              variant="contained"
              color="primary"
              disabled={editpanding}
            >
              {editpanding ? "Editing..." : "Edit"}
            </MUIButton>
          </DialogActions>
        </form>
      </Dialog>
         {/* end editing dialog  */}

    </>
  );
}

export default View;
