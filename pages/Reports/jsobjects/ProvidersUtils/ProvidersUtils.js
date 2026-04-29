export default {
	
	normalizeProviders() {
			const providers = APi_ListProviders.data?.providers;

			if (!Array.isArray(providers)) return [];

			return providers.map(p => ({
				// 🔹 Basic Info
				ProviderId: p.id,
				ProviderName: p.name,
				Country: p.country,
				Region: p.region,

				// 🔹 Core Support
				IsHistorySupported: p.isHistorySupported,
				IsThirdPartyPortalSupported: p.isThirdPartyPortalSupported,
				IsInstantIntervalsSupported: p.isInstantIntervalsSupported,

				// 🔹 Statements
				StatementsSupported: p.statements?.isSupported,
				StatementsHistorySupported: p.statements?.isHistorySupported,
				StatementsWebNavigationSupported: p.statements?.isWebNavigationSupported,
				StatementsServiceTypes: (p.statements?.serviceTypes || []).join(", "),

				// 🔹 Intervals
				IntervalsSupported: p.intervals?.isSupported,
				IntervalsHistorySupported: p.intervals?.isHistorySupported,
				IntervalsInstantSupported: p.intervals?.isInstantIntervalsSupported,
				IntervalsServiceTypes: (p.intervals?.serviceTypes || []).join(", "),

				// 🔹 MFA (keep minimal but useful)
				MFASupported: p.multiFactorAuthentication?.isSupported,
				MFAOptOutSupported: p.multiFactorAuthentication?.isOptOutSupported
			}));
	}

};
