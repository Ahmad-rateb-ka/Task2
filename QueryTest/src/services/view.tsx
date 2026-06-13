import {
  Container,
  IconButton,
  Tooltip,
  Button as MUIButton,
} from "@mui/material";
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
import { API_URL } from "./global";
import type { User, viewProps } from "./interface.d";
import { useTableStates } from "./global";
import { useDeleteUser } from "./Delete";
import AddFunc from "./Add";
import EditFun from "./Edit";
import type {} from "./interface.d";

function View(Language: viewProps) {
  const [formData, setFormData] = useState<User>();
  const FetchData = async () => {
    const response = await axios.get(API_URL);
    return response.data;
  };

  const { isModelOpen, isModeAddOpen, setIsModelAddOpen, setIsModelOpen } =
    useTableStates();

  const { deleteUser, isDeleting } = useDeleteUser();

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

      <AddFunc
        isModeAddOpen={isModeAddOpen}
        setIsModelAddOpen={setIsModelAddOpen}
      />

      <EditFun
        IsModelOpen={isModelOpen}
        setIsModelOpen={setIsModelOpen}
        FormData={formData}
      />
    </>
  );
}

export default View;
