import React, { useState, useEffect } from 'react';
import iClose from './../../images/close.svg'
import './modal.css'


const Modal = ({ show, close, handleStartNewGame, timer }) => {
  const [spendedTime, setSpendedTime] = useState("");

  const gameTime = (time) => {
    let seconds = Math.floor((time / 1000) % 60);
    let minutes = Math.floor((time / (1000 * 60)) % 60);
  
    if (minutes === 0) {
      return `${seconds} с`
    } else {
      return `${minutes} мин ${seconds}с`
    }
  }

  useEffect(() => {
    const spendedTime = gameTime(timer);

    setSpendedTime(spendedTime);
  }, [timer]);

  return (
    <>
      {show ? (
        <aside className="modalContainer">
          <div 
          className="background"
          onClick={() => close()}
          >
          </div>
          <div className="modal">
            <header className="modal_header">
              <h2 className="modal_header-title"> Поздравляем! </h2>

              <button className="close" onClick={() => close()}>
                <img src={iClose} alt="close" />
              </button>
            </header>

            <main className="modal_content">
              <p>Вы решили все анаграммы</p>
              <p>Вы потратили: <span className="time">{spendedTime}</span></p>
            </main>

            <footer className="modal_footer">
              <button className={`btn submit`} onClick={() => handleStartNewGame()}>Новая игра</button>
              
              <button className={`btn modal-close`} onClick={() => close()}>
                Закрыть
              </button>   
            </footer>
          </div>
        </aside>
      ) :  null
     }
    </>
  );
};

export default Modal;
