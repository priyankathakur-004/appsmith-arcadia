export default {
  customerTotals: [],
  isLoading: false,
  error: null,
	

  async loadCustomerTotals() {
		this.isLoading = true;

		this.customerTotals = [
			{
				Customers: "⏳ Loading Customers Data ...",
				ID: "",
				Accounts: "",
				ArcadiaFeed: "",
				Possible: "",
				Synced: "",
				Percentage: "",
				ToFix: "",
				US: " ",
				Arcadia: " "
			}
		];
		await AccessTokenManager.setTokenFromApi()
    const rows = DS_Customers.data;

    const listAccounts = Api_ListAccounts;
    const listSuccess = Api_ListAccountsSuccess;
    const listUSFix = Api_ListAccountsUSFix;
    const listArcadiaFix = Api_ListAccountsArcadiaFix;

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
      const totalAccounts = row.Total_Account_Count || 0;

      try {
        const [arcadiaRes, syncedRes, usRes, arcadiaFixRes] = await Promise.all([
          listAccounts.run({ clientId }),
          listSuccess.run({ clientId }),
          listUSFix.run({ clientId }),
          listArcadiaFix.run({ clientId }),
        ]);

        const arcadiaFeed = arcadiaRes?.page?.totalElements || 0;
        const synced = syncedRes?.page?.totalElements || 0;
        const usFixCount = usRes?.page?.totalElements || 0;
        const arcadiaFixCount = arcadiaFixRes?.page?.totalElements || 0;

        const possiblePercent =
          totalAccounts > 0 ? (arcadiaFeed / totalAccounts) * 100 : 0;

        const syncedPercent =
          arcadiaFeed > 0 ? (synced / arcadiaFeed) * 100 : 0;

        return {
          Customers: customer,
          ID: clientId,
          Accounts: totalAccounts,
          ArcadiaFeed: arcadiaFeed,
          Possible: Number(possiblePercent.toFixed(2)) + "%",
          Synced: synced,
          Percentage: Number(syncedPercent.toFixed(2)) + "%",
          ToFix: Number((100 - syncedPercent).toFixed(2)) + "%",
          US: usFixCount,
          Arcadia: arcadiaFixCount,
        };
      } catch (error) {
        console.error("Arcadia stats failed for:", clientId, error);
        return {
          Customers: customer,
          ID: clientId,
          Accounts: totalAccounts,
          ArcadiaFeed: 0,
          Possible: "0%",
          Synced: 0,
          Percentage: "0%",
          ToFix: "100%",
          US: 0,
          Arcadia: 0,
          error:  true
        };
      }
    });

    this.customerTotals = results;
		this.isLoading = false;
    return results;
  },
	
  getCustomerTotalsSync() {
    return this.customerTotals;
  }
};
