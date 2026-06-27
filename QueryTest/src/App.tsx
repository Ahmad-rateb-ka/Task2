import { AppBar, Button as MUIButton } from "@mui/material";
import {  Routes, Route, Link } from 'react-router-dom';
import { useState } from "react";
import View from "./components/view";
import Sec_Page from "./sec_Page";
import { ErrorProvider } from './ErrorContext';
import MyPage from "./MyPage";

export default function App() {
  const [language, setLanguage] = useState<string>("");

  return (
    <>
    <ErrorProvider>
          {navigator.onLine ? 
          <>
      <AppBar
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent:"space-evenly",
          padding:"20px"
        }}
        variant="outlined"
        >
        <MUIButton
          color="success"
          variant="contained"
          onClick={() => {
            setLanguage("ar");
          }}
          >
          العربية
        </MUIButton>


           <Link to="/" style={{textDecoration:'none'}}>
            <MUIButton color="warning" variant="contained" >came Back</MUIButton>
          </Link>
     
        <Link to="/sec_page" style={{textDecoration:'none'}}>
            <MUIButton color="warning" variant="contained">Move To Sec</MUIButton>
          </Link>

        <MUIButton
          color="primary"
          variant="contained"
          onClick={() => {
            setLanguage("en");
          }}
          >
          English
        </MUIButton>
      </AppBar>
      
         <Routes>
          <Route path="/" element={<View Language={language} />} />
          <Route path="/sec_page" element={<Sec_Page />} />
         </Routes>
         </>
         :
         <MyPage />
        }
          </ErrorProvider>


    </>
  );
}
