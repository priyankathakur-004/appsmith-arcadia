export default {

  // 🔹 Credentials dropdown options
  getCredentialOptions() {
    return [
      // SUCCESS
      { status: "CONNECTION_SUCCESS" },
     
      // IN PROGRESS
      { status: "CONNECTION_IN_PROGRESS" },
     
      // FAILURE
      { status: "CONNECTION_FAILURE" },

      // DEACTIVATED
      { status: "CONNECTION_DEACTIVATED"} 
    ];
  },

  // 🔹 Accounts dropdown options
  getAccountOptions() {
    return [
      // SUCCESS
      { status: "CONNECTION_SUCCESS" },

      // IN PROGRESS
      { status: "CONNECTION_IN_PROGRESS" },
     
      // NEW ACCOUNT
      { status: "NEW_ACCOUNT" },

      // FAILURE
      { status: "DATA_ACCESS_FAILURE" },

      // INACTIVE
      { status: "INACTIVE" },

      // DEACTIVATED
      { status: "CONNECTION_DEACTIVATED" }
    ];
  },
	
	getAccountStatusParam() {
    const values = MainTabs.selectedTab == "Accounts" ? AccStatusSelect.selectedOptionValues : CredStatusSelect.selectedOptionValues;

    if (!values || values.length === 0) return "";

    return `status=in=(${values.join(",")})`;
  },

};
