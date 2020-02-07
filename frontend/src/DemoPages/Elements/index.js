import React, {Fragment} from 'react';
import {Route} from 'react-router-dom';

// BUTTONS

// Standard

import ButtonsStandard from './Button/Standard/';

// DROPDOWNS

import DropdownExamples from './Dropdowns/';

// BADGES & LABELS

import BadgesLabels from './BadgesLabels/';

// ICONS

import IconsExamples from './Icons/';

// CARDS

import CardsExamples from './Cards/';

// LIST GROUP

import ListGroupExample from '../Elements/ListGroup/';

// NAVIGATION

import NavigationExample from './Navs/';

// UTILITIES

import UtilitiesExamples from '../Elements/Utilities/';

// Layout
import AppHeader from '../../Layout/AppHeader/';
import AppSidebar from '../../Layout/AppSidebar/';
import AppFooter from '../../Layout/AppFooter/';

const Elements = ({match}) => (
    <Fragment>
        <AppHeader/>
        <div className="app-main">
            <AppSidebar/>
            <div className="app-main__outer">
                <div className="app-main__inner">

                    {/* Buttons */}

                    <Route path={`${match.url}/buttons-standard`} component={ButtonsStandard}/>

                    {/* Dropdowns */}

                    <Route path={`${match.url}/dropdowns`} component={DropdownExamples}/>

                    {/* Badges & Labels */}

                    <Route path={`${match.url}/badges-labels`} component={BadgesLabels}/>

                    {/* Icons */}

                    <Route path={`${match.url}/icons`} component={IconsExamples}/>

                    {/* Cards */}

                    <Route path={`${match.url}/cards`} component={CardsExamples}/>

                    {/* List Group */}

                    <Route path={`${match.url}/list-group`} component={ListGroupExample}/>

                    {/* Navs */}

                    <Route path={`${match.url}/navigation`} component={NavigationExample}/>

                    {/* Utilities */}

                    <Route path={`${match.url}/utilities`} component={UtilitiesExamples}/>
                </div>
                <AppFooter/>
            </div>
        </div>
    </Fragment>
);

export default Elements;