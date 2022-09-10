import React, { useEffect, useState } from 'react';
import { Route, Switch, useHistory } from 'react-router-dom';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import '../index.css';
import api from "../utils/Api";
import { AddPlacePopup } from "./AddPlacePopup";
import { EditAvatarPopup } from "./EditAvatarPopup";
import { EditProfilePopup } from "./EditProfilePopup";
import { DeleteCardPopup } from './DeleteCardPopup';
import { Footer } from './Footer';
import { Header } from './Header';
import { ImagePopup } from "./ImagePopup";
import { Main } from './Main';
import { Login } from './Login';
import { Register } from './Register';
import ProtectedRoute from './ProtectedRoute';
import { InfoTooltip } from './InfoTooltip';
import * as auth from '../utils/Auth';

function App() {

  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
  const [isDeleteCardPopupOpen, setDeleteCardPopupOpen] = useState(false);
  const [isInfoTooltipPopupOpen, setIsInfoTooltipPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isSuccess, setIsSuccess] = useState(null);
  const history = useHistory();
  const [email, setEmail] = useState('');

  useEffect(() => {
    api.getInitialCards()
      .then((cards) => {
        setCards(cards);
      })
      .catch(err => { console.log(err) });
  }, []);

  useEffect(() => {
    api.getUserInfo()
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch(err => { console.log(err) });
  }, []);

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function handleCardLike(card) {
    // Снова проверяем, есть ли уже лайк на этой карточке
    const isLiked = card.likes.some(i => i._id === currentUser._id);

    // Отправляем запрос в API и получаем обновлённые данные карточки
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch(err => { console.log(err) })
  }

  function handleCardDelete(card) {
    // setDeleteCardPopupOpen(true);
    api.deleteCard(card._id)
      .then(() => {
        setDeleteCardPopupOpen(true);
        setCards((state) => state.filter((data) => data._id !== card._id));
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleUpdateUser(data) {
    api.editUserInfo(data.name, data.about)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(err => { console.log(err) });
  }

  function handleUpdateAvatar(data) {
    api.editAvatar(data.avatar)
      .then((res) => {
        setCurrentUser(res);
        closeAllPopups();
      })
      .catch(err => { console.log(err) });
  }

  function handleAddPlaceSubmit(data) {
    api.addUserCard(data)
      .then((newCard) => {
        setCards([newCard, ...cards]);
        closeAllPopups();
      })
      .catch(err => { console.log(err) });
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setIsInfoTooltipPopupOpen(false);
    setDeleteCardPopupOpen(false);
    setSelectedCard(null);
  }

  useEffect(() => {
    const handleClosePopup = (event) => {
      if (event.key === 'Escape') {
        closeAllPopups();
      }
    }
    window.addEventListener('keydown', handleClosePopup)
    return () => window.removeEventListener('keydown', handleClosePopup)
  })

  React.useEffect(() => {
    const jwt = localStorage.getItem('jwt');
    if (!jwt) {
      return;
    }
    auth.checkToken(jwt)
      .then((res) => {
        setEmail(res.data.email);
        setLoggedIn(true);
        history.push("/")
      })
      .catch((err) => {
        console.log(err);
      })
  }, [history]);

  const onLogin = ({ email, password }) => {
    return auth.authorize({ email, password })
      .then(({ token }) => {
        setLoggedIn(true);
        localStorage.setItem('jwt', token);
        setEmail(email);
        setIsSuccess(true);
        history.push("/");
      })
      .catch((err) => {
        setIsInfoTooltipPopupOpen(true);
        setIsSuccess(false);
        console.log(err);
      })
  };

  const onRegister = ({ email, password }) => {
    return auth.register({ email, password })
      .then(() => {
        setLoggedIn(true);
        setIsInfoTooltipPopupOpen(true);
        setIsSuccess(true);
        history.push("/sign-in");
      })
      .catch((err) => {
        setIsInfoTooltipPopupOpen(true);
        setIsSuccess(false);
        console.log(err);
      })
  };

  const onLogout = () => {
    setLoggedIn(false);
    localStorage.removeItem('jwt');
    history.push("/sign-in");
    setEmail("");
  };

  return (
    <div className="page">
      <CurrentUserContext.Provider value={currentUser}>

        <Header email={email} onLogout={onLogout}/>

        <Switch>

          <Route path="/sign-up">
            <Register onRegister={onRegister} />
          </Route>

          <Route path="/sign-in">
            <Login onLogin={onLogin} />
          </Route>

          <ProtectedRoute
            exact path="/"
            loggedIn={loggedIn}
            component={Main}
            cards={cards}
            onEditProfile={handleEditProfileClick}
            onAddPlace={handleAddPlaceClick}
            onEditAvatar={handleEditAvatarClick}
            onCardClick={handleCardClick}
            onCardLike={handleCardLike}
            onCardDelete={handleCardDelete}
          />

        </Switch>

        <Footer />

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />

        <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />

        <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups} onUpdateAvatar={handleUpdateAvatar} />

        <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddPlace={handleAddPlaceSubmit} />

        <InfoTooltip isOpen={isInfoTooltipPopupOpen} onClose={closeAllPopups} isSuccess={isSuccess}/>

        <DeleteCardPopup isOpen={isDeleteCardPopupOpen} onClose={closeAllPopups} onCardDelete={handleCardDelete}/>

        <div className="popup delete-card-popup">
          <div className="popup__container popup__container_delete-card">
            <h3 className="popup__title">Вы уверены?</h3>
            <form className="popup__form" name="delete-card-form" noValidate>
              <button className="popup__save-button" type="submit">Да</button>
            </form>
            <button
              className="popup__close-button popup__close-button_add-new-card"
              type="button"
            ></button>
          </div>
        </div>

      </CurrentUserContext.Provider>
    </div >
  );
}

export default App;
