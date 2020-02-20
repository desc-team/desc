import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions/actions';
import RequestNotes from './RequestNotes';

const css = {
    listHeader: {
        fontWeight: 'bold',
        display: 'flex',
        padding: '1rem 2rem',
        borderBottom: '2px #999 solid'
    },

    flexItem: {
        flex: '0 0 25%'
    },
    itemHeader: {
        padding: '1rem 2rem'
    }
};
class RequestRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            row: this.props
        };
        this.updateItemStatus = this.updateItemStatus.bind(this);
    }

    render() {
        return (
            <li>
                <div className="collapsible-header" style={css.itemHeader}>
                    <div style={css.flexItem}>
                        {this.state.row.submittedBy.name.first}{' '}
                        {this.state.row.submittedBy.name.last}
                    </div>
                    <div style={css.flexItem}>{this.state.row.name}</div>
                    <div style={css.flexItem}>{this.state.row.numberOfItems}</div>
                    <div style={css.flexItem}>{this.getDate(this.state.row.createdAt)}</div>
                </div>
                <div className="collapsible-body">
                    <div className="actions">
                        <a
                            href="#!"
                            className="btn-small btn-flat"
                            onClick={() => this.updateItemStatus('approved')}
                        >
                            <i className="material-icons left">check_box</i>
                            Approve
                        </a>
                        <a
                            href="#!"
                            className="btn-small btn-flat"
                            onClick={() => this.updateItemStatus('denied')}
                        >
                            <i className="material-icons left">clear</i>
                            Reject
                        </a>
                        <a
                            href="#!"
                            className="btn-small btn-flat"
                            onClick={() => this.updateItemStatus('wishlist')}
                        >
                            <i className="material-icons left">access_time</i>
                            Wishlist
                        </a>
                    </div>
                    <div>
                        <RequestNotes item={this.state.row} />
                    </div>
                </div>
            </li>
        );
    }

    getDate(createdAt) {
        var date = new Date(createdAt);
        return date.toDateString();
    }

    updateItemStatus(status) {
        var id = this.state.row._id;

        let itemData = {
            itemId: id,
            requestBody: {
                status: status
            }
        };
        this.state.row.updateItemStatus(itemData);
    }
}

RequestRow.propTypes = {
    updateItemStatus: PropTypes.func
};

const mapStateToProps = state => {
    return {
        isAuth: state.isAuth
    };
};

const mapDispatchToProps = dispatch => {
    return {
        updateItemStatus: itemStatusData => dispatch(actions.updateItemStatus(itemStatusData))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(RequestRow);
