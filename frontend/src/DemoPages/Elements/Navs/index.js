import React, {Fragment} from 'react';

import Tabs from 'react-responsive-tabs';

import PageTitle from '../../../Layout/AppMain/PageTitle';

// Examples

import NavsVertical from './Examples/NavVertical';
import NavsHorizontal from './Examples/NavHorizontal';

const tabsContent = [
    {
        title: 'Vertical Menus',
        content: <NavsVertical/>
    },
    {
        title: 'Horizontal Menus',
        content: <NavsHorizontal/>
    },
];

function getTabs() {
    return tabsContent.map((tab, index) => ({
        title: tab.title,
        getContent: () => tab.content,
        key: index,
    }));
}

export default class NavigationExample extends React.Component {

    render() {

        return (
            <Fragment>
                <PageTitle
                    heading="Navigation Menus"
                    subheading="Navigation menus are one of the basic building blocks for any web or mobile app."
                    icon="pe-7s-photo-gallery icon-gradient bg-mean-fruit"
                />
                <Tabs tabsWrapperClass="body-tabs body-tabs-layout" transform={false} showInkBar={true} items={getTabs()}/>
            </Fragment>
        );
    }
}