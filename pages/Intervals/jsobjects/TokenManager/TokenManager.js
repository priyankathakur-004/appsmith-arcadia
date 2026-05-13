export default {
  tokenData: {},
  _tokenIntervalId: null,

  async initTokenManager(intervalMs = 10000) {
    if (this._tokenIntervalId) clearInterval(this._tokenIntervalId);
    if (!this.isTokenValid()) {
      await this.fetchToken();
      this.setTokenFromApi();
    }
    this._tokenIntervalId = setInterval(async () => {
      if (!this.isTokenValid()) {
        await this.fetchToken();
        this.setTokenFromApi();
      }
    }, intervalMs);
  },

  setTokenFromApi() {
    const response = Api_CreateAccessToken.data;
    if (!response || !response.access_token) {
      console.error('Invalid token response');
      return;
    }
    this.tokenData = {
      accessToken: response.access_token,
      tokenType: response.token_type,
      expiresIn: response.expires_in,
      scope: response.scope,
      refreshExpiresIn: response.refresh_expires_in,
      notBeforePolicy: response['not-before-policy'],
      createdAt: Date.now()
    };
    storeValue('arcadiaAccessToken', this.tokenData);
  },

  isTokenValid() {
    const token = this.tokenData.accessToken
      ? this.tokenData
      : appsmith.store.arcadiaAccessToken;
    if (!token || !token.accessToken) return false;
    const expiryTime = token.createdAt + token.expiresIn * 1000;
    return Date.now() < expiryTime;
  },

  async fetchToken() {
    try {
      await Api_CreateAccessToken.run();
    } catch (e) {
      console.error('Failed to fetch access token:', e);
      showAlert('Failed to authenticate with Arcadia API', 'error');
    }
  }
}
