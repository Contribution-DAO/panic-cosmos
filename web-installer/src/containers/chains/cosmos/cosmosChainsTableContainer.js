import { connect } from 'react-redux';
import CosmosChainsTable from '../../../components/chains/cosmos/tables/cosmosChainsTable';
import { removeChainCosmos, loadConfigCosmos } from '../../../redux/actions/cosmosChainsActions';
import { changePage } from '../../../redux/actions/pageActions';

// We will need the configured state of the cosmos nodes
const mapStateToProps = (state) => ({
  config: state.CosmosChainsReducer,
});

// Functions required are to change page, remove the chain details
// later to also load the chain details.
function mapDispatchToProps(dispatch) {
  return {
    pageChanger: (page) => dispatch(changePage(page)),
    removeChainDetails: (details) => dispatch(removeChainCosmos(details)),
    loadConfigDetails: (details) => dispatch(loadConfigCosmos(details)),
  };
}

const CosmosChainsTableContainer = connect(
  mapStateToProps,
  mapDispatchToProps,
)(CosmosChainsTable);

export default CosmosChainsTableContainer;
