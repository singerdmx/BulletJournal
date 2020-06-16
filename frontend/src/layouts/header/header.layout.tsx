import React from 'react';
import {Input, Layout, message} from 'antd';
import Myself from '../../features/myself/Myself';
import {connect} from "react-redux";
import {RouteComponentProps, withRouter} from 'react-router';
import {updateSearchPageNo} from "../../features/search/action";

const {Header} = Layout;
const {Search} = Input;

type HeaderProps = {
    updateSearchPageNo: (searchPageNo: number) => void;
}

class HeaderLayout extends React.Component<HeaderProps & RouteComponentProps> {
    onSearch = (term: string) => {
        this.props.updateSearchPageNo(0);
        if (term.length === 0) {
            return;
        }
        message.success('Searching');
        this.props.history.push(`/search/${term}`);
    };

    render() {
        return (
            <Header className='header'>
                <div className='search-box'>
                    <Search allowClear={true} placeholder='Search' onSearch={term => this.onSearch(term)}/>
                </div>
                <Myself/>
            </Header>
        );
    }
}

export default connect(null, {updateSearchPageNo})(withRouter(HeaderLayout));
