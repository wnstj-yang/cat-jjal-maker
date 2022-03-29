import logo from './logo.svg';
import React from 'react';
import Title from './components/Title';
import './App.css';

const jsonLocalStorage = {
  setItem: (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
  },
  getItem: (key) => {
    return JSON.parse(localStorage.getItem(key));
  },
};
const fetchCat = async (text) => {
  const OPEN_API_DOMAIN = "https://cataas.com";
  const response = await fetch(`${OPEN_API_DOMAIN}/cat/says/${text}?json=true`);
  const responseJson = await response.json();
  return `${OPEN_API_DOMAIN}/${responseJson.url}`;
};

function CatItem(props) {
  return (
    <li>
      <img src={props.img} style={{width: '150px', border: '1px solid red'}}/>
    </li>
  );
}


// 중괄호를 사용 시 javascript문법을 사용할 수 있음
// 고양이 API는 서버로 요청하는 API
// fetch API는 자바스크립트로 호출할 수 있는 API
function Favorites({ favorites }) {
  if (favorites.length === 0) {
    return <div>사진 위 하트를 눌러 고양이 사진을 저장해봐요!</div>
  }

  return (
    <ul className="favorites">
      {favorites.map((cat) => (
        <CatItem key={cat} img={cat} />
      ))}
    </ul>
  );
}
const MainCard = ({ img, onHeartClick, alreadyFavorite }) => {
  const heartIcon = alreadyFavorite ? "💖" : "🤍";
  return (
    <div className="main-card">
      <img
        src={img}
        alt="고양이"
        width="400"
      />
      <button 
        onClick={onHeartClick}
      >
      {heartIcon}
      </button>
    </div>

  );
};

const Form = ({ updateMainCat }) => {
  const [value, setValue] = React.useState('');
  const includesHangul = (text) => /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/i.test(text);
  const [errorMessage, setErrorMessage] = React.useState('');

  function handleInputChange(e) {
    const userValue = e.target.value;
    if (includesHangul(userValue)) {
      setErrorMessage("한글은 입력할 수 없습니다.");
    } else {
      setErrorMessage("")
    }
    setValue(userValue.toUpperCase());
  }
  
  function handleFormSubmit(e) {
    e.preventDefault();
    if (value === '') {
      setErrorMessage("빈 값으로 만들 수 없습니다.")
      return;
    }
    updateMainCat(value); 
  }

  return (
    <form onSubmit={handleFormSubmit}>
      <input 
        type="text" 
        name="name" 
        placeholder="영어 대사를 입력해주세요" 
        onChange={handleInputChange}
        value={value}
      />
      <button type="submit">생성</button>
      <p style={{ color: "red" }}>{errorMessage}</p>
    </form>
  );
};

const App = () => {
  const CAT1 = "https://cataas.com/cat/60b73094e04e18001194a309/says/react";
  const CAT2 = "https://cataas.com//cat/5e9970351b7a400011744233/says/inflearn";
  const CAT3 = "https://cataas.com/cat/595f280b557291a9750ebf65/says/JavaScript";
  const EMPTY_HEART = "🤍";
  const FULL_HEART = "💖";
  // const [counter, setCounter] = React.useState(jsonLocalStorage.getItem("counter"));
  // 처음 한 번만 접근하기 위해 함수 사용 
  const [counter, setCounter] = React.useState(() => {
    return jsonLocalStorage.getItem("counter");
  });
  const [favorites, setFavorites] = React.useState(() => {
    return jsonLocalStorage.getItem("favorites") || [];
  });

  const [mainCatImg, setMainCat] = React.useState(CAT1)
  async function setInitialCat() {
    const newCat = await fetchCat('First Cat');
    setMainCat(newCat);
  }
  React.useEffect(() => {
    setInitialCat();
  }, [])

  const alreadyFavorite = favorites.includes(mainCatImg)
  async function updateMainCat(value) {
    const newCat = await fetchCat(value);
    // setCounter(nextCounter);
    // 기존 값을 함수의 첫번 째 인자로 받아서 사용한다.
    setCounter((prev) => {
      const nextCounter = prev + 1;
      jsonLocalStorage.setItem("counter", nextCounter);
      return nextCounter;
    })
    setMainCat(newCat);
  }


  function handleHeartClick() {
    const nextFavorites = [...favorites, mainCatImg]
    setFavorites(nextFavorites)
    jsonLocalStorage.setItem('favorites', nextFavorites)
  }

  const counterTitle = counter === null ? "" : counter + '번째';
  
  return (
    <div>
      <Title>{counterTitle} 고양이 가라사대</Title>
      <MainCard img={mainCatImg} onHeartClick={handleHeartClick} alreadyFavorite={alreadyFavorite}/>
      <Favorites favorites={favorites}/>
      <Form updateMainCat={updateMainCat}/>
    </div>
  );
}

export default App;
