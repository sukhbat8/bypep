import React, { useContext } from "react";
import { Routes } from "react-router-dom";
import { Route } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import DefaultLayout from "../layouts/DefaultLayout";
import LoginPage from "../pages/LoginPage";
import MENU_DATA from "../utils/Menu";
import PrivateRoutes from "./PrivateRoutes";

const AppRouter = () => {
  const { authData } = useContext(AuthContext);

  if (authData.loading) {
    return <div>Loading...</div>;
  }

  let allMenus = [];
  const subMenus = MENU_DATA.filter(menu => menu.isSub).map(menu => menu.sub);
  subMenus.forEach(menus => {
    menus.forEach(menu => {
      allMenus.push(menu);
    })
  });
  allMenus = allMenus.concat(MENU_DATA.filter(menu => !menu.isSub));

  
  return (
    <Routes>
      {allMenus.map((route, index) => {
        return (
          <Route
            key={`route_${index}`}
            path={route.path}
            element={
              <DefaultLayout>
                <PrivateRoutes>{route.component}</PrivateRoutes>
              </DefaultLayout>
            }
          />
        );
      })}
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default AppRouter;
