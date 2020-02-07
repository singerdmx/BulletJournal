import React, {Fragment} from 'react'

import Tabs from 'react-responsive-tabs';

import PageTitle from '../../../../Layout/AppMain/PageTitle';

// Examples

import FormsFeedback from './Examples/Feedback';

const tabsContent = [
    {
        title: 'Feedback',
        content: <FormsFeedback/>
    },

];

function getTabs() {
    return tabsContent.map((tab, index) => ({
        title: tab.title,
        getContent: () => tab.content,
        key: index,
    }));
}

class FormElementsValidation extends React.Component {

    render() {
        return (
            <Fragment>
                <PageTitle
                    heading="Form Validation"
                    subheading="Inline validation is very easy to implement using the ArchitectUI."
                    icon="lnr-picture text-danger"
                />
                <Tabs tabsWrapperClass="body-tabs body-tabs-layout" transform={false} showInkBar={true} items={getTabs()}/>
            </Fragment>
        )
    }
}

export default FormElementsValidation;



