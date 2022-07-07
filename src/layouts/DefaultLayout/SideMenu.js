import { Layout, Menu } from "antd";

import { Link, useLocation } from "react-router-dom";
import MENU_DATA from "../../utils/Menu";

const { Sider } = Layout;
const { SubMenu } = Menu;

export default function SideMenu(props) {
  const location = useLocation();
  const showMenus = MENU_DATA.filter((menu) => menu.showSideMenu);

  // selectedMenu
  const defaultSelectedKey = showMenus[0].name;
  let openedMenu = null;
  let selectedMenu = showMenus.find((item) => item.path === location.pathname);
  if (!selectedMenu) {
    showMenus
      .filter((menu) => menu.isSub)
      .forEach((menu) => {
        selectedMenu = menu.sub.find((submenu) => {
          if (location.pathname.indexOf(submenu.path) > -1) {
            openedMenu = `sub_${menu.id}`;
            return true;
          }
          return false;
        });
      });
  }

  return (
    <Sider width={320} trigger={null} collapsible collapsed={props.collapsed}>
      <div className="logo" />
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[selectedMenu?.name || defaultSelectedKey]}
        defaultOpenKeys={[openedMenu]}
      >
        {showMenus.map((menuItem, index) => {
          if (menuItem.isSub) {
            const subMenus = menuItem.sub.filter(
              (submenu) => submenu.showSideMenu
            );
            return (
              <SubMenu
                key={`sub_${menuItem.id}`}
                icon={menuItem.icon}
                title={menuItem.name}
              >
                {subMenus.map((subMenuItem, subIndex) => {
                  return (
                    <Menu.Item
                      key={`${subMenuItem.name}`}
                      icon={subMenuItem.icon}
                    >
                      <Link to={subMenuItem.path}>{subMenuItem.name}</Link>
                    </Menu.Item>
                  );
                })}
              </SubMenu>
            );
          }
          return null;
        })}
      </Menu>
    </Sider>
  );
}
