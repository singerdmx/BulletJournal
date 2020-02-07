import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';

// COMPONENTS

// Tabs

import TabExample from './Tabs/';

// Notifications

import NotificationsExamples from './Notifications/';


// Tooltips & Popovers

import TooltipsPopoversExample from './TooltipsPopovers/';

// Modals

import ModalsExample from './Modal/';

// Progress Bar

import ProgressBarsExamples from './ProgressBar/';

// Carousel

import CarouselExample from './Carousel/';

// Maps

import MapsExample from './Maps/';

// Layout

import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';

const Components = ({match}) => (
    <Fragment>
        <AppHeader/>
        <div className="app-main">
            <AppSidebar/>
            <div className="app-main__outer">
                <div className="app-main__inner">
                    {/* Components */}

                    {/* Tabs */}

                    <Route path={`${match.url}/tabs`} component={TabExample}/>

                    {/* Notifications */}

                    <Route path={`${match.url}/notifications`} component={NotificationsExamples}/>

                    {/* Tooltips & Popovers */}

                    <Route path={`${match.url}/tooltips-popovers`} component={TooltipsPopoversExample}/>

                    {/* Progress Bar */}

                    <Route path={`${match.url}/progress-bar`} component={ProgressBarsExamples}/>

                    {/* Carousel */}

                    <Route path={`${match.url}/carousel`} component={CarouselExample}/>

                    {/* Modals */}

                    <Route path={`${match.url}/modals`} component={ModalsExample}/>

                    {/* Maps */}

                    <Route path={`${match.url}/maps`} component={MapsExample}/>

                </div>
                <AppFooter/>
            </div>
        </div>
    </Fragment>
);

export default Components;