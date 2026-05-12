export default {

	getRecentDownloadsChartConfig() {
		const rows = (GetRecentDownloads.data || []).slice().reverse();
		const labels = rows.map(r => r.month_label);
		const values = rows.map(r => r.downloaded_account_count);

		return {
			backgroundColor: "#1e293b",
			title: {
				text: "Recent Downloads",
				left: 16,
				top: 12,
				textStyle: {
					color: "#e2e8f0",
					fontSize: 16,
					fontWeight: "bold"
				}
			},
			grid: {
				left: "8%",
				right: "5%",
				top: "22%",
				bottom: "12%",
				containLabel: true
			},
			tooltip: {
				trigger: "axis",
				backgroundColor: "#0f172a",
				borderColor: "#334155",
				textStyle: { color: "#e2e8f0" }
			},
			xAxis: {
				type: "category",
				data: labels,
				axisLine: { lineStyle: { color: "#475569" } },
				axisLabel: { color: "#94a3b8" }
			},
			yAxis: {
				type: "value",
				axisLine: { lineStyle: { color: "#475569" } },
				axisLabel: { color: "#94a3b8" },
				splitLine: { lineStyle: { color: "#334155" } }
			},
			series: [{
				name: "Downloaded Accounts",
				type: "line",
				smooth: true,
				data: values,
				lineStyle: { color: "#3b82f6", width: 3 },
				itemStyle: { color: "#3b82f6" },
				areaStyle: {
					color: {
						type: "linear",
						x: 0, y: 0, x2: 0, y2: 1,
						colorStops: [
							{ offset: 0, color: "rgba(59, 130, 246, 0.4)" },
							{ offset: 1, color: "rgba(59, 130, 246, 0.02)" }
						]
					}
				}
			}]
		};
	}
};
