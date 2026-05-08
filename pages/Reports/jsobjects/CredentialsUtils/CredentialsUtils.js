export default {

	totals(source) {
		const statusBySource = {
			ArcadiaSuccess: "CONNECTION_SUCCESS",
			ArcadiaInProgress: "CONNECTION_IN_PROGRESS",
			ConnectionFailure: "CONNECTION_FAILURE",
			deactivated: "CONNECTION_DEACTIVATED",
		};

		if (source === "ArcadiaFeed") {
			const data = GetCredentialsCount.data || [];
			return data[0] ? data[0].total : 0;
		}

		const status = statusBySource[source];
		if (!status) return 0;
		const row = (GetCredentialsStatusSummary.data || []).find(r => r.status === status);
		return row ? row.cnt : 0;
	},

	fetchCredentialsStats() {
		GetCredentialsData.run();
		GetCredentialsCount.run();
		GetCredentialsStatusSummary.run();
	},
};
