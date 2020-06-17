import React from 'react';
import {Input, Layout, message} from 'antd';
import Myself from '../../features/myself/Myself';
import {connect} from "react-redux";
import {RouteComponentProps, withRouter} from 'react-router';
import {updateSearchPageNo, updateSearchTerm} from "../../features/search/action";
import {IState} from "../../store";

const {Header} = Layout;
const {Search} = Input;

type HeaderProps = {
    updateSearchPageNo: (searchPageNo: number) => void;
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
        this.props.updateSearchPageNo(0);
        this.props.updateSearchTerm(term);
        if (term.length < 3) {
            this.setState({placeHolder: 'Enter at least 3 characters to search'});
            this.props.updateSearchTerm('');
            return;
        }
        message.success('Searching');
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
    term: state.search.term,
});

export default connect(mapStateToProps, {updateSearchPageNo, updateSearchTerm})(withRouter(HeaderLayout));
