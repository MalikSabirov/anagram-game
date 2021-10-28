import React, { useState, useEffect, useCallback } from "react";
import "./App.css";
import refresh from "./images/ei_refresh.svg";
import Modal from "./components/modal/modal";

const SingleInput = ({
  id,
  shuffledWord,
  isWordGuessed,
  handleInputChange,
  isErrorsVisible,
}) => {
  const [val, setVal] = useState("");
  const [charArray, setCharArray] = useState([]);

  useEffect(() => {
    const tempArr = shuffledWord.split("").map((char) => ({
      value: char,
      isGuessed: false,
    }));

    setCharArray(tempArr);
  }, [shuffledWord]);

  const onInputChange = (value) => {
    setVal(value);

    const tempArr = charArray.map((word) => ({
      ...word,
      isGuessed: false,
    }));

    const splittedVal = value.split("");

    for (let i = 0; i < splittedVal.length; i++) {
      const currVal = splittedVal[i];

      for (let j = 0; j < tempArr.length; j++) {
        const currChar = tempArr[j];

        if (currChar.value === currVal && currChar.isGuessed === false) {
          tempArr[j].isGuessed = true;
          break;
        }
      }
    }

    setCharArray(tempArr);

    handleInputChange(id, value);
  };

  return (
    <>
      <label>
        {charArray.map((item, index) => (
          <span key={index} className={item.isGuessed ? "char--guessed" : ""}>
            {item.value}
          </span>
        ))}
      </label>

      <input
        maxLength={shuffledWord.length}
        className={`input ${
          isErrorsVisible && !isWordGuessed ? "input--error" : ""
        }`}
        type="text"
        value={val}
        onChange={(e) => onInputChange(e.target.value)}
      />
    </>
  );
};

const fetchSingleWord = async () => {
  const response = await fetch(
    "https://cors-anywhere.herokuapp.com/http://watchout4snakes.com/Random/RandomWord",
    {
      method: "POST",
    }
  );

  return response.text();
};

const fetchNewWords = async () => {
  const words = [];

  for (let i = 0; i < 5; i++) {
    const word = await fetchSingleWord();
    words.push(word);
  }

  return words;
};

const shuffleLetters = (str) => {
  let arr = str.split("");

  for (let i = str.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }

  return arr.join("");
};

const App = () => {
  const [words, setWords] = useState([]);
  const [isErrorsVisible, setIsErrorsVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalName, setIntervalName] = useState(null);

  useEffect(() => {
    startGame();
  }, []);

  const showSuccesModal = () => {
    setIsModalVisible(true);
  };

  const hideSuccessModal = () => {
    setIsModalVisible(false);
  };

  const startGame = async () => {
    const initialWords = await fetchNewWords();

    const words = initialWords.map((word, index) => {
      return {
        id: index,
        value: word.toLowerCase(),
        shuffledValue: shuffleLetters(word.toLowerCase()),
        isGuessed: false,
      };
    });

    setWords(words);

    let timer = 0;

    setTimer(timer);

    const intervalName = setInterval(() => {
      setTimer(++timer);
    }, 1000);

    setIntervalName(intervalName);
  };

  const startNewGame = () => {
    clearInterval(intervalName);

    startGame();
  };

  const handleInputChange = (wordId, inputValue) => {
    const updatedWords = words.map((word) => {
      if (word.id === wordId) {
        return {
          ...word,
          isGuessed: word.value === inputValue,
        };
      } else {
        return word;
      }
    });

    setWords(updatedWords);
  };

  const checkCorrectness = () => {
    const isAllWordsGuessed = words.every((word) => word.isGuessed === true);

    if (isAllWordsGuessed) {
      clearInterval(intervalName);

      setIsErrorsVisible(false);

      showSuccesModal();
    } else {
      setIsErrorsVisible(true);
    }
  };

  const escFunction = useCallback((event) => {
    if(event.keyCode === 27) {
      setIsModalVisible(false)
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []); 


  return (
    <div className="App">
      <h1>Анаграммы</h1>

      <button className="refreshBtn" onClick={startNewGame}>
        новые слова
        <img className="refreshIcon" src={refresh} alt="refresh" />
      </button>

      <ul className="gameField">
        {words.map((word) => (
          <li className="row" key={word.id}>
            <SingleInput
              id={word.id}
              word={word.value}
              shuffledWord={word.shuffledValue}
              isWordGuessed={word.isGuessed}
              handleInputChange={handleInputChange}
              isErrorsVisible={isErrorsVisible}
            />
          </li>
        ))}
      </ul>

      <button className="button" onClick={() => checkCorrectness()}>
        Проверить
      </button>

      <Modal
        show={isModalVisible}
        handleStartNewGame={startNewGame}
        timer={timer}
        close={hideSuccessModal}
      />
    </div>
  );
};

export default App;
