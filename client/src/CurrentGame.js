class CurrentGame {

  /**
   * Authenticate a user. Save a token string in Local Storage
   *
   * @param {string} token
   */
  static setGame(gameId) {
    localStorage.setItem('currentGame', gameId);    
  }

  static setGameData(gameData) {
    localStorage.setItem('currentGameData', gameData);
  }
  /**
   * Check if a user is authenticated - check if a token is saved in Local Storage
   *
   * @returns {boolean}
   */
  static isCurrentGame() {
    return localStorage.getItem('currentGame') !== null;
  }

  static isCurrentGameData() {
    return localStorage.getItem('currentGameData') !== null;
  }
  /**
   * Deauthenticate a user. Remove a token from Local Storage.
   *
   */
  static quitGame() {
    localStorage.removeItem('currentGame');
    if (localStorage.getItem('currentGameData') !== null) {
      localStorage.removeItem('currentGameData');
    }
  }

  /**
   * Get a token value.
   *
   * @returns {string}
   */

  static getGame() {
    return localStorage.getItem('currentGame');
  }

  static getGameData() {
    return localStorage.getItem('currentGameData');
  }

}

export default CurrentGame;