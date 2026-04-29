export default {
  // Store token data
  tokenData: {},

  // Interval ID to clear later if needed
  _tokenIntervalId: null,

  // Initialize: start auto-refresh
  initTokenManager(intervalMs = 10000) { // default: check every 60 seconds
    // Clear existing interval if any
    if (this._tokenIntervalId) clearInterval(this._tokenIntervalId);

    // Start interval to check token
    this._tokenIntervalId = setInterval(async () => {
      if (!this.isTokenValid()) {
        console.log("Access token expired. Fetching new token...");
        await this.fetchToken();
        this.setTokenFromApi();
      }
    }, intervalMs);
  },

  // Set token from API response
  setTokenFromApi() {
    const response = CreateAccessToken.data;

    if (!response || !response.access_token) {
      console.error("Invalid token response");
      return;
    }

    this.tokenData = {
      accessToken: response.access_token,
      tokenType: response.token_type,
      expiresIn: response.expires_in,
      scope: response.scope,
      refreshExpiresIn: response.refresh_expires_in,
      notBeforePolicy: response["not-before-policy"],
      createdAt: Date.now()
    };

    storeValue("arcadiaAccessToken", this.tokenData);
  },

  // Check if token is still valid
  isTokenValid() {
    const token =
      this.tokenData.accessToken
        ? this.tokenData
        : appsmith.store.arcadiaAccessToken;

    if (!token || !token.accessToken) return false;

    const expiryTime = token.createdAt + token.expiresIn * 1000;
    return Date.now() < expiryTime;
  },

  // Trigger API to fetch token
  async fetchToken() {
    try {
      await CreateAccessToken.run();
    } catch (error) {
      console.error("Error fetching access token:", error);
    }
  },

  // Clear token
  clearToken() {
    this.tokenData = {};
    storeValue("arcadiaAccessToken", null);
    if (this._tokenIntervalId) {
      clearInterval(this._tokenIntervalId);
      this._tokenIntervalId = null;
    }
  }
};
