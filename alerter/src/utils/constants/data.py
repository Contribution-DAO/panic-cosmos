VALID_CHAINLINK_SOURCES = ['prometheus']
RAW_TO_TRANSFORMED_CHAINLINK_METRICS = {
    'head_tracker_current_head': 'current_height',
    'head_tracker_heads_received_total': 'total_block_headers_received',
    'max_unconfirmed_blocks': 'max_pending_tx_delay',
    'process_start_time_seconds': 'process_start_time_seconds',
    'tx_manager_num_gas_bumps_total': 'total_gas_bumps',
    'tx_manager_gas_bump_exceeds_limit_total': 'total_gas_bumps_exceeds_limit',
    'unconfirmed_transactions': 'no_of_unconfirmed_txs',
    'gas_updater_set_gas_price': 'current_gas_price_info',
    'eth_balance': 'eth_balance_info',
    'run_status_update_total_errors': 'total_errored_job_runs',
}
INT_CHAINLINK_METRICS = ['current_height',
                         'total_block_headers_received',
                         'max_pending_tx_delay', 'total_gas_bumps',
                         'total_gas_bumps_exceeds_limit',
                         'no_of_unconfirmed_txs', 'total_errored_job_runs']
EXPIRE_METRICS = ['process_start_time_seconds',
                  'tx_manager_gas_bump_exceeds_limit_total',
                  'eth_balance_amount_increase']
CHAINLINK_METRICS_TO_STORE = ['head_tracker_current_head',
                              'head_tracker_heads_received_total',
                              'max_unconfirmed_blocks',
                              'process_start_time_seconds',
                              'tx_manager_gas_bump_exceeds_limit_total',
                              'unconfirmed_transactions',
                              'run_status_update_total',
                              'eth_balance_amount',
                              'eth_balance_amount_increase',
                              'invalid_url',
                              'metric_not_found',
                              'node_is_down',
                              'prometheus_is_down']
SYSTEM_METRICS_TO_STORE = ['open_file_descriptors',
                           'system_cpu_usage',
                           'system_storage_usage',
                           'system_ram_usage',
                           'system_is_down']
CHAINLINK_CONTRACT_METRICS_TO_STORE = ['price_feed_not_observed',
                                       'price_feed_deviation',
                                       'consensus_failure']
EVM_METRICS_TO_STORE = ['evm_node_is_down',
                        'evm_block_syncing_block_height_difference',
                        'evm_block_syncing_no_change_in_block_height']