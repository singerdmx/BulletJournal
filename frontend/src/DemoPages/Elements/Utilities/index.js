import React, {Fragment} from 'react';

import PageTitle from '../../../Layout/AppMain/PageTitle';

// Examples
import UtilitiesColors from './Examples/ColorStates';
import UtilitiesHelpers from './Examples/Helpers';
import UtilitiesAnimations from './Examples/Animations';

export default class UtilitiesExamples extends React.Component {

    render() {

        return (
            <Fragment>
                <PageTitle
                    heading="Utilities"
                    subheading="These are helpers that speed up the dev time for various components and effects."
                    icon="pe-7s-wristwatch icon-gradient bg-deep-blue"
                />
                <UtilitiesAnimations/>
                <UtilitiesColors/>
                <UtilitiesHelpers/>
            </Fragment>
        );
    }
}