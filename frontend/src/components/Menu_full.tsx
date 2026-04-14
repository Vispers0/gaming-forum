import { NavLink } from "react-router-dom";
import "../styles/Menu.css"

import home from "../assets/House_01.svg";
import profile from "../assets/User_03.svg";
import friends from "../assets/Users.svg";
import messages from "../assets/Chat_Circle.svg";
import groups from "../assets/Users_Group.svg";
import games from "../assets/Xbox_notFound.svg";
import guides from "../assets/Chat_Check.svg";
import teammates from "../assets/Handshake - 48px.svg";
import arrow from "../assets/Chevron_Left.svg";
import add from "../assets/add.svg";
import { useState } from "react";

interface MenuProps{
  isAuthenticated: boolean;
}

function Menu_full({ isAuthenticated }: MenuProps){
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleMenu = () => {
    setIsCollapsed(!isCollapsed);
  }

  const menuItems = [
    { to: "/home", icon: home, label: "Главная"},
    { to: "/profile", icon: profile, label: "Мой профиль"},
    { to: "/friends", icon: friends, label: "Друзья"},
    { to: "/messages", icon: messages, label: "Сообщения"},
    { to: "/groups", icon: groups, label: "Сообщества"},
    { to: "/games", icon: games, label: "Игры"},
    { to: "/guides", icon: guides, label: "Руководства"},
    { to: "/teammates", icon: teammates, label: "Поиск напарника"},
  ];

  const createPostOption = { to: "/post", icon: add , label: "Создать пост"}

  return(
    <>
      <div className="menu-container">
        <nav className={isCollapsed ? "collapsed" : ""}>
          <ul>
            {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink className="menu-link" to={item.to}>
                <img className="menu-icon" src={item.icon} alt={item.label}/>
                <span className="menu-label">{item.label}</span>
              </NavLink>
            </li>
            ))}
            {isAuthenticated && (
              <li key={createPostOption.to}>
                <NavLink className="menu-link" to={createPostOption.to}>
                  <img className="menu-icon" src={createPostOption.icon} alt={createPostOption.label}/>
                  <span className="menu-label">{createPostOption.label}</span>
                </NavLink>
              </li>
            )}
          </ul>
          <button className={isCollapsed ? "collapsed" : ""} onClick={toggleMenu}>
            <img className={"menu-icon"} src = { arrow } alt="Свернуть / Развернуть меню"/>
            <span className="menu-label">Свернуть меню</span>
          </button>
        </nav>
      </div>
    </>
  );
}

export default Menu_full;