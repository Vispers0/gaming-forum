import { useKeycloak } from "@react-keycloak-fork/web";

import logo from "../assets/chat.png"
import "../styles/Home.css"

import Menu_full from "./Menu_full";
import Post from "./Post"

function Home(){
    const { keycloak } = useKeycloak();

    const handleLogin = () => {
        keycloak.login();
    };

    const handleLogout = () => {
        keycloak.logout();
    };

    return (
        <>
            <header className="base-header">
                <a href="localhost:5137">
                    <img src={ logo }></img>
                    <p>Chat&Play</p>
                </a>
                <input className="search-bar" placeholder="Поиск"/>
                <div id="auth-container">
                    <p id="username">
                        { keycloak.authenticated ? keycloak.tokenParsed?.preferred_username || keycloak.tokenParsed?.email || "Пользователь" : "Гость" }
                    </p>
                    { !keycloak.authenticated ? (
                        <button onClick={handleLogin}>Вход</button>
                    ) : (
                        <button onClick={handleLogout}>Выход</button>
                    )}
                </div>
            </header>
            <div className="main-container">
                <Menu_full />
                <div className="temp-container">
                    <Post />
                    <Post />
                    <Post />
                </div>
            </div>
        </>
    );
}

export default Home