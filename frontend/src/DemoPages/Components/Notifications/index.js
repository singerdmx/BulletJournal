import React, {Fragment} from 'react';

import PageTitle from '../../../Layout/AppMain/PageTitle';

// Examples
import ToastifyAlerts from './Examples/ToastifyAlerts';
import BasicAlerts from './Examples/BasicAlerts';

export default class NotificationsExamples extends React.Component {

    render() {
        return (
            <Fragment>
                <PageTitle
                    heading="Notifications"
                    subheading="Notifications represent one of the best ways to give feedback for various users actions."
                    icon="pe-7s-glasses icon-gradient bg-love-kiss"
                />
                <div className="mbg-3 h-auto pl-0 pr-0 bg-transparent no-border card-header">
                    <div className="card-header-title fsize-2 text-capitalize font-weight-normal">Toastify</div>
                </div>
                <ToastifyAlerts/>
                <div className="mbg-3 h-auto pl-0 pr-0 bg-transparent no-border card-header">
                    <div className="card-header-title fsize-2 text-capitalize font-weight-normal">Basic Bootstrap 4 Alerts</div>
                </div>
                <BasicAlerts/>
            </Fragment>
        );
    }
}