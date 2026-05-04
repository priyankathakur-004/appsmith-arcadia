export default {
	qs(params) {
		const parts = Object.entries(params || {})
			.filter(([, v]) => v !== undefined && v !== null && v !== "")
			.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`);
		return parts.length ? `?${parts.join("&")}` : "";
	},

	qsTariffs() {
		return this.qs({
			lseId: Inp_GetTariffs_lseId.text,
			masterTariffId: Inp_GetTariffs_masterTariffId.text,
			zipCode: Inp_GetTariffs_zipCode.text,
			effectiveOn: Inp_GetTariffs_effectiveOn.text,
			customerClasses: Inp_GetTariffs_customerClasses.text,
			serviceTypes: Inp_GetTariffs_serviceTypes.text,
			populateRates: Inp_GetTariffs_populateRates.text,
			populateProperties: Inp_GetTariffs_populateProperties.text,
		});
	},

	qsTariffHistory() {
		return "";
	},

	qsLses() {
		return this.qs({
			searchOn: Inp_GetLses_searchOn.text,
			zipCode: Inp_GetLses_zipCode.text,
			country: Inp_GetLses_country.text,
			ownerships: Inp_GetLses_ownerships.text,
			serviceTypes: Inp_GetLses_serviceTypes.text,
		});
	},

	qsOneLse() {
		return "";
	},

	qsTerritories() {
		return this.qs({
			zipCode: Inp_GetTerritories_zipCode.text,
			country: Inp_GetTerritories_country.text,
			addressString: Inp_GetTerritories_addressString.text,
			lseId: Inp_GetTerritories_lseId.text,
			masterTariffId: Inp_GetTerritories_masterTariffId.text,
			populateLses: Inp_GetTerritories_populateLses.text,
			containsItemType: Inp_GetTerritories_containsItemType.text,
			containsItemValue: Inp_GetTerritories_containsItemValue.text,
		});
	},

	qsOneTerritory() {
		return "";
	},

	qsSeasons() {
		return this.qs({
			lseId: Inp_GetSeasons_lseId.text,
		});
	},

	qsProperties() {
		return this.qs({
			dataType: Inp_GetProperties_dataType.text,
			family: Inp_GetProperties_family.text,
			keySpace: Inp_GetProperties_keySpace.text,
			entityId: Inp_GetProperties_entityId.text,
			entityType: Inp_GetProperties_entityType.text,
			excludeGlobal: Inp_GetProperties_excludeGlobal.text,
		});
	},

	qsOneProperty() {
		return "";
	},

	qsPropertyLookups() {
		return this.qs({
			subKeyName: Inp_GetPropertyLookups_subKeyName.text,
			fromDateTime: Inp_GetPropertyLookups_fromDateTime.text,
			toDateTime: Inp_GetPropertyLookups_toDateTime.text,
		});
	},

	qsPropertyStats() {
		return "";
	},

	normalizeForTable(data) {
		const flatten = (row) => {
			if (!row || typeof row !== "object") return { value: row };
			const out = {};
			for (const [k, v] of Object.entries(row)) {
				if (v === null || v === undefined) out[k] = "";
				else if (typeof v === "object") out[k] = JSON.stringify(v);
				else out[k] = v;
			}
			return out;
		};
		if (!data) return [];
		if (Array.isArray(data)) return data.map(flatten);
		if (Array.isArray(data && data.results)) return data.results.map(flatten);
		if (typeof data === "object") return [flatten(data)];
		return [];
	},
};
