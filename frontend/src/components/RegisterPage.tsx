import "../styles/AuthPage.css"
import logo from "../assets/chat.png"

function RegisterPage(){
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
                    <p>Создание аккаунта</p>
                    <input placeholder="Логин"/>
                    <input placeholder="Email"/>
                    <input placeholder="Пароль"/>
                    <input placeholder="Повторите пароль"/>
                    <input placeholder="Проверочный код"/>
                    <button>Отправить проверочный код</button>
                    <button>Создать аккаунт</button>
                </form>
            </div>
        </>
    );
}

export default RegisterPage