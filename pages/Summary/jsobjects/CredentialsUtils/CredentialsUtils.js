export default {

	normalizeCredentials() {
		return GetCredentialErrorsByClient.data || [];
	},

	totalCredentials() {
		return GetCredentialErrorsByClientCount.data?.[0]?.total || 0;
	},

	fetchCredentials() {
		const source = appsmith.store.credentialSearch?.source;
		if (!source) return;
		GetCredentialErrorsByClient.run();
		GetCredentialErrorsByClientCount.run();
	},

	// Comma-separated status list consumed by GetCredentialErrorsByClient SQL via STRING_SPLIT.
	getStatusList() {
		const source = appsmith.store.credentialSearch?.source;
		const tab = CredErrorTabs.selectedTab || "All";

		const map = {
			Arcadia: {
				"All": "CONNECTION_DEACTIVATED,CONNECTION_IN_PROGRESS,CONNECTION_FAILURE",
				"Connection In progress": "CONNECTION_IN_PROGRESS",
				"Connection Failure": "CONNECTION_FAILURE",
				"Connection Deactivated": "CONNECTION_DEACTIVATED",
			},
			US: {
				"All": "CONNECTION_FAILURE,CONNECTION_IN_PROGRESS",
				"Connection In progress": "CONNECTION_IN_PROGRESS",
				"Connection Failure": "CONNECTION_FAILURE",
			},
		};

		return map[source]?.[tab] || map[source]?.All || "";
	},
};
