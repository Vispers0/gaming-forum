// Layout.tsx
import { useKeycloak } from "@react-keycloak-fork/web";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../assets/chat.png"
import "../styles/Home.css"

import Menu_full from "./Menu_full";
import { Outlet } from "react-router-dom";

function Layout(){
    const { keycloak } = useKeycloak();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleLogin = () => {
        keycloak.login();
    };

    const handleLogout = () => {
        keycloak.logout();
    };

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value;
        setSearchQuery(query);

        // Перенаправляем на главную страницу с поисковым запросом
        if (query.trim()) {
            navigate(`/home?search=${encodeURIComponent(query)}`);
        } else {
            navigate('/home');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            // Поиск уже обрабатывается в handleSearch
            console.log('Search submitted:', searchQuery);
        }
    };

    return (
        <>
            <header className="base-header">
                <a href="/home">
                    <img src={logo} alt="Logo" />
                    <p>Chat&Play</p>
                </a>
                <input
                    className="search-bar"
                    placeholder="Поиск по постам..."
                    value={searchQuery}
                    onChange={handleSearch}
                    onKeyPress={handleKeyPress}
                />
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
                <Menu_full isAuthenticated={keycloak.authenticated || false} />
                <div className="content-container">
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default Layout;