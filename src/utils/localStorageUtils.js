const TOKEN = "token"

const localStorageUtils = {
  saveToken: (token) => {
    localStorage.setItem(TOKEN, token);
  },
  getToken: () => {
    return localStorage.getItem(TOKEN);
  },
  deleteToken: () => {
    localStorage.removeItem(TOKEN);
  }
}



export { localStorageUtils };