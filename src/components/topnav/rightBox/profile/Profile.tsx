import * as React from "react";
import classes from "./Profile.module.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../../../store/store";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import Grow from "@mui/material/Grow";
import Paper from "@mui/material/Paper";
import Popper from "@mui/material/Popper";
import MenuItem from "@mui/material/MenuItem";
import MenuList from "@mui/material/MenuList";
import Stack from "@mui/material/Stack";
import {
  faSignOut,
  faUserCircle,
  faExchange,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch } from "react-redux";
import { useWindowSize } from "usehooks-ts";
import { logOut } from "../../../../store/auth.store";
import { useNavigate } from "react-router-dom";

function Profile() {
  const DEFAULT_PROFILE_IMAGE = "/default_profile.png";
  const user = useSelector((state: RootState) => state.authSlice.user);
  const dispatch = useDispatch();
  const { width } = useWindowSize();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef<HTMLButtonElement>(null);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }

    setOpen(false);
  };

  function openSidebarHandler() {
    if (width <= 768) document.body.classList.toggle("sidebar__open");
  }

  function logoutHandler() {
    dispatch(logOut());
    localStorage.clear();
    openSidebarHandler();
    navigate("/login");
  }

  function handleListKeyDown(event: React.KeyboardEvent) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  // return focus to the button when we transitioned from !open -> open
  const prevOpen = React.useRef(open);
  React.useEffect(() => {
    if (prevOpen.current === true && open === false) {
      anchorRef.current!.focus();
    }

    prevOpen.current = open;
  }, [open]);

  return (
    <div className={`${classes.profile}`}>
      <Stack direction='row' spacing={2}>
        <Button
          className='profilephotonametophdr'
          style={{
            color: "#414141",
            fontSize: "16px",
            fontWeight: "600",
            textTransform: "capitalize",
          }}
          ref={anchorRef}
          id='composition-button'
          aria-controls={open ? "composition-menu" : undefined}
          aria-expanded={open ? "true" : undefined}
          aria-haspopup='true'
          onClick={handleToggle}
        >
          <div className={classes.profile__avatar}>
            <img
              src={user?.profileimageurl || DEFAULT_PROFILE_IMAGE}
              alt='avatar'
              onError={(e) => {
                e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
              }}
            />
          </div>
          <div className={`${classes.profile__info} profilename`}>
            <p className={classes.profile__userName}>{user?.firstName}</p>
          </div>
        </Button>
        <Popper
          className='subrata-test'
          open={open}
          anchorEl={anchorRef.current}
          role={undefined}
          placement='bottom-start'
          transition
          disablePortal
          style={{ width: "180px" }}
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              style={{
                zIndex: "89898989",
                transformOrigin:
                  placement === "bottom-start" ? "left top" : "left bottom",
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    className='profilenavlist'
                    autoFocusItem={open}
                    id='composition-menu'
                    aria-labelledby='composition-button'
                    onKeyDown={handleListKeyDown}
                  >
                    <MenuItem
                      onClick={() => {
                        setOpen(false);
                        navigate("/admin/profile");
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faUserCircle}
                        style={{ paddingRight: "10px" }}
                      />
                      My Profile
                    </MenuItem>

                    <MenuItem
                      onClick={() => {
                        setOpen(false);
                        navigate("/admin/changePassword");
                      }}
                    >
                      <FontAwesomeIcon
                        icon={faExchange}
                        style={{ paddingRight: "10px" }}
                      />
                      Change Password
                    </MenuItem>

                    <MenuItem onClick={logoutHandler}>
                      <FontAwesomeIcon
                        icon={faSignOut}
                        style={{ paddingRight: "10px" }}
                      />
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      </Stack>
    </div>
  );
}

export default Profile;
