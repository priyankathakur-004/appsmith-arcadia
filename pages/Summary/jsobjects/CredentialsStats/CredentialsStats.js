export default {
	credentialTotals: [],
	isLoading: false,
	error: null,


	async loadCredentialTotals() {
		this.isLoading = true;
		
		// Show loading row in table
		this.credentialTotals = [
			{
				Customers: "⏳ Loading Credentials Data...",
				ID: "",
				ArcadiaFeed: "",
				Synced: "",
				Percentage: "",
				ToFix: "",
				US: " ",
				Arcadia: " "
			}
		];
		
		const rows = DS_Customers.data || [];

		const listCredentials = Api_ListCredentials;
		const listSuccessCredentials = Api_ListCredentialsSucess;
		const listUSFix = Api_ListCredentialsUSFix;
		const listArcadiaFix = Api_ListCredentialsArcadiaFix;

		const limit = 5;

		const mapWithLimit = async (items, limit, fn) => {
			const results = [];
			const executing = [];

			for (const item of items) {
				const p = Promise.resolve().then(() => fn(item));
				results.push(p);

				if (executing.length >= limit) {
					await Promise.race(executing);
				}

				const e = p.finally(() => {
					const i = executing.indexOf(e);
					if (i > -1) executing.splice(i, 1);
				});

				executing.push(e);
			}

			return Promise.all(results);
		};

		const results = await mapWithLimit(rows, limit, async (row) => {
			const customer = row.Customer_DS;
			const clientId = row.Client_ID_DS;

			try {
				const [arcadiaRes, syncedRes, usRes, arcadiaFixRes] = await Promise.all([
					listCredentials.run({ clientId }),
					listSuccessCredentials.run({ clientId }),
					listUSFix.run({ clientId }),
					listArcadiaFix.run({ clientId }),
				]);

				const arcadiaFeed = arcadiaRes?.page?.totalElements || 0;
				const synced = syncedRes?.page?.totalElements || 0;
				const usFixCount = usRes?.page?.totalElements || 0;
				const arcadiaFixCount = arcadiaFixRes?.page?.totalElements || 0;

				const syncedPercent =
							arcadiaFeed > 0 ? (synced / arcadiaFeed) * 100 : 0;

				return {
					Customers: customer,
					ID: clientId,
					ArcadiaFeed: arcadiaFeed,
					Synced: synced,
					Percentage: Number(syncedPercent.toFixed(2)) + "%",
					ToFix: Number((100 - syncedPercent).toFixed(2)) + "%",
					US: usFixCount,
					Arcadia: arcadiaFixCount,
				};
			} catch (error) {
				console.error("Credential stats failed:", clientId, error);
				return {
					Customers: customer,
					ID: clientId,
					ArcadiaFeed: 0,
					Synced: 0,
					Percentage: "0%",
					ToFix: "100%",
					US: 0,
					Arcadia: 0,
					error: true,
				};
			}
		});

		this.credentialTotals = results;
		this.isLoading = false;
		return results;
	},

	getCredentialTotalsSync() {
		return this.credentialTotals;
	}
};
