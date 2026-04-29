export default {
  normalizeCredentials() {
    const credentials =
      appsmith.store.credentialSearch?.source === "Arcadia"
        ? Api_ListCredentialsArcadiaFix.data?.credentials
        : Api_ListCredentialsUSFix.data?.credentials;

    if (!Array.isArray(credentials)) return [];

    return credentials.map(crd => {
      const provider = crd.provider || {};

      return {
        // 🔹 Keep ALL existing fields exactly as-is
        ...crd,

        // 🔹 Flatten provider fields
        providerId: provider.id,
        providerName: provider.name,
        providerCountry: provider.country,
        providerIsIntervalDataSupported: provider.isIntervalDataSupported,
        providerIsIntervalFileUploadSupported: provider.isIntervalFileUploadSupported,
        providerIsRealTimeCredentialValidationSupported: provider.isRealTimeCredentialValidationSupported,
        providerIntervalServiceTypes: provider.intervalServiceTypes,

        // 🔹 Derived / commonly used fields
        credentialId: crd.id,
        credentialStatus: crd.status,
        credentialStatusDetail: crd.statusDetail,
        totalAccounts: crd.totalAccounts,
        nextRunAt: crd.nextScheduledAccountRunAt,

        // 🔹 Remove nested objects to simplify table binding
        provider: undefined
      };
    });
  },

  fetchCredentials() {
    const { clientId, source } = appsmith.store.credentialSearch || {};

    if (!clientId || !source) return;

    if (source === "Arcadia") {
      return Api_ListCredentialsArcadiaFix.run({ clientId });
    }

    return Api_ListCredentialsUSFix.run({ clientId });
  },
	
	statusFilterMap: {
    Arcadia: {
      All: ["CONNECTION_DEACTIVATED", "CONNECTION_IN_PROGRESS","CONNECTION_FAILURE"],
      "Connection In progress": ["CONNECTION_IN_PROGRESS"],
      "Connection Failure": ["CONNECTION_FAILURE"],
      "Connection Deactivated": ["CONNECTION_DEACTIVATED"],
    },

    US: {
      All: ["CONNECTION_FAILURE", "CONNECTION_IN_PROGRESS"],
      "Connection In progress": ["CONNECTION_IN_PROGRESS"],
      "Connection Failure": ["CONNECTION_FAILURE"],
    }
  },

  getStatusSearch(source) {
    const selectedTab = CredErrorTabs.selectedTab || "All";

    const sourceMap = this.statusFilterMap[source] || this.statusFilterMap.US;
    const statuses = sourceMap[selectedTab] || sourceMap.All;
		const isCustomerActionRequired = source === "Arcadia" ? false : true;

    return `status=in=(${statuses.join(",")});isCustomerActionRequired==${isCustomerActionRequired}`;
  }
};
