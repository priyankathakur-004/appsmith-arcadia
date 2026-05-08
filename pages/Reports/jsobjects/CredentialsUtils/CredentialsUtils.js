export default {
	_statusBySource: {
		ArcadiaSuccess: "CONNECTION_SUCCESS",
		ArcadiaInProgress: "CONNECTION_IN_PROGRESS",
		ConnectionFailure: "CONNECTION_FAILURE",
		deactivated: "CONNECTION_DEACTIVATED",
	},

	totals(source) {
		if (source === "ArcadiaFeed") {
			return GetCredentialsCount.data?.[0]?.total ?? 0;
		}
		const status = this._statusBySource[source];
		if (!status) return 0;
		const row = (GetCredentialsStatusSummary.data || []).find(r => r.status === status);
		return row?.cnt ?? 0;
	},

	fetchCredentialsStats() {
		GetCredentialsData.run();
		GetCredentialsCount.run();
		GetCredentialsStatusSummary.run();
	},
};
