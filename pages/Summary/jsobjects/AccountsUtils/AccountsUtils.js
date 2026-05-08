export default {

	// Returns the table data for the AccountsModel/ErrorModel based on the
	// stored source. Each source maps to a different DB query.
	normalizeAccounts() {
		const source = appsmith.store.accountsSearch?.source;

		if (source === "DS_ClientAccounts") {
			return DS_ClientAccounts.data || [];
		}
		if (source === "Arcadia" || source === "US") {
			return GetAccountErrorsByClient.data || [];
		}
		// ArcadiaFeed and ArcadiaSuccess
		return GetAccountsByClient.data || [];
	},

	totalAccounts() {
		const source = appsmith.store.accountsSearch?.source;

		if (source === "DS_ClientAccounts") {
			return DS_ClientAccountsCount.data?.[0]?.totalRecords || 0;
		}
		if (source === "Arcadia" || source === "US") {
			return GetAccountErrorsByClientCount.data?.[0]?.total || 0;
		}
		return GetAccountsByClientCount.data?.[0]?.total || 0;
	},

	// Re-runs the relevant DB query for the active source.
	// Triggered by table onPageChange and by ErrorTabs onTabSelected.
	fetchAccounts() {
		const source = appsmith.store.accountsSearch?.source;
		if (!source) return;

		if (source === "DS_ClientAccounts") {
			DS_ClientAccounts.run();
			DS_ClientAccountsCount.run();
			return;
		}
		if (source === "Arcadia" || source === "US") {
			GetAccountErrorsByClient.run();
			GetAccountErrorsByClientCount.run();
			return;
		}
		GetAccountsByClient.run();
		GetAccountsByClientCount.run();
	},

	// Comma-separated status list consumed by GetAccountErrorsByClient SQL via STRING_SPLIT.
	// Driven by accountsSearch.source and the active ErrorTabs tab.
	getStatusList() {
		const source = appsmith.store.accountsSearch?.source;
		const tab = ErrorTabs.selectedTab || "All";

		const map = {
			Arcadia: {
				"All": "INACTIVE,CONNECTION_DEACTIVATED,CONNECTION_IN_PROGRESS",
				"Connection In progress": "CONNECTION_IN_PROGRESS",
				"Inactive": "INACTIVE",
				"Connection Deactivated": "CONNECTION_DEACTIVATED",
				"Data Access Failure": "DATA_ACCESS_FAILURE",
			},
			US: {
				"All": "DATA_ACCESS_FAILURE,CONNECTION_IN_PROGRESS",
				"Connection In progress": "CONNECTION_IN_PROGRESS",
				"Data Access Failure": "DATA_ACCESS_FAILURE",
			},
		};

		return map[source]?.[tab] || map[source]?.All || "";
	},
};
