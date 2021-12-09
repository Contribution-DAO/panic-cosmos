import { Component, Host, h, State, Listen } from '@stencil/core';
import { BaseChain } from '../../interfaces/chains';
import { SeverityAPI } from '../../utils/severity';
import { ChainsAPI } from '../../utils/chains';
import { pollingFrequency } from '../../utils/constants';
import { DashboardOverviewAPI } from './utils/panic-dashboard-overview.utils';
import { addTitleToSVCSelect, arrayEquals } from '../../utils/helpers';
import { PanicDashboardOverviewInterface } from './panic-dashboard-overview.interface';
import { FilterState } from '../../interfaces/filterState';
import { FilterStateAPI } from '../../utils/filterState';

@Component({
  tag: 'panic-dashboard-overview',
  styleUrl: 'panic-dashboard-overview.scss'
})
export class PanicDashboardOverview implements PanicDashboardOverviewInterface {

  @State() baseChains: BaseChain[] = [];
  _filterStates: FilterState[] = [];
  _updater: number;
  _updateFrequency: number = pollingFrequency;

  async componentWillLoad() {
    try {
      this.baseChains = await ChainsAPI.getBaseChains();
      this._filterStates = FilterStateAPI.getFilterStates(this.baseChains);
      this.reRenderAction();

      this._updater = window.setInterval(async () => {
        this.reRenderAction();
      }, this._updateFrequency);
    } catch (error: any) {
      console.error(error);
    }
  }

  async reRenderAction() {
    this.baseChains = await ChainsAPI.updateBaseChainsWithAlerts(this.baseChains);
  }

  async componentDidLoad() {
    // Add text title to chain filter and severity filter.
    for (const baseChain of this.baseChains) {
      // Chain Filter text-placeholder (Chains).
      addTitleToSVCSelect(`${baseChain.name}_chain-filter`, 'Chains')
      // Severity Filter text-placeholder (Severity).
      addTitleToSVCSelect(`${baseChain.name}_severity-filter`, 'Severity')
    }
  }

  @Listen('filter-changed')
  async filterChanged(event: CustomEvent) {
    try {
      const baseChainName: string = event.detail['base-chain-name'];
      const selectedChains: string[] = event.detail['selected-chains'].split(',');

      // Remove empty string element from array if no chains are selected.
      if (selectedChains.length > 0 && selectedChains[0] === '') {
        selectedChains.pop();
      }

      // Get base chain which contains the altered filters.
      const baseChain: BaseChain = this.baseChains.find(baseChain => baseChain.name === baseChainName);

      // Update active chain if chain filter was changed.
      if (!arrayEquals(ChainsAPI.getChainFilterValue(baseChain.chains), selectedChains)) {
        this.baseChains = ChainsAPI.updateActiveChainsInBaseChain(this.baseChains, baseChainName, selectedChains);
      } else {
        const selectedSeverities = event.detail['alerts-severity'].split(',');

        // Get filter state which contains the altered filters.
        const filterState: FilterState = FilterStateAPI.getFilterState(baseChainName, this._filterStates);

        // Remove empty string element from array if no alerts are selected.
        if (selectedSeverities.length > 0 && selectedSeverities[0] === '') {
          selectedSeverities.pop();
        }

        // Update severities shown if severity filter was changed.
        if (!arrayEquals(SeverityAPI.getSeverityFilterValue(filterState.selectedSeverities, true), selectedSeverities)) {
          if (selectedSeverities.length > 0) {
            filterState.selectedSeverities = selectedSeverities;
          } else {
            filterState.selectedSeverities = SeverityAPI.getAllSeverityValues(true);
          }

          // This is done to re-render since the above does not.
          this.reRenderAction();
        }
      }
    } catch (error: any) {
      console.error(error);
    }
  }

  // Used to keep track of the last clicked column index and the order of the
  // sorted column within each data table (and base chain since correlated).
  @Listen("svcDataTable__lastClickedColumnIndexEvent")
  setDataTableProperties(e: CustomEvent) {
    // Get base chain which contains the altered ordering/sorting.
    const baseChain: BaseChain = this.baseChains.find(baseChain => baseChain.name === e.target['id']);
    // Get filter state which contains the altered filters.
    const filterState: FilterState = FilterStateAPI.getFilterState(baseChain.name, this._filterStates);

    filterState.lastClickedColumnIndex = e.detail.index;
    filterState.ordering = e.detail.ordering;
  }

  disconnectedCallback() {
    window.clearInterval(this._updater);
  }

  render() {
    return (
      <Host>
        <h1 class='panic-dashboard-overview__title'>DASHBOARD OVERVIEW</h1>
        {this.baseChains.map((baseChain) =>
          <svc-surface label={baseChain.name}>
            <svc-filter event-name="filter-changed" debounce={100}>
              <svc-card class="panic-dashboard-overview__chain-card">
                <div slot='content' id='expanded'>
                  <input name='base-chain-name' value={baseChain.name} hidden />

                  <div class="panic-dashboard-overview__chain-filter-container">
                    {/* Chain filter */}
                    <svc-select
                      name="selected-chains"
                      id={`${baseChain.name}_chain-filter`}
                      multiple={true}
                      value={ChainsAPI.getChainFilterValue(baseChain.chains)}
                      header="Select chains"
                      placeholder="All"
                      options={DashboardOverviewAPI.getChainFilterOptionsFromBaseChain(baseChain)}>
                    </svc-select>
                  </div>

                  <div class='panic-dashboard-overview__slots'>
                    {/* A normal pie chart with the data is shown if there are any alerts. Otherwise,
                      A green pie chart is shown with no text and without a tooltip */}
                    <div class="panic-dashboard-overview__pie-chart">
                      {DashboardOverviewAPI.getPieChartJSX(baseChain)}
                    </div>

                    <div class="panic-dashboard-overview__data-table-container">
                      <div>
                        {/* Severity filter */}
                        <svc-select
                          name="alerts-severity"
                          id={`${baseChain.name}_severity-filter`}
                          multiple={true}
                          value={SeverityAPI.getSeverityFilterValue(FilterStateAPI.getFilterState(baseChain.name, this._filterStates).selectedSeverities, true)}
                          header="Select severities"
                          placeholder="All"
                          options={SeverityAPI.getSeverityFilterOptions(true)}>
                        </svc-select>

                        {/* Data table */}
                        {DashboardOverviewAPI.getDataTableJSX(baseChain, FilterStateAPI.getFilterState(baseChain.name, this._filterStates))}
                      </div>
                    </div>
                  </div>
                </div>
              </svc-card>
            </svc-filter>
            <svc-label color="dark" position="start" class="panic-dashboard-overview__info-message">This section displays only warning, critical and error alerts. For a full report, check <svc-anchor label={"Alerts Overview."} url={"#alerts-overview"} /> </svc-label>

          </svc-surface>
        )}
      </Host >
    );
  }
}