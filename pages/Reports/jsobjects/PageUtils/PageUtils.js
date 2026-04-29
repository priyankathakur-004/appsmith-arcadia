export default {
  clearAccountFilters() {
    resetWidget('AccClientSelect');
    resetWidget('AccStatusSelect');
    resetWidget('AccPageSize');
    storeValue('accData', null);
  },
  clearCredentialFilters() {
    resetWidget('CredClientSelect');
    resetWidget('CredStatusSelect');
    resetWidget('CredCorrelationCheck');
    resetWidget('CredPageSize');
    storeValue('credData', null);
  },
  clearProviderFilters() {
    resetWidget('ProvVendorInput');
    resetWidget('ProvPageSize');
    storeValue('provData', null);
  }
}