export default {
	
	totalAccounts(){
		const source = appsmith.store.accountsSearch?.source;
		if (source === "DS_ClientAccounts") {
			return DS_ClientAccountsCount.data[0].totalRecords;
		}
		const sourceMap = {
			ArcadiaFeed: Api_ListAccounts.data,
			ArcadiaSuccess: Api_ListAccountsSuccess.data,
			US: Api_ListAccountsUSFix.data,
			Arcadia: Api_ListAccountsArcadiaFix.data
		};

		const data = sourceMap[source] || Api_ListAccounts.data;
		
		return data.page.totalElements;
	},
	
  normalizeAccounts() {
    const source = appsmith.store.accountsSearch?.source;

		const sourceMap = {
			ArcadiaFeed: Api_ListAccounts.data,
			ArcadiaSuccess: Api_ListAccountsSuccess.data,
			US: Api_ListAccountsUSFix.data,
			DS_ClientAccounts:DS_ClientAccounts.data,
			Arcadia: Api_ListAccountsArcadiaFix.data
		};

		const selected = sourceMap[source] || Api_ListAccounts.data;
		
		// 🔥 👉 Handle DSS (DS_ClientAccounts) separately
		if (source === "DS_ClientAccounts") {
			const rows = selected || [];

			if (!Array.isArray(rows)) return [];

			return rows.map((row, index) => ({
				Client_Name: row.Client_Name,
				Client_ID: row.Client_ID,
				AccountNumber_Raw: row.AccountNumber_Raw,
				IdClientAccount: row.IdClientAccount,
				VendorName: row.VendorName
			}));
  	}

		const accounts = selected?.accounts || [];
		
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
	
	fetchAccounts() {
		const { clientId, source } = appsmith.store.accountsSearch || {};
		if (!clientId || !source || source == "DS_ClientAccounts") return;

		const apiMap = {
			ArcadiaFeed: Api_ListAccounts,
			ArcadiaSuccess: Api_ListAccountsSuccess,
			US: Api_ListAccountsUSFix,
			DS_ClientAccounts: DS_ClientAccounts,
			Arcadia: Api_ListAccountsArcadiaFix
		};
		
		return apiMap[source].run({ clientId });
	},

	
	statusFilterMap: {
    Arcadia: {
      All: ["INACTIVE", "CONNECTION_DEACTIVATED", "CONNECTION_IN_PROGRESS"],
      "Connection In progress": ["CONNECTION_IN_PROGRESS"],
      "Inactive": ["INACTIVE"],
      "Connection Deactivated": ["CONNECTION_DEACTIVATED"],
      "Data Access Failure": ["DATA_ACCESS_FAILURE"],
    },

    US: {
      All: ["DATA_ACCESS_FAILURE", "CONNECTION_IN_PROGRESS"],
      "Connection In progress": ["CONNECTION_IN_PROGRESS"],
      "Data Access Failure": ["DATA_ACCESS_FAILURE"],
    }
  },

  getStatusSearch(source) {
    const selectedTab = ErrorTabs.selectedTab || "All";

    const sourceMap = this.statusFilterMap[source] || this.statusFilterMap.US;
    const statuses = sourceMap[selectedTab] || sourceMap.All;
		const isCustomerActionRequired = source === "Arcadia" ? false : true;

    return `status=in=(${statuses.join(",")});isCustomerActionRequired==${isCustomerActionRequired}`;
  }
};
