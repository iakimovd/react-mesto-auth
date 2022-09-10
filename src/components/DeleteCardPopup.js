import React from 'react';

export function DeleteCardPopup({ isOpen, onClose, onCardDelete }) {

  // function handleSubmit(e) {
  //   e.preventDefault();
  //   onCardDelete();
  // }

  return (
    <div className={`"popup delete-card-popup" ${isOpen && "popup_opened"}`} onClick={onClose}>
      <div className="popup__container popup__container_delete-card">
        <h3 className="popup__title">Вы уверены?</h3>
        <form className="popup__form" name="delete-card-form" noValidate>
          <button className="popup__save-button" type="submit" onSubmit={onCardDelete}>Да</button>
        </form>
        <button
          className="popup__close-button popup__close-button_add-new-card"
          type="button"
          onClick={onClose}
        ></button>
      </div>
    </div>
  )
}