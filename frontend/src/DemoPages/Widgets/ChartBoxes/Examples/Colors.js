import React, {Component, Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Row, Col,
    Button,
    UncontrolledButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    Nav,
    NavItem,
    NavLink
} from 'reactstrap';

import {
    AreaChart, Area, LineChart, Line,
    ResponsiveContainer,
    BarChart, Bar,
    ComposedChart,
    CartesianGrid
} from 'recharts';

import {
    faAngleUp,
    faAngleDown,
    faArrowLeft,
    faArrowRight,
    faEllipsisH,

} from '@fortawesome/free-solid-svg-icons';

import bg1 from '../../../../assets/utils/images/dropdown-header/abstract1.jpg';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

const data = [
    {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
    {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
    {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
    {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
    {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
    {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
    {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
    {name: 'Page C', uv: 2000, pv: 6800, amt: 2290},
    {name: 'Page D', uv: 4780, pv: 7908, amt: 2000},
    {name: 'Page E', uv: 2890, pv: 9800, amt: 2181},
    {name: 'Page F', uv: 1390, pv: 3800, amt: 1500},
    {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];

const data2 = [
    {name: 'Page A', uv: 5400, pv: 5240, amt: 1240},
    {name: 'Page B', uv: 7300, pv: 4139, amt: 3221},
    {name: 'Page C', uv: 8200, pv: 7980, amt: 5229},
    {name: 'Page D', uv: 6278, pv: 4390, amt: 3200},
    {name: 'Page E', uv: 3189, pv: 7480, amt: 6218},
    {name: 'Page D', uv: 9478, pv: 6790, amt: 2200},
    {name: 'Page E', uv: 1289, pv: 1980, amt: 7218},
    {name: 'Page F', uv: 3139, pv: 2380, amt: 5150},
    {name: 'Page G', uv: 5349, pv: 3430, amt: 3210},
];

class BasicExample extends Component {

    render() {
        return (
            <Fragment>
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="TabsAnimation"
                    transitionAppear={true}
                    transitionAppearTimeout={0}
                    transitionEnter={false}
                    transitionLeave={false}>
                    <div>
                        <Row>
                            <Col md="4">
                                <div className="card mb-3 bg-primary widget-chart text-white card-border">
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg bg-white opacity-1"/>
                                        <i className="lnr-cog text-white"/>
                                    </div>
                                    <div className="widget-numbers">
                                        45.8k
                                    </div>
                                    <div className="widget-subheading">
                                        Total Views
                                    </div>
                                    <div className="widget-description text-success">
                                        <FontAwesomeIcon icon={faAngleUp}/>
                                        <span className="pl-1">175.5%</span>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 bg-success widget-chart text-white card-border">
                                    <div className="widget-chart-actions">
                                        <UncontrolledButtonDropdown>
                                            <DropdownToggle color="link" className="text-white">
                                                <FontAwesomeIcon icon={faEllipsisH}/>
                                            </DropdownToggle>
                                            <DropdownMenu className="dropdown-menu-lg dropdown-menu-right">
                                                <Nav vertical>
                                                    <NavItem className="nav-item-header">
                                                        Activity
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink href="javascript:void(0);">
                                                            Chat
                                                            <div className="ml-auto badge badge-pill badge-info">8</div>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink href="javascript:void(0);">Recover Password</NavLink>
                                                    </NavItem>
                                                    <NavItem className="nav-item-header">
                                                        My Account
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink href="javascript:void(0);">
                                                            Settings
                                                            <div className="ml-auto badge badge-success">New</div>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink href="javascript:void(0);">
                                                            Messages
                                                            <div className="ml-auto badge badge-warning">512</div>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink href="javascript:void(0);">
                                                            Logs
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem className="nav-item-divider"/>
                                                    <NavItem className="nav-item-btn">
                                                        <Button size="sm" className="btn-wide btn-shadow"
                                                                color="danger">
                                                            Cancel
                                                        </Button>
                                                    </NavItem>
                                                </Nav>
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                    </div>
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg bg-white opacity-10"/>
                                        <i className="lnr-screen text-success"/>
                                    </div>
                                    <div className="widget-numbers">
                                        17.2k
                                    </div>
                                    <div className="widget-subheading">
                                        Profiles
                                    </div>
                                    <div className="widget-description text-white">
                                        <span className="pr-1">175.5%</span>
                                        <FontAwesomeIcon icon={faArrowLeft}/>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 bg-warning widget-chart text-white card-border">
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg bg-white opacity-2"/>
                                        <i className="lnr-laptop-phone text-white"/>
                                    </div>
                                    <div className="widget-numbers">
                                        5.82k
                                    </div>
                                    <div className="widget-subheading">
                                        Reports Submitted
                                    </div>
                                    <div className="widget-description text-white">
                                        <span className="pl-1">54.1%</span>
                                        <FontAwesomeIcon icon={faAngleUp}/>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 bg-focus widget-chart text-white card-border">
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg bg-info opacity-5"/>
                                        <i className="lnr-graduation-hat text-white"/>
                                    </div>
                                    <div className="widget-numbers">
                                        63.2k
                                    </div>
                                    <div className="widget-subheading">
                                        Bugs Fixed
                                    </div>
                                    <div className="widget-description text-info">
                                        <FontAwesomeIcon icon={faArrowRight}/>
                                        <span className="pl-1">175.5%</span>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 bg-danger widget-chart text-white card-border">
                                    <div className="icon-wrapper rounded">
                                        <div className="icon-wrapper-bg bg-white opacity-2"/>
                                        <i className="pe-7s-eyedropper text-white"/>
                                    </div>
                                    <div className="widget-numbers">
                                        5.82k
                                    </div>
                                    <div className="widget-subheading">
                                        Reports Submitted
                                    </div>
                                    <div className="widget-description text-white">
                                        <span className="pl-1">54.1%</span>
                                        <FontAwesomeIcon icon={faAngleUp}/>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 bg-info widget-chart text-white card-border">
                                    <div className="icon-wrapper rounded">
                                        <div className="icon-wrapper-bg bg-focus opacity-5"/>
                                        <i className="pe-7s-photo text-white"/>
                                    </div>
                                    <div className="widget-numbers">
                                        63.2k
                                    </div>
                                    <div className="widget-subheading">
                                        Bugs Fixed
                                    </div>
                                    <div className="widget-description text-white">
                                        <FontAwesomeIcon icon={faArrowRight}/>
                                        <span className="pl-1">175.5%</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className="divider mt-0" style={{marginBottom: '30px'}}/>
                        <Row>
                            <Col md="4">
                                <div className="card mb-3 bg-arielle-smile widget-chart text-white card-border">
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg bg-white opacity-10"/>
                                        <i className="lnr-cog icon-gradient bg-arielle-smile"/>
                                    </div>
                                    <div className="widget-numbers">
                                        45.8k
                                    </div>
                                    <div className="widget-subheading">
                                        Total Views
                                    </div>
                                    <div className="widget-description text-dark">
                                        <FontAwesomeIcon icon={faAngleUp}/>
                                        <span className="pl-1">175.5%</span>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 bg-warm-flame widget-chart text-white card-border">
                                    <div className="icon-wrapper rounded">
                                        <div className="icon-wrapper-bg bg-white opacity-10"/>
                                        <i className="lnr-screen icon-gradient bg-warm-flame"/>
                                    </div>
                                    <div className="widget-numbers">
                                        17.2k
                                    </div>
                                    <div className="widget-subheading">
                                        Profiles
                                    </div>
                                    <div className="widget-description text-white">
                                        <span className="pr-1">175.5%</span>
                                        <FontAwesomeIcon icon={faArrowLeft}/>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 bg-ripe-malin widget-chart text-white card-border">
                                    <div className="icon-wrapper rounded">
                                        <div className="icon-wrapper-bg bg-white opacity-2"/>
                                        <i className="lnr-laptop-phone text-white"/>
                                    </div>
                                    <div className="widget-numbers">
                                        5.82k
                                    </div>
                                    <div className="widget-subheading">
                                        Reports Submitted
                                    </div>
                                    <div className="widget-description text-white">
                                        <span className="pl-1">54.1%</span>
                                        <FontAwesomeIcon icon={faAngleUp}/>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 bg-mixed-hopes widget-chart text-white card-border">
                                    <div className="icon-wrapper rounded">
                                        <div className="icon-wrapper-bg bg-dark opacity-9"/>
                                        <i className="lnr-graduation-hat text-white"/>
                                    </div>
                                    <div className="widget-numbers">
                                        63.2k
                                    </div>
                                    <div className="widget-subheading">
                                        Bugs Fixed
                                    </div>
                                    <div className="widget-description text-dark">
                                        <FontAwesomeIcon icon={faArrowRight}/>
                                        <span className="pl-1">175.5%</span>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 bg-grow-early widget-chart text-white card-border">
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg bg-white opacity-2"/>
                                        <i className="lnr-laptop-phone text-white"/>
                                    </div>
                                    <div className="widget-numbers">
                                        5.82k
                                    </div>
                                    <div className="widget-subheading">
                                        Reports Submitted
                                    </div>
                                    <div className="widget-description text-white">
                                        <span className="pl-1">54.1%</span>
                                        <FontAwesomeIcon icon={faAngleUp}/>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 bg-plum-plate widget-chart text-white card-border">
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg bg-dark opacity-9"/>
                                        <i className="lnr-graduation-hat text-white"/>
                                    </div>
                                    <div className="widget-numbers">
                                        63.2k
                                    </div>
                                    <div className="widget-subheading">
                                        Bugs Fixed
                                    </div>
                                    <div className="widget-description text-white opacity-8">
                                        <FontAwesomeIcon icon={faArrowRight}/>
                                        <span className="pl-1">175.5%</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className="divider mt-0" style={{marginBottom: '30px'}}/>
                        <Row>
                            <Col md="4">
                                <div className="card mb-3 bg-love-kiss widget-chart card-border">
                                    <div className="widget-chart-content text-white">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-white opacity-4"/>
                                            <i className="lnr-cog"/>
                                        </div>
                                        <div className="widget-numbers">
                                            45.8k
                                        </div>
                                        <div className="widget-subheading">
                                            Total Views
                                        </div>
                                        <div className="widget-description">
                                            <FontAwesomeIcon className="text-white opacity-5" icon={faAngleUp}/>
                                            <span className="text-white">175.5%</span>
                                        </div>
                                    </div>
                                    <div className="widget-chart-wrapper">
                                        <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                            <LineChart data={data}
                                                       margin={{top: 0, right: 5, left: 5, bottom: 0}}>
                                                <Line type='monotone' dataKey='pv' stroke='#ffffff' strokeWidth={3}/>
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 bg-premium-dark widget-chart card-border">
                                    <div className="widget-chart-content text-white">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-success opacity-8"/>
                                            <i className="lnr-screen"/>
                                        </div>
                                        <div className="widget-numbers">
                                            17.2k
                                        </div>
                                        <div className="widget-subheading">
                                            Profiles
                                        </div>
                                        <div className="widget-description text-warning">
                                            <span className="pr-1">175.5%</span>
                                            <FontAwesomeIcon icon={faArrowLeft}/>
                                        </div>
                                    </div>
                                    <div className="widget-chart-wrapper opacity-4">
                                        <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                            <AreaChart data={data}
                                                       margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                                                <Area type='monotoneX' dataKey='uv' stroke='#fd7e14' fill='#ffb87d'/>
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart bg-happy-green card-border">
                                    <div className="widget-chart-content text-white">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-white opacity-10"/>
                                            <i className="lnr-laptop-phone text-success"/>
                                        </div>
                                        <div className="widget-numbers">
                                            5.82k
                                        </div>
                                        <div className="widget-subheading">
                                            Reports Submitted
                                        </div>
                                        <div className="widget-description text-white opacity-8">
                                            <FontAwesomeIcon icon={faAngleDown}/>
                                            <span className="pl-1">54.1%</span>
                                        </div>
                                    </div>
                                    <div className="widget-chart-wrapper">
                                        <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                            <BarChart data={data}>
                                                <Bar dataKey='uv' fill='#81a4ff' stroke='#3f6ad8' strokeWidth={2}/>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart bg-sunny-morning card-border">
                                    <div className="widget-chart-content text-white">
                                        <div className="icon-wrapper rounded">
                                            <div className="icon-wrapper-bg bg-white opacity-3"/>
                                            <i className="lnr-graduation-hat text-dark"/>
                                        </div>
                                        <div className="widget-numbers">
                                            63.2k
                                        </div>
                                        <div className="widget-subheading">
                                            Bugs Fixed
                                        </div>
                                        <div className="widget-description text-white opacity-6">
                                            <FontAwesomeIcon className="text-dark" icon={faArrowRight}/>
                                            <span className="pl-1">175.5%</span>
                                        </div>
                                    </div>
                                    <div className="widget-chart-wrapper opacity-5">
                                        <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                            <AreaChart data={data}
                                                       margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                                                <Area type='stepAfter' dataKey='uv' stroke='#bb3812' fill='#e9643d'/>
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart bg-love-kiss card-border">
                                    <div className="widget-chart-content text-white">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-white opacity-10"/>
                                            <i className="lnr-laptop-phone text-success"/>
                                        </div>
                                        <div className="widget-numbers">
                                            232
                                        </div>
                                        <div className="widget-subheading">
                                            Reports Submitted
                                        </div>
                                        <div className="widget-description text-white opacity-8">
                                            <FontAwesomeIcon icon={faAngleDown}/>
                                            <span className="pl-1">54.1%</span>
                                        </div>
                                    </div>
                                    <div className="widget-chart-wrapper">
                                        <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                            <BarChart data={data}>
                                                <Bar dataKey='uv' fill='#81a4ff' stroke='#3f6ad8' strokeWidth={2}/>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart bg-night-fade card-border">
                                    <div className="widget-chart-content text-white">
                                        <div className="icon-wrapper rounded">
                                            <div className="icon-wrapper-bg bg-white opacity-3"/>
                                            <i className="lnr-graduation-hat text-dark"/>
                                        </div>
                                        <div className="widget-numbers">
                                            63.2k
                                        </div>
                                        <div className="widget-subheading">
                                            Bugs Fixed
                                        </div>
                                        <div className="widget-description text-white opacity-6">
                                            <FontAwesomeIcon className="text-dark" icon={faArrowRight}/>
                                            <span className="pl-1">175.5%</span>
                                        </div>
                                    </div>
                                    <div className="widget-chart-wrapper opacity-5">
                                        <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                            <AreaChart data={data}
                                                       margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                                                <Area type='stepAfter' dataKey='uv' stroke='#bb3812' fill='#e9643d'/>
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className="divider mt-0" style={{marginBottom: '30px'}}/>
                        <Row>
                            <Col md="4">
                                <div className="card mb-3 widget-chart bg-mean-fruit card-border">
                                    <div className="widget-chart-content text-white">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-white opacity-3"/>
                                            <i className="lnr-cog text-white"/>
                                        </div>
                                        <div className="widget-numbers">
                                            45.8k
                                        </div>
                                        <div className="widget-subheading">
                                            Total Views
                                        </div>
                                        <div className="widget-description text-dark">
                                            <FontAwesomeIcon icon={faAngleUp}/>
                                            <span className="pl-1">175.5%</span>
                                        </div>
                                    </div>
                                    <div className="widget-chart-wrapper chart-wrapper-relative">
                                        <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                            <LineChart data={data}
                                                       margin={{top: 5, right: 5, left: 5, bottom: 0}}>
                                                <Line type='monotone' dataKey='pv' stroke='#ffffff'
                                                      strokeWidth={3}/>
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart bg-tempting-azure card-border">
                                    <div className="widget-chart-content text-white">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-white opacity-3"/>
                                            <i className="lnr-screen text-success"/>
                                        </div>
                                        <div className="widget-numbers">
                                            17.2k
                                        </div>
                                        <div className="widget-subheading">
                                            Profiles
                                        </div>
                                        <div className="widget-description text-dark">
                                            <span className="pr-1">175.5%</span>
                                            <FontAwesomeIcon icon={faArrowLeft}/>
                                        </div>
                                    </div>
                                    <div className="widget-chart-wrapper chart-wrapper-relative">
                                        <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                            <AreaChart data={data}
                                                       margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                                                <Area type='monotoneX' dataKey='uv' stroke='#ffffff' fill='rgba(255,255,255,.2)'/>
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart bg-amy-crisp card-border">
                                    <div className="widget-chart-content text-white">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-white opacity-3"/>
                                            <i className="lnr-laptop-phone text-danger"/>
                                        </div>
                                        <div className="widget-numbers">
                                            5.82k
                                        </div>
                                        <div className="widget-subheading">
                                            Reports Submitted
                                        </div>
                                        <div className="widget-description text-danger">
                                            <FontAwesomeIcon icon={faAngleDown}/>
                                            <span className="pl-1">54.1%</span>
                                        </div>
                                    </div>
                                    <div className="widget-chart-wrapper chart-wrapper-relative">
                                        <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                            <BarChart data={data}>
                                                <Bar dataKey='uv' fill='#81a4ff' stroke='#3f6ad8' strokeWidth={1}/>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart bg-arielle-smile card-border">
                                    <div className="widget-chart-content text-white">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-white opacity-7"/>
                                            <i className="lnr-graduation-hat text-info"/>
                                        </div>
                                        <div className="widget-numbers">
                                            63.2k
                                        </div>
                                        <div className="widget-subheading">
                                            Bugs Fixed
                                        </div>
                                        <div className="widget-description text-white">
                                            <FontAwesomeIcon icon={faArrowRight}/>
                                            <span className="pl-1">175.5%</span>
                                        </div>
                                    </div>
                                    <div className="widget-chart-wrapper chart-wrapper-relative">
                                        <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                            <AreaChart data={data}
                                                       margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                                                <Area type='stepAfter' dataKey='uv' stroke='rgba(255,255,255,.7)' fill='rgba(255,255,255,.5)'/>
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart bg-happy-itmeo card-border">
                                    <div className="widget-chart-content text-white">
                                        <div className="icon-wrapper rounded">
                                            <div className="icon-wrapper-bg bg-white opacity-6"/>
                                            <i className="lnr-heart icon-gradient bg-premium-dark"> </i>
                                        </div>
                                        <div className="widget-numbers">
                                            5.82k
                                        </div>
                                        <div className="widget-subheading">
                                            Active Social Profiles
                                        </div>
                                        <div className="widget-description">
                                            Down by
                                            <span className="text-white pl-1 pr-1">
                                                <FontAwesomeIcon icon={faAngleDown}/>
                                                <span className="pl-1">54.1%</span>
                                            </span>
                                             from 30 days ago
                                        </div>
                                    </div>
                                    <div className="widget-chart-wrapper chart-wrapper-relative">
                                        <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                            <LineChart data={data2}
                                                       margin={{top: 0, right: 5, left: 5, bottom: 0}}>
                                                <Line type="monotone" dataKey="pv" stroke="#ffffff" strokeWidth={2}/>
                                                <Line type="monotone" dataKey="uv" stroke="rgba(255,255,255,.7)" strokeWidth={2}/>
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart bg-strong-bliss card-border">
                                    <div className="widget-chart-content text-white">
                                        <div className="icon-wrapper rounded">
                                            <div className="icon-wrapper-bg bg-white opacity-4"/>
                                            <i className="lnr-graduation-hat text-white"/>
                                        </div>
                                        <div className="widget-numbers">
                                            1.5M
                                        </div>
                                        <div className="widget-subheading">
                                            Bugs Fixed
                                        </div>
                                        <div className="widget-description text-white">
                                            Down by
                                            <span className="text-white pl-1 pr-1 opacity-8">
                                                <FontAwesomeIcon icon={faAngleDown}/>
                                                <span className="pl-1">54.1%</span>
                                            </span>
                                             from 30 days ago
                                        </div>
                                    </div>
                                    <div className="widget-chart-wrapper chart-wrapper-relative">
                                        <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                            <ComposedChart data={data2}>
                                                <CartesianGrid stroke="rgba(255,255,255,.1)"/>
                                                <Area type="monotone" dataKey="amt" fill="rgba(255,255,255,.4)" stroke="transparent"/>
                                                <Bar dataKey="pv" barSize={5} fill="rgba(255,255,255,.9)"/>
                                                <Line type="monotone" dataKey="uv" stroke="#ffffff"/>
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
}

export default BasicExample;
