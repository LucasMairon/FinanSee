import React from "react";

// Libs
import Link from "next/link";
import Image from "next/image";

// Styles
import { NavItem, NavMenu, SearchInput, Sidebar, UserProfile } from "./styles";

const NavBarMenu = ({ active }) => {
  const ActiveMenu = (refActive) => {
    if (active === refActive) {
      return "active";
    } else {
      return "none";
    }
  };
  return (
    <Sidebar>
      <Image src="/Logo.svg" alt="Logo" width={200} height={100} />
      <SearchInput placeholder="Procurar..." />

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
        <Link href="/relatorio">
          <NavItem className={ActiveMenu("relatorio")}>
            <Image src="/Analytics.svg" alt="Logo" width={24} height={24} />{" "}
            <span>Relatório</span>
          </NavItem>
        </Link>
      </NavMenu>

      <UserProfile>
        <div className="avatar">JM</div>
        <div className="userInfo">
          <strong>José Maria</strong>
        </div>
        <div className="logoutIcon">
          <Image src="/Exit.svg" alt="Logo" width={24} height={24} />{" "}
        </div>
      </UserProfile>
    </Sidebar>
  );
};

export default NavBarMenu;
