/** ****************************************
 * Project: leaderboard
 * File: Apps.js
 * Created: 3/15/23
 * Author: Abdullah Al Mamun <mamun1214@gmail.com>
 ****************************************** */
import Notification from "./Notification";

class Apps {
  #_notify;

  constructor() {
    this.items = [];
    this.controller = {};
    this.baseUrl = "https://us-central1-js-capstone-backend.cloudfunctions.net/api/";
    this.#events();
    this.#_notify = new Notification;
  }

  set id($val) {
    this._id = $val;
  }

  set success($msg) {
    this.#_notify.show($msg, 'success');
  }

  set error($msg) {
    this.#_notify.show($msg, 'error');
  }

  get id() {
    if (typeof this._id === 'undefined') {
      if (this.getItem('ID').length === 0) {
        return this.getId();
      }
      return this.getItem('ID');
    }
    return this._id;
  };

  #events = () => {
    const $form = document.querySelector('form');
    $form.addEventListener('submit', (e) => {
      e.preventDefault();
      const $formData = new FormData($form);
      this.saveScore($formData);
    });

    const $refresh = document.getElementById('refresh');
    $refresh.addEventListener('click', (e) => {
      e.preventDefault();
      this.getScore();
    });
  };

  getId = () => {
    const $url = this.baseUrl + "games/";
    const $inputs = { name: 'Leaderboard Game' };
    const $response = this.#httpRequest($url, 'POST', $inputs);
    $response.then((res) => {
      const $id = res.result.split(" ");
      this.id = $id[3];
      this.#saveStorage('ID', this.id);
      return this.id;
    }).catch((error) => {
      throw new Error(error);
    });
  };

  #addItem = ($item) => {
    const $ul = document.createElement('ul');
    $ul.id = 'items';
    document.querySelector('.score-list').innerHTML = '';
    $item.forEach((item) => {
      const $li = document.createElement('li');
      $li.textContent = `${item.user}: ${item.score}`;
      $ul.appendChild($li);
    });
    document.querySelector('.score-list').appendChild($ul);
  };

  getScore = () => {
    const $id = this.id;
    const $url = this.baseUrl + `games/${$id}/scores/`;
    const $response = this.#httpRequest($url, 'GET');
    $response.then((res) => {
      this.#addItem(res.result);
    }).catch((error) => {
      throw new Error(error);
    });
  };

  saveScore = ($inputs) => {
    $inputs = {
      "user": $inputs.get('user'),
      "score": $inputs.get('score')
    }
    const $id = this.id;
    const $url = this.baseUrl + `games/${$id}/scores/`;
    const $response = this.#httpRequest($url, 'POST', $inputs);
    $response.then((res) => {
      this.success = res.result;
      //this.getScore();
    }).catch((error) => {
      throw new Error(error);
    });
  };

  getItem = ($key) => {
    const $items = JSON.parse(localStorage.getItem($key));
    if ($items) {
      return $items;
    }
    return [];
  };
  #saveStorage = ($key, $items) => {
    localStorage.setItem($key, JSON.stringify($items));
  };
  #httpRequest = async ($url, $method, $inputs) => {
    const method = method || 'GET';
    const inputs = inputs || '';
    const response = await fetch(
        $url,
        {
          method: $method,
          body: JSON.stringify($inputs), // string or object
          headers: {
            'Content-Type': 'application/json',
          },
        },
    );
    if (response.ok) {
      const result = await response.json();
      return Promise.resolve(result);
    } else {
      return Promise.reject(`HTTP error! Status: ${response.status}`);
    }
  }
}

export default Apps;