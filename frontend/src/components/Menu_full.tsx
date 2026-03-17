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

function Menu_full(){
  return(
    <>
      <div className="menu-container">
        <nav>
        <ul>
            <li>
              <NavLink className="menu-link" to="/home">
                <img className= "menu-icon" src={ home }/>
                <span>Главная</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="menu-link" to="/profile">
                <img className="menu-icon" src = { profile }/>
                <span>Мой профиль</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="menu-link" to="/friends">
                <img className="menu-icon" src = { friends }/>
                <span>Друзья</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="menu-link" to="/messages">
                <img className="menu-icon" src = { messages }/>
                <span>Сообщения</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="menu-link" to="/groups">
                <img className="menu-icon" src = { groups }/>
                <span>Сообщества</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="menu-link" to="/games">
                <img className="menu-icon" src = { games }/>
                <span>Игры</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="menu-link" to="/guides">
                <img className="menu-icon" src = { guides }/>
                <span>Руководства</span>
              </NavLink>
            </li>
            <li>
              <NavLink className="menu-link" to="/teammates">
                <img className="menu-icon" src = { teammates }/>
                <span>Поиск напарников</span>
              </NavLink>
            </li>
          </ul>
          <button>
            <img className="menu-icon" src = { arrow }/>
            <span>Свернуть меню</span>
          </button>
        </nav>
      </div>
    </>
  );
}

export default Menu_full;