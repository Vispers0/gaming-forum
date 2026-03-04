import logo from "../assets/chat.png"
import "../styles/Home.css"

function Home(){
    return (
        <>
            <header className="base-header">
                <a href="localhost:5137">
                    <img src={ logo }></img>
                    <p>Chat&Play</p>
                </a>
                <input className="search-bar" placeholder="Поиск"/>
                <div id="auth-container">
                    <p id="username">Гость</p>
                    <button>
                        Вход
                    </button>
                </div>
            </header>
        </>
    );
}

export default Home