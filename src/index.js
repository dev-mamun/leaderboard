/** ****************************************
 * Project: leaderboard
 * File: index.js
 * Created: 3/14/23
 * Author: Abdullah Al Mamun <mamun1214@gmail.com>
 ****************************************** */
import './css/apps.css';
import Apps from './modules/Apps';

window.addEventListener('load', () => {
  const game = new Apps();
  game.getScore();
});