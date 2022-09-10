export class Api {
  constructor({ baseUrl, headers }) {
    this._url = baseUrl;
    this._headers = headers;
  }

  _returnFetchResult(res) {
    if (res.ok) {
      return res.json();
    }
    // если ошибка, отклоняем промис
    return Promise.reject(`Ошибка: ${res.status}`);
  }

  getUserInfo() {
    return fetch(`${this._url}/users/me`, {
      method: 'GET',
      headers: this._headers
    })
      .then(this._returnFetchResult);
  }

  getInitialCards() {
    return fetch(`${this._url}/cards`, {
      method: 'GET',
      headers: this._headers
    })
      .then(this._returnFetchResult);
  }

  editUserInfo(userName, userInfo) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: userName,
        about: userInfo
      })
    })
      .then(this._returnFetchResult);
  }

  addUserCard(data) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        link: data.link
      })
    })
      .then(this._returnFetchResult);
  }

  changeLikeCardStatus(id, isLiked) {
    return fetch(`${this._url}/cards/likes/${id}`, {
      method: (isLiked ? "PUT" : "DELETE"),
      headers: this._headers
    })
      .then(this._returnFetchResult);
  }

  deleteCard(id) {
    return fetch(`${this._url}/cards/${id}`, {
      method: 'DELETE',
      headers: this._headers
    })
      .then(this._returnFetchResult);
  }

  editAvatar(data) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: data,
      })
    })
      .then(this._returnFetchResult);
  }
}

const api = new Api({
  baseUrl: 'https://mesto.nomoreparties.co/v1/cohort-45',
  headers: {
    authorization: 'da76a411-e3e6-438b-8cb6-f5789c0a7ca5',
    'Content-Type': 'application/json'
  }
});

export default api;