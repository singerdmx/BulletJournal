import React, {Fragment} from 'react';

import PageTitle from '../../../Layout/AppMain/PageTitle';

// Examples
import PopoversExample from './Examples/Popovers/';
import TooltipsExample from './Examples/Tooltips/';

export default class TooltipsPopoversExample extends React.Component {

    render() {
        return (
            <Fragment>
                <PageTitle
                    heading="Tooltips & Popovers"
                    subheading="These React components are used to add interaction or extra information for your app's content."
                    icon="pe-7s-note2 icon-gradient bg-happy-fisher"
                />
                <TooltipsExample/>
                <PopoversExample/>
            </Fragment>
        );
    }
}