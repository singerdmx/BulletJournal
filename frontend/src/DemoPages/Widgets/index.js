import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';

// Dashboard Widgets

import WidgetsChartBoxes from "./ChartBoxes/";

// Layout
import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';

const Widgets = ({match}) => (
    <Fragment>
        <AppHeader/>
        <div className="app-main">
            <AppSidebar/>
            <div className="app-main__outer">
                <div className="app-main__inner">

                    {/* Widgets */}

                    <Route path={`${match.url}/dashboard-boxes`} component={WidgetsChartBoxes}/>
                </div>
                <AppFooter/>
            </div>
        </div>

    </Fragment>
);

export default Widgets;