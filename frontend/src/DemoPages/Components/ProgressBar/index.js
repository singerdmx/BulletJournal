import React, {Fragment} from 'react';

import Tabs from 'react-responsive-tabs';

import PageTitle from '../../../Layout/AppMain/PageTitle';

// Examples
import ProgressBarExample from './Examples/Basic/';

const tabsContent = [
    {
        title: 'Basic',
        content: <ProgressBarExample/>
    },
];

function getTabs() {
    return tabsContent.map((tab, index) => ({
        title: tab.title,
        getContent: () => tab.content,
        key: index,
    }));
}

export default class ProgressBarsExamples extends React.Component {

    render() {
        return (
            <Fragment>
                <PageTitle
                    heading="Progress Bar"
                    subheading="You can use the progress bars on their own or in combination with other widgets."
                    icon="pe-7s-filter icon-gradient bg-grow-early"
                />
                <Tabs tabsWrapperClass="body-tabs body-tabs-layout" transform={false} showInkBar={true} items={getTabs()}/>
            </Fragment>
        );
    }
}