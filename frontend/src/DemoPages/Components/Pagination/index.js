import React, {Fragment} from 'react';

import Tabs from 'react-responsive-tabs';

import PageTitle from '../../../Layout/AppMain/PageTitle';

// Examples
import BasicPagination from './Examples/Basic';
import DynamicPagination from './Examples/Dynamic';

const tabsContent = [
    {
        title: 'Dynamic Pagination',
        content: <DynamicPagination/>
    },
    {
        title: 'Basic',
        content: <BasicPagination/>
    },
];

function getTabs() {
    return tabsContent.map((tab, index) => ({
        title: tab.title,
        getContent: () => tab.content,
        key: index,
    }));
}

export default class PaginationExamples extends React.Component {

    render() {

        return (
            <Fragment>
                <PageTitle
                    heading="Pagination"
                    subheading="Basic and dynamic pagination for use in your next awesome application."
                    icon="pe-7s-notebook icon-gradient bg-mixed-hopes"
                />
                <Tabs tabsWrapperClass="body-tabs body-tabs-layout" transform={false} showInkBar={true} items={getTabs()}/>
            </Fragment>
        );
    }
}