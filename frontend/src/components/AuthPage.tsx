import { Link } from "react-router-dom"
import logo from "../assets/chat.png"
import "../styles/AuthPage.css"

function AuthPage(){
    return (
        <>
            <header className="auth-header">
                <a href="localhost:5137">
                    <img src={ logo }></img>
                    <p>Chat&Play</p>
                </a>
            </header>
            <div className="auth-form-container">
                <form className="auth-form">
                    <p>Вход в учётную запись</p>
                    <input placeholder="Логин/Email"/>
                    <input placeholder="Пароль"/>
                    <button>Войти</button>
                    <button>Забыли пароль?</button>
                    <Link to="/register">
                        <button>Регистрация</button>
                    </Link>
                </form>
            </div>
        </>
    );
}

export default AuthPage