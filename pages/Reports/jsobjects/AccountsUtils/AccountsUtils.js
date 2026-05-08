export default {
	// Map metric-card source keys to the DB Status values they should count.
	// CONNECTION_FAILURE intentionally excluded: accounts table doesn't have it as a category.
	_statusBySource: {
		ArcadiaSuccess: "CONNECTION_SUCCESS",
		ArcadiaInProgress: "CONNECTION_IN_PROGRESS",
		DataAccessFailure: "DATA_ACCESS_FAILURE",
		inactive: "INACTIVE",
	},

	totalAccounts(source) {
		if (source === "DS_ClientAccounts") {
			return DS_ClientAccounts.data?.[0]?.total_count ?? 0;
		}
		if (source === "ArcadiaFeed") {
			return GetAccountsCount.data?.[0]?.total ?? 0;
		}
		const status = this._statusBySource[source];
		if (!status) return 0;
		const row = (GetAccountsStatusSummary.data || []).find(r => r.status === status);
		return row?.cnt ?? 0;
	},

	fetchAccountStats() {
		const clientId = AccClientSelect.selectedOptionValue;
		DS_ClientAccounts.run({ clientId });
		GetAccountsData.run();
		GetAccountsCount.run();
		GetAccountsStatusSummary.run();
	},
};
