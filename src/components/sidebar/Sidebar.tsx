import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useWindowSize } from "usehooks-ts";
import { useTranslation } from "react-i18next";
import sidebarNav from "../../config/sidebarNav";
import { Icon } from "@iconify/react";
import classes from "./Sidebar.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useDispatch } from "react-redux";

import { logOut } from "../../store/auth.store";

function Sidebar() {
  const { isOpen } = useSelector((state: RootState) => state.sideBarSlice);
  const role = useSelector((state: RootState) => state.authSlice.user?.role);
  const location = useLocation();
  const curPath = location.pathname;

  const [openSubmenu, setOpenSubmenu] = useState(() => {
    return sidebarNav.some(
      (nav) =>
        nav.submenu &&
        nav.submenu.some((subNav) => subNav.link === curPath || curPath.startsWith(subNav.link + "/"))
    );
  });

  const { width } = useWindowSize();
  const { t } = useTranslation();
  const dispatch = useDispatch();

  function openSidebarHandler() {
    if (width <= 768) document.body.classList.toggle("sidebar__open");
  }

  function logoutHandler() {
    dispatch(logOut());
    localStorage.clear();
    openSidebarHandler();
  }

  function toggleSubmenu() {
    setOpenSubmenu((prev) => !prev);
  }

  useEffect(() => {
    const hasActiveSub = sidebarNav.some(
      (nav) =>
        nav.submenu &&
        nav.submenu.some(
          (subNav) => subNav.link === curPath || curPath.startsWith(subNav.link + "/")
        )
    );
    if (hasActiveSub) {
      setOpenSubmenu(true);
    }
  }, [curPath]);

  // Filter sidebar items based on the user's role
  const filteredNav = sidebarNav.filter(
    (nav) => nav.role && nav.role.includes(role || "")
  );

  let activeIndex = filteredNav.findIndex(
    (item) =>
      item.link === curPath ||
      (item.submenu &&
        item.submenu.some(
          (sub) => sub.link === curPath || curPath.startsWith(sub.link + "/")
        ))
  );

  if (activeIndex === -1) {
    const subIndex = filteredNav.findIndex(
      (item) =>
        item.link !== "/admin/dashboard" && curPath.startsWith(item.link)
    );
    activeIndex = subIndex !== -1 ? subIndex : 0;
  }

  return (
    <div
      className={`${classes.sidebar} ${!isOpen && classes.sidebar_close} sidebar-main`}
    >
      <div className='sidebar-logo'>
        <img src='/logo.svg' alt='PipeWyze' />
      </div>

      <div className={`${classes.sidebar__menu} gc-nav-menu`}>
        {filteredNav.map((nav, index) => {
          const hasSubmenu = Array.isArray(nav.submenu) && nav.submenu.length > 0;
          return (
            <div key={`nav-${index}`} style={{ display: "flex", flexDirection: "column", width: "100%" }}>
              {hasSubmenu ? (
                <div
                  className={`${classes.sidebar__menu__item} ${activeIndex === index ? "active" : ""} sidenav-li gc-nav-item`}
                  style={{ cursor: "pointer" }}
                  onClick={toggleSubmenu}
                >
                  <div className={classes.sidebar__menu__item__icon}>
                    <Icon icon={nav.icon} />
                  </div>
                  <div className={classes.sidebar__menu__item__txt} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", paddingRight: "16px" }}>
                    <span>{t(nav.text)}</span>
                    <Icon icon={openSubmenu ? 'lucide:chevron-up' : 'lucide:chevron-down'} style={{ fontSize: "16px" }} />
                  </div>
                </div>
              ) : (
                <Link
                  to={nav.link}
                  className={`${classes.sidebar__menu__item} ${activeIndex === index ? "active" : ""} sidenav-li gc-nav-item`}
                  onClick={openSidebarHandler}
                >
                  <div className={classes.sidebar__menu__item__icon}>
                    <Icon icon={nav.icon} />
                  </div>
                  <div className={classes.sidebar__menu__item__txt}>
                    {t(nav.text)}
                  </div>
                </Link>
              )}
              {hasSubmenu && openSubmenu && (
                <div style={{ paddingLeft: "24px", marginTop: "-5px", display: "flex", flexDirection: "column", width: "100%" }}>
                  {nav.submenu!.map((subNav, subIndex) => (
                    <Link
                      to={subNav.link}
                      key={`subnav-${subIndex}`}
                      className={`${classes.sidebar__menu__item} ${curPath === subNav.link ? "active" : ""} sidenav-li gc-nav-item`}
                      style={{ marginBottom: "1rem", fontSize: "0.95rem" }}
                      onClick={openSidebarHandler}
                    >
                      <div className={classes.sidebar__menu__item__icon} style={{ fontSize: "18px" }}>
                        <Icon icon={subNav.icon} />
                      </div>
                      <div className={classes.sidebar__menu__item__txt}>
                        {t(subNav.text)}
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* <div className={classes.sidebar__menu}>
        {filteredNav.map((nav, index) => {
            const hasSubmenu = Array.isArray(nav.submenu) && nav.submenu.length > 0;
            return (
        <div key={`nav-${index}`} className="sidebarmenuholder">
            <Link
              to={nav.link}
              className={`${classes.sidebar__menu__item} ${activeIndex === index && classes.active} 
              ${hasSubmenu ? classes.hasSubmenu : ""} parentofsubmenu`}
              onClick={nav.submenu ? toggleSubmenu : openSidebarHandler}
            >
              <div className={classes.sidebar__menu__item__icon}>
                <Icon icon={nav.icon} />
              </div>
              <div className={classes.sidebar__menu__item__txt}>
                {t(nav.text)}
              </div>
            </Link>
            {nav.submenu && openSubmenu && (
              <div className="sidebar_submenu">
                {nav.submenu.map((subNav, subIndex) => (
                  <Link
                    to={subNav.link}
                    key={`subnav-${subIndex}`}
                    className="sidebar__submenu__item"
                  >
                    <div className={classes.sidebar__submenu__item__icon}>
                      <Icon icon={subNav.icon} />
                    </div>
                    <div className={classes.sidebar__submenu__item__txt}>
                      {t(subNav.text)}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
           );
})}
      </div> */}

      <div className={[classes.sidebar__menu, classes.logout].join("")}>
        <Link
          to='/login'
          className={classes.sidebar__menu__item}
          onClick={logoutHandler}
        >
          <div className={classes.sidebar__menu__item__icon}>
            <Icon icon='tabler:logout' />
          </div>
          <div className={classes.sidebar__menu__item__txt}>{t("logout")}</div>
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;
