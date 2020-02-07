import React, {Fragment} from 'react';

import Tabs from 'react-responsive-tabs';

import PageTitle from '../../../Layout/AppMain/PageTitle';

// Examples
import BasicExample from './Examples/Basic';
import ColorsExample from './Examples/Colors';

const tabsContent = [
    {
        title: 'Basic',
        content: <BasicExample/>
    },
    {
        title: 'Colors',
        content: <ColorsExample/>
    },
];

function getTabs() {
    return tabsContent.map((tab, index) => ({
        title: tab.title,
        getContent: () => tab.content,
        key: index,
    }));
}

export default class WidgetsChartBoxes extends React.Component {

    render() {

        return (
            <Fragment>
                <PageTitle
                    heading="Chart Boxes"
                    subheading="These boxes can be used to show numbers and data in a breautiful user friendly way."
                    icon="pe-7s-star icon-gradient bg-ripe-malin"
                />
                <Tabs tabsWrapperClass="body-tabs body-tabs-layout" transform={false} showInkBar={true} items={getTabs()}/>
            </Fragment>
        );
    }
}