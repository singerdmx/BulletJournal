import React, {Fragment} from 'react'

import Tabs from 'react-responsive-tabs';

import PageTitle from '../../../../Layout/AppMain/PageTitle';

// Examples

import FormsDefault from './Examples/FormBasic';
import InputGroups from './Examples/InputGroup/InputGroups';

const tabsContent = [
    {
        title: 'Basic',
        content: <FormsDefault/>
    },
    {
        title: 'Input Groups',
        content: <InputGroups/>
    },
];

function getTabs() {
    return tabsContent.map((tab, index) => ({
        title: tab.title,
        getContent: () => tab.content,
        key: index,
    }));
}

class FormElementsControls extends React.Component {

    render() {
        return (
            <Fragment>
                <PageTitle
                    heading="Form Controls"
                    subheading="Wide selection of forms controls, using the Bootstrap 4 code base, but built with React."
                    icon="pe-7s-display1 icon-gradient bg-premium-dark"
                />
                <Tabs tabsWrapperClass="body-tabs body-tabs-layout" transform={false} showInkBar={true} items={getTabs()}/>
            </Fragment>
        )
    }
}

export default FormElementsControls;



