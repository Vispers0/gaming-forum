// UnderDevelopment.tsx
import { useNavigate } from "react-router-dom";
import "../styles/UnderDevelopment.css";

import constructionIcon from "../assets/Construction.png";

function UnderDevelopment() {
  const navigate = useNavigate();

  return (
    <div className="under-development-container">
      <div className="development-card">
        <div className="development-icon">
          <img src={constructionIcon} alt="В разработке" />
        </div>
        <h1>Страница в разработке</h1>
        <p>
          Данный раздел находится в стадии активной разработки.
          Скоро здесь появится полезный контент!
        </p>
        {/*<div className="development-progress">*/}
        {/*  <div className="progress-bar">*/}
        {/*    <div className="progress-fill"></div>*/}
        {/*  </div>*/}
        {/*  <span className="progress-text">В процессе создания</span>*/}
        {/*</div>*/}
        <button
          className="back-home-btn"
          onClick={() => navigate('/home')}
        >
          Вернуться на главную
        </button>
      </div>
    </div>
  );
}

export default UnderDevelopment;