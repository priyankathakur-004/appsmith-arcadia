export default {

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
				.join(', ')
		}));
	},

	async applyBillFromDss(row) {
		if (!row) return;
		if (!row.ArcadiaAccountId) {
			showAlert(
				`Bill ${row.IdBill} (acct ${row.AccountNumber_Raw || row.AccountNumber || ''}) has no Arcadia account mapping — can't fetch intervals.`,
				'warning'
			);
			return;
		}
		storeValue('selectedBill', row);
		storeValue('intervalsAccountId', row.ArcadiaAccountId);
		if (row.ServiceStart) storeValue('intervalsStartDate', String(row.ServiceStart).slice(0, 10));
		if (row.ServiceEnd) storeValue('intervalsEndDate', String(row.ServiceEnd).slice(0, 10));
		await Api_ListMeters.run();
		const meters = Api_ListMeters.data?.meters || [];
		if (!meters.length) {
			showAlert('Arcadia returned no meters for that account', 'warning');
			return;
		}
		const meter = meters.find(m => m && m.meterNumber) || meters[0];
		storeValue('intervalsMeterId', meter.id);
		storeValue('selectedMeter', meter);
		await Api_ListIntervals.run();
		const cnt = Api_ListIntervals.data?.readings?.length || 0;
		showAlert(
			cnt ? `Loaded ${cnt} interval reading(s) for bill ${row.IdBill}` : `No intervals returned for ${row.ServiceStart || ''} → ${row.ServiceEnd || ''}`,
			cnt ? 'success' : 'warning'
		);
	},

	downloadIntervalsJson() {
		const data = Api_ListIntervals.data;
		if (!data || !data.readings?.length) {
			showAlert('No interval data to download yet', 'warning');
			return;
		}
		const meterId = appsmith.store.intervalsMeterId || 'meter';
		const start = (appsmith.store.intervalsStartDate || '').slice(0, 10) || 'start';
		const end = (appsmith.store.intervalsEndDate || '').slice(0, 10) || 'end';
		download(JSON.stringify(data, null, 2), `intervals_${meterId}_${start}_${end}.json`, 'application/json');
	}
}
