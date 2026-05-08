export default {

	totalAccounts(source) {
		const statusBySource = {
			ArcadiaSuccess: "CONNECTION_SUCCESS",
			ArcadiaInProgress: "CONNECTION_IN_PROGRESS",
			DataAccessFailure: "DATA_ACCESS_FAILURE",
			inactive: "INACTIVE",
		};

		if (source === "ArcadiaFeed") {
			const data = GetAccountsCount.data || [];
			return data[0] ? data[0].total : 0;
		}

		const status = statusBySource[source];
		if (!status) return 0;
		const row = (GetAccountsStatusSummary.data || []).find(r => r.status === status);
		return row ? row.cnt : 0;
	},

	fetchAccountStats() {
		GetAccountsData.run();
		GetAccountsCount.run();
		GetAccountsStatusSummary.run();
	},
};
