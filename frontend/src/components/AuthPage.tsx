// import { useState } from "react";
import reactIcon from "../assets/react.svg"
import "../styles/AuthPage.css"

function AuthPage(){
    return (
        <>
            <header className="auth-header">
                <a href="localhost:5137">
                    <img src={ reactIcon }></img>
                    <p>GamingForum</p>
                </a>
            </header>
            <div className="auth-form-container">
                <form className="auth-form">
                    <p>Вход в учётную запись</p>
                    <input placeholder="Логин/Email"/>
                    <input placeholder="Пароль"/>
                    <button>Войти</button>
                    <button>Забыли пароль?</button>
                    <button>Регистрация</button>
                </form>
            </div>
        </>
    );
}

export default AuthPage