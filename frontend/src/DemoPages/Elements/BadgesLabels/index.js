import React, {Fragment} from 'react';

import Tabs from 'react-responsive-tabs';

import PageTitle from '../../../Layout/AppMain/PageTitle';

// Examples
import BadgesExamples from './Examples/badges';
import LabelsExamples from './Examples/labels';

const tabsContent = [
    {
        title: 'Badges',
        content: <BadgesExamples/>
    },
    {
        title: 'Labels',
        content: <LabelsExamples/>
    },
];

function getTabs() {
    return tabsContent.map((tab, index) => ({
        title: tab.title,
        getContent: () => tab.content,
        key: index,
    }));
}

export default class BadgesLabels extends React.Component {

    render() {

        return (
            <Fragment>
                <PageTitle
                    heading="Badges & Labels"
                    subheading="Badges and labels are used to offer extra small pieces of info for your content."
                    icon="pe-7s-voicemail icon-gradient bg-arielle-smile"
                />
                <Tabs tabsWrapperClass="body-tabs body-tabs-layout" transform={false} showInkBar={true} items={getTabs()}/>
            </Fragment>
        );
    }
}