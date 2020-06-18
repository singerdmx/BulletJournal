import React from 'react';
import {Input, Layout, message} from 'antd';
import Myself from '../../features/myself/Myself';
import {connect} from "react-redux";
import {RouteComponentProps, withRouter} from 'react-router';
import {updateSearchTerm} from "../../features/search/action";
import {IState} from "../../store";

const {Header} = Layout;
const {Search} = Input;

type HeaderProps = {
    updateSearchTerm: (term: string) => void;
    term: string;
}

type HeaderState = {
    placeHolder: string;
};

class HeaderLayout extends React.Component<HeaderProps & RouteComponentProps, HeaderState> {
    state: HeaderState = {
        placeHolder: 'Search',
    };

    onChange = (e: any) => {
        this.setState({placeHolder: 'Search'});
        this.props.updateSearchTerm(e.target.value);
    };

    onSearch = (term: string) => {
        this.props.updateSearchTerm(term);
        if (term.length < 3) {
            this.setState({placeHolder: 'Enter at least 3 characters to search'});
            this.props.updateSearchTerm('');
            return;
        }
        message.success('Searching', 1);
        this.setState({placeHolder: 'Search'});
        this.props.history.push(`/search/${term}`);
    };

    render() {
        return (
            <Header className='header'>
                <div className='search-box'>
                    <Search value={this.props.term} onChange={e => this.onChange(e)}
                            allowClear={true} placeholder={this.state.placeHolder}
                            onSearch={term => this.onSearch(term)}/>
                </div>
                <Myself/>
            </Header>
        );
    }
}

const mapStateToProps = (state: IState) => ({
    term: state.search.searchTerm,
});

export default connect(mapStateToProps, {updateSearchTerm})(withRouter(HeaderLayout));
