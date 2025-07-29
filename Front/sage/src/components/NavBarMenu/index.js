import React from "react";

// Libs
import Link from "next/link";
import Image from "next/image";

// Components
import { ExitApp } from "./ExitApp";

// Context
import { useAuth } from "@/hooks/context";

// Validators
import { getInitials } from "@/validators";

// Styles
import { NavItem, NavMenu, Sidebar, UserProfile } from "./styles";

const NavBarMenu = ({ active }) => {
  const { userData, logout } = useAuth();

  const ActiveMenu = (refActive) => {
    if (active === refActive) {
      return "active";
    } else {
      return "none";
    }
  };

  const getFirstSecondNameSelector = (name) => {
    const nameSplit = name?.split(" ");
    if (nameSplit) {
      if (nameSplit?.length > 1) {
        return `${nameSplit[0]}`;
      }

      return nameSplit[0];
    }

    return "";
  };

  const handleSubmitExitApp = () => {
    logout();
  };
  return (
    <Sidebar>
      <Image src="/Logo.svg" alt="Logo" width={200} height={100} />

      <NavMenu>
        <Link href="/dashboard">
          <NavItem className={ActiveMenu("dashboard")}>
            <Image src="/Dashboard.svg" alt="Logo" width={24} height={24} />{" "}
            <span>Dashboard</span>
          </NavItem>
        </Link>
        <Link href="/profile">
          <NavItem className={ActiveMenu("profile")}>
            <Image src="/User.svg" alt="Logo" width={24} height={24} />{" "}
            <span>Perfil</span>
          </NavItem>
        </Link>
        <Link href="/outlay">
          <NavItem className={ActiveMenu("outlay")}>
            <Image src="/Money.svg" alt="Logo" width={24} height={24} />{" "}
            <span>Despesas</span>
          </NavItem>
        </Link>
        <Link href="/categories">
          <NavItem className={ActiveMenu("categories")}>
            <Image src="/Task.svg" alt="Logo" width={24} height={24} />{" "}
            <span>Categorias</span>
          </NavItem>
        </Link>
      </NavMenu>

      <UserProfile>
        <div className="avatar">{getInitials(userData?.name)}</div>
        <div className="userInfo">
          <strong>{getFirstSecondNameSelector(userData?.name)}</strong>
        </div>
        <ExitApp onSubmit={handleSubmitExitApp}>
          <div className="logoutIcon">
            <Image src="/Exit.svg" alt="Logo" width={24} height={24} />{" "}
          </div>
        </ExitApp>
      </UserProfile>
    </Sidebar>
  );
};

export default NavBarMenu;
