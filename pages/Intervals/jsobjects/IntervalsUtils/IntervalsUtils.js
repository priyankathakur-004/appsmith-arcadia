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
		// Arcadia's /plug/intervals endpoint requires startAt/endAt — derive a 30-day window
		// ending at the invoice date (approximates the bill's service period).
		if (row.InvoiceDate) {
			const end = new Date(row.InvoiceDate);
			const start = new Date(end);
			start.setDate(start.getDate() - 30);
			const iso = d => d.toISOString().slice(0, 10);
			storeValue('intervalsStartDate', iso(start));
			storeValue('intervalsEndDate', iso(end));
		}
		await Api_ListMeters.run();
		const meters = Api_ListMeters.data?.meters || [];
		if (!meters.length) {
			showAlert('Arcadia returned no meters for that account', 'warning');
			return;
		}
		const withNumber = meters.filter(m => m && m.meterNumber);
		const pool = withNumber.length ? withNumber : meters;
		const enabled = pool.filter(m => m.isIntervalsProductActive);
		const meter = enabled[0] || pool[0];
		storeValue('intervalsMeterId', meter.id);
		storeValue('selectedMeter', meter);
		if (!meter.isIntervalsProductActive) {
			showAlert(
				`Meter ${meter.meterNumber || meter.id} is not enabled for intervals in Arcadia (status: ${meter.status || '—'}). Arcadia will return 403 if we try to fetch — skipping.`,
				'warning'
			);
			return;
		}
		await Api_ListIntervals.run();
		const cnt = Api_ListIntervals.data?.readings?.length || 0;
		showAlert(
			cnt ? `Loaded ${cnt} interval reading(s) for bill ${row.IdBill}` : `No intervals returned for that meter`,
			cnt ? 'success' : 'warning'
		);
	},

	downloadIntervalsJson() {
		const data = Api_ListIntervals.data;
		const readings = data?.readings || [];
		if (!readings.length) {
			showAlert('No interval data to download yet', 'warning');
			return;
		}
		const meterId = appsmith.store.intervalsMeterId || 'meter';
		const starts = readings.map(r => r.startAt).filter(Boolean).sort();
		const ends = readings.map(r => r.endAt).filter(Boolean).sort();
		const first = (starts[0] || '').slice(0, 10) || 'start';
		const last = (ends[ends.length - 1] || '').slice(0, 10) || 'end';
		download(JSON.stringify(data, null, 2), `intervals_${meterId}_${first}_${last}.json`, 'application/json');
	}
}
