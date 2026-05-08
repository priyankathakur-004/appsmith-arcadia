export default {
  getCredentialOptions() {
    return [
      { status: "CONNECTION_SUCCESS" },
      { status: "CONNECTION_IN_PROGRESS" },
      { status: "CONNECTION_FAILURE" },
      { status: "CONNECTION_DEACTIVATED" },
    ];
  },

  getAccountOptions() {
    return [
      { status: "CONNECTION_SUCCESS" },
      { status: "CONNECTION_IN_PROGRESS" },
      { status: "NEW_ACCOUNT" },
      { status: "DATA_ACCESS_FAILURE" },
      { status: "INACTIVE" },
      { status: "CONNECTION_DEACTIVATED" },
    ];
  },
};
