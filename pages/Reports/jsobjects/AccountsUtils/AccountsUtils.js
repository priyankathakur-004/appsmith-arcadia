export default {
	
	totalAccounts(source){
		const sourceMap = {
			DS_ClientAccounts:DS_ClientAccounts.data,
			ArcadiaFeed: Api_ListAccounts.data,
			ArcadiaSuccess: Api_ListAccountsSuccess.data,
			DataAccessFailure: Api_ListAccountsDataAccessFail.data,
			ArcadiaInProgress: Api_ListAccountsInProgress.data,
			inactive: Api_ListAccountsInActive.data,
		};

		const data = sourceMap[source] || [];
		
		return source === "DS_ClientAccounts" ? data[0].total_count : data.page.totalElements;
	},
	
  normalizeAccounts() {
		
		const accounts = Api_ListAccounts.data.accounts;
		
    if (!Array.isArray(accounts)) return [];

    return accounts.map(acc => {
      const provider = acc.provider || {};
      const serviceType = acc.serviceTypes?.[0] || {};

      return {
        // 🔹 Keep ALL existing fields exactly as-is
        ...acc,

        // 🔹 Flatten provider fields
        providerId: provider.id,
        providerName: provider.name,
        providerCountry: provider.country,
        providerIsIntervalDataSupported: provider.isIntervalDataSupported,
        providerIsIntervalFileUploadSupported: provider.isIntervalFileUploadSupported,
        providerIsRealTimeCredentialValidationSupported: provider.isRealTimeCredentialValidationSupported,
        providerIntervalServiceTypes: provider.intervalServiceTypes,

        // 🔹 Flatten service type (first one)
        serviceType: serviceType.serviceType,
        serviceTypeClassification: serviceType.serviceTypeClassification,

        // 🔹 Derived / commonly used fields
        normalizedAccountNumber: acc.normalizedAccountNumber || acc.accountNumber,
        accountId: acc.id,
        accountStatus: acc.status,
        accountStatusDetail: acc.statusDetail,

        // 🔹 Remove nested objects to simplify table binding
        provider: undefined,
        serviceTypes: undefined
      };
    });
  },
	
	fetchAccountStats() {
		const clientId = AccClientSelect.selectedOptionValue;
		DS_ClientAccounts.run({ clientId });
		Api_ListAccounts.run({ clientId });
		Api_ListAccountsSuccess.run({ clientId });
		Api_ListAccountsDataAccessFail.run({ clientId });
		Api_ListAccountsInProgress.run({ clientId });
		Api_ListAccountsInActive.run({ clientId });

	},
	
	filters() {
   	const clientId = AccClientSelect.selectedOptionValue;
		const correlationParam = clientId ? `correlationIds==${clientId}*` : ""
		const statusParam = StatusUtils.getAccountStatusParam();

		return [statusParam, correlationParam]
      .filter(p => p) // remove empty
      .join(";");
  },
};
