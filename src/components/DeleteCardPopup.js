import React from 'react';
import { PopupWithForm } from "./PopupWithForm";

export function DeleteCardPopup({ isOpen, onClose, onCardDelete, card }) {

  function handleSubmit(e) {
    e.preventDefault();
    onCardDelete(card);
  }

  return (
    <PopupWithForm title="Вы уверены?" name="edit-avatar" isOpen={isOpen} onClose={onClose} buttonName="Да" onSubmit={handleSubmit}>

    </PopupWithForm>
  )
}