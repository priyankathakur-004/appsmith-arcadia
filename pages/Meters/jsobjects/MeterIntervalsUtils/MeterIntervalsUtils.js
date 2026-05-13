export default {

	normalizeMeters() {
		const meters = Api_ListMeters.data?.meters || [];

		return meters.map(m => ({
			// --- IDs ---
			MeterId: m.id,

			// --- Meter Info ---
			MeterNumber: m.meterNumber || m.normalizedMeterNumber || "N/A",
			//NormalizedMeterNumber: m.normalizedMeterNumber || "N/A",
			PreviousMeterNumber: m.previousMeterNumber || "N/A",

			// --- Account Info ---
			AccountNumbers: (m.accounts || []).map(a => a.accountNumber).join(", "),

			// --- Provider / Tariff ---
			ProviderName: m.provider?.name || "N/A",
			TariffName: m.currentTariff?.tariffName || "N/A",

			// --- Service Info ---
			ServiceType: m.serviceType || "N/A",
			ServiceClassification: m.serviceTypeClassification || "N/A",
			Status: m.status || "N/A",
			StatusDetail: m.statusDetail || "N/A",

			// --- Address ---
			FullAddress: m.serviceAddress?.fullAddress || "N/A",
			Street: m.serviceAddress?.streetLine1 || "N/A",
			City: m.serviceAddress?.city || "N/A",
			State: m.serviceAddress?.state || "N/A",
			PostalCode: m.serviceAddress?.postalCode || "N/A",

			// --- Dates ---
			CreatedAt: m.createdAt,
			LastModifiedAt: m.lastModifiedAt,
			LatestStatementDate: m.latestStatementDate,
			NextExpectedPostDate: m.nextExpectedPostDate,

			// --- Flags ---
			//IsStandalone: m.isStandalone,
			IsIntervalsProductActive: m.isIntervalsProductActive,
			//IsThirdPartyMeter: m.isIntervalsThirdPartyPortalMeter,
			//IsLocationIgnored: m.isLocationRecommendationIgnored,

			// --- Correlation ---
			//CorrelationIds: (m.correlationIds || []).join(", "),

			// --- Optional / Extra ---
			//MeterMultiplier: m.meterConstantMultiplier || "N/A",
			//PointOfDeliveryNumber: m.pointOfDeliveryNumber || "N/A",
			//NormalizedPOD: m.normalizedPointOfDeliveryNumber || "N/A",
			Action:""

		}));
	},

	normalizeIntervals() {
		const readings = Api_ListIntervals.data?.readings || [];

		return readings.map(r => ({
			startTime: r.startAt,
			endTime: r.endAt,
			kwh: r.kwh ?? null,
			kw: r.kw ?? null,
			direction: r.direction,
			datapoints: (r.datapoints || [])
			.map(d => `${d.units}: ${d.value}`)
			.join(', ') // 👈 line break for list view
		}));
	},

	getSelectedArcadiaAccountId() {
		return AccountNumberSelect.selectedOptionValue;
	},

	getSelectedMeterId() {
		return appsmith.store.meterId;
	},

	getSelectedMeter() {
		const meterId = this.getSelectedMeterId();
		const meters = Api_ListMeters.data?.meters || [];

		return meters.find(m => m.id === meterId) || null;
	},

	async searchAccounts() {
		await DS_GetArcadiaAccounts.run();
		const data = DS_GetArcadiaAccounts.data;
		showAlert(
			data?.length
			? `Found ${data.length} account(s)`
			: 'No accounts found',
			data?.length ? 'success' : 'warning'
		);
	},

	async listMeters() {
		const arcadiaAccountId = this.getSelectedArcadiaAccountId();
		if (!arcadiaAccountId) {
			showAlert('Please select an account first', 'warning');
			return;
		}
		await Api_ListMeters.run();
		const meters = Api_ListMeters.data?.meters;
		showAlert(
			meters?.length
			? `Found ${meters.length} meter(s)`
			: 'No meters found for this account',
			meters?.length ? 'success' : 'warning'
		);
	},

	async enableIntervals() {
		const meterId = this.getSelectedMeterId();
		if (!meterId) {
			showAlert('Please select a meter first', 'warning');
			return;
		}
		await UpdateMeter.run();
		showAlert('Intervals product activated successfully!', 'success');
		await Api_ListMeters.run();
	},

	async fetchIntervals() {
		const meterId = this.getSelectedMeterId();
		if (!meterId) {
			showAlert('Please select a meter first', 'warning');
			return;
		}
		Api_ListIntervals.run();
	},

	meterIdWithAvailableFilter(){
		const meterId = this.getSelectedMeterId();
		const start = IntervalStartDate.selectedDate;
		const end  = IntervalEndDate.selectedDate;

		if (start && end) {
			return `${meterId}?startAt=${start}&endAt=${end}`
		}

		return meterId;
	}

}