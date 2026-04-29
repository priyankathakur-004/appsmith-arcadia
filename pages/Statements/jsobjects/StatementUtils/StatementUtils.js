export default {
	
	totalAccounts(source){
		const sourceMap = {
			totalClientStatements:ListClientStatements.data,
			TotalClientPeriodStatements: TotalClientPeriodStatements.data,
			TotalAccountStatements: AccountNumberSelect.selectedOptionValue ? TotalAccountStatements.data : [],
			TotalAccountPeriodStatements: AccountNumberSelect.selectedOptionValue ? TotalAccountPeriodStatements.data : [],
		};

		const data = sourceMap[source] || [];
		
		return  data?.page?.totalElements || 0;
	},
	
  extendStatements() {
		const statements = ListStatements.data.statements;
    if (!Array.isArray(statements)) return [];

    return statements.map(stmt => {
      const acc = stmt.accountData?.[0] || {};
      const meter = acc.meterData?.[0] || {};
      const stmtProvider = stmt.provider || {};
      const accProvider = acc.provider || {};

      return {
        // 🔹 Keep ALL existing fields exactly as-is
        ...stmt,

        // 🔹 Account fields
        accountId: acc.accountId,
        accountNumber: acc.accountNumber,
				accountAmountDue: acc.amountDue,
				accountDueDate: acc.dueDate,
				accountOutstandingBalance: acc.outstandingBalance,
				accountTotalCharges: acc.totalCharges,
        normalizedAccountNumber: acc.normalizedAccountNumber,

        // 🔹 Meter fields
        meterAmountDue: meter.amountDue,
				meterCurrencyCode: meter.currencyCode,
				meterMeterId: meter.meterId,
				meterMeterNumber: meter.meterNumber,
				meterMeterReadDate: meter.meterReadDate,
				meterNormalizedMeterNumber: meter.normalizedMeterNumber,
				meterNormalizedPointOfDeliveryNumber: meter.normalizedPointOfDeliveryNumber,
				meterOutstandingBalance: meter.outstandingBalance,
				meterPointOfDeliveryNumber: meter.pointOfDeliveryNumber,
				meterPreviousReadDate: meter.previousReadDate,
				meterServiceType: meter.serviceType,
				meterServiceTypeClassification: meter.serviceTypeClassification,
				metertOtalCharges: meter.totalCharges,
				meterTotalUsage: meter.totalUsage,
				meterTotalUsageUnit: meter.totalUsageUnit,

        // 🔹 Statement-level provider fields
				statementProviderId: stmtProvider.id,
				statementProviderName: stmtProvider.name,
				statementProviderCountry: stmtProvider.country,
				statementProviderIsIntervalSupported: stmtProvider.isIntervalDataSupported,
				statementProviderIntervalServiceTypes: stmtProvider.intervalServiceTypes,
				statementProviderIsIntervalFileUploadSupported: stmtProvider.isIntervalFileUploadSupported,
				statementProviderIsRealTimeCredentialValidationSupported: stmtProvider.isRealTimeCredentialValidationSupported,

				

        // 🔹 Account-level provider fields
        accountProviderId: accProvider.id,
        accountProviderName: accProvider.name,
        accountProviderClassification: accProvider.classification,
        accountProviderPublisherProviderAccountId: accProvider.publisherProviderAccountId,

        // 🔹 Remove child arrays
        accountData: undefined,
        meterData: undefined,
				provider:undefined
      };
    });
  },
	
	filters() {
		return [
			AccountNumberSelect.selectedOptionValue
				? `accountIds==${AccountNumberSelect.selectedOptionValue}`
				: null,

			ClientSelect.selectedOptionValue
				? `correlationIds==${ClientSelect.selectedOptionValue}*`
				: null,

			StartDate.formattedDate
				? `statementDate=ge=${StartDate.formattedDate}`
				: null,

			EndDate.formattedDate
				? `statementDate=le=${EndDate.formattedDate}`
				: null
		]
			.filter(Boolean)
			.join(";");
	},
	
	accountFilter() {
		return [
			AccountNumberSelect.selectedOptionValue
				? `accountIds==${AccountNumberSelect.selectedOptionValue}`
				: null,

			StartDate.formattedDate
				? `statementDate=ge=${StartDate.formattedDate}`
				: null,

			EndDate.formattedDate
				? `statementDate=le=${EndDate.formattedDate}`
				: null
		]
			.filter(Boolean)
			.join(";");
	},
	
	clientFilter() {
		return [
			ClientSelect.selectedOptionValue
				? `correlationIds==${ClientSelect.selectedOptionValue}*`
				: null,

			StartDate.formattedDate
				? `statementDate=ge=${StartDate.formattedDate}`
				: null,

			EndDate.formattedDate
				? `statementDate=le=${EndDate.formattedDate}`
				: null
		]
			.filter(Boolean)
			.join(";");
	},
	
	fetchClientStatements() {
		  ListClientStatements.run();
		  ListStatements.run();
		  TotalClientPeriodStatements.run();
	},

	fetchAccountStatements() {
		 	ListStatements.run();
			TotalAccountPeriodStatements.run();
		 	TotalAccountStatements.run();
	},
	
	fetchStatements() {
		  ListStatements.run();
			ListClientStatements.run();
		  TotalClientPeriodStatements.run();
			TotalAccountPeriodStatements.run();
		 	TotalAccountStatements.run();
	},

};
