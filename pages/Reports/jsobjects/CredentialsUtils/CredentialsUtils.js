export default {
  
	filters() {
			const clientId = CredClientSelect.selectedOptionValue;
			const correlationParam = clientId ? `correlationId==${clientId}*` : ""
			const statusParam = StatusUtils.getAccountStatusParam();

			return [statusParam, correlationParam]
				.filter(p => p) // remove empty
				.join(";");
	},
	
	normalizeCredentials() {
    const credentials = Api_ListCredentials.data?.credentials;

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
	
	totals(source){
		const sourceMap = {
			ArcadiaFeed: Api_ListCredentials.data,
			ArcadiaSuccess: Api_ListCredentialsSuccess.data,
			ConnectionFailure: Api_ListCredentailsFailure.data,
			ArcadiaInProgress: Api_ListCredentialsInProgress.data,
			deactivated: Api_ListCredentialsDeactivated.data,
		};

		const data = sourceMap[source] || [];
		
		return data.page.totalElements;
	},

  fetchCredentialsStats() {
    	const clientId = CredClientSelect.selectedOptionValue;
			Api_ListCredentials.run({ clientId });
			Api_ListCredentialsSuccess.run({ clientId });
			Api_ListCredentailsFailure.run({ clientId });
			Api_ListCredentialsInProgress.run({ clientId });
			Api_ListCredentialsDeactivated.run({ clientId });
  },
};
