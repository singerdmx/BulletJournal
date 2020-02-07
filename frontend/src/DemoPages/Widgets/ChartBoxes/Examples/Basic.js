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
    NavLink,
    Progress
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
                                <div className="card mb-3 widget-chart">
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg bg-primary"/>
                                        <i className="lnr-cog text-primary"/>
                                    </div>
                                    <div className="widget-numbers">
                                       46
                                    </div>
                                    <div className="widget-subheading">
                                        Total Views
                                    </div>
                                    <div className="widget-description text-success">
                                        <FontAwesomeIcon icon={faAngleUp}/>
                                        <span className="pl-1">
                                    176
                                    </span>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-chart-actions">
                                        <UncontrolledButtonDropdown>
                                            <DropdownToggle color="link">
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
                                        <div className="icon-wrapper-bg bg-success"/>
                                        <i className="lnr-screen text-success"/>
                                    </div>
                                    <div className="widget-numbers">
                                        17.2
                                    </div>
                                    <div className="widget-subheading">
                                        Profiles
                                    </div>
                                    <div className="widget-description text-warning">
                                <span className="pr-1">
                                    135.5
                                </span>
                                        <FontAwesomeIcon icon={faArrowLeft}/>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg bg-danger"/>
                                        <i className="lnr-laptop-phone text-danger"/>
                                    </div>
                                    <div className="widget-numbers">
                                        5.82
                                    </div>
                                    <div className="widget-subheading">
                                        Reports Submitted
                                    </div>
                                    <div className="widget-description text-primary">
                                        <span className="pr-1">54.1%</span>
                                        <FontAwesomeIcon icon={faAngleUp}/>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg bg-info"/>
                                        <i className="lnr-graduation-hat text-info"/>
                                    </div>
                                    <div className="widget-numbers">
                                        62.3
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
                                <div className="card mb-3 widget-chart">
                                    <div className="icon-wrapper rounded">
                                        <div className="icon-wrapper-bg bg-focus"/>
                                        <div className="center-svg">
                                            <i className="lnr-screen text-focus"/>
                                        </div>
                                    </div>
                                    <div className="widget-numbers">
                                        2.82
                                    </div>
                                    <div className="widget-subheading">
                                        Total Sales
                                    </div>
                                    <div className="widget-description text-danger">
                                        <span className="pr-1">23.1%</span>
                                        <FontAwesomeIcon icon={faAngleDown}/>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
                                    <div className="icon-wrapper rounded">
                                        <div className="icon-wrapper-bg bg-primary"/>
                                        <div className="center-svg">
                                            <i className="lnr-screen text-success"/>
                                        </div>
                                    </div>
                                    <div className="widget-numbers">
                                        31.9
                                    </div>
                                    <div className="widget-subheading">
                                        Follow-ups
                                    </div>
                                    <div className="widget-description text-focus">
                                        <FontAwesomeIcon icon={faArrowLeft}/>
                                        <span className="pl-1">115.5%</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className="divider mt-0" style={{marginBottom: '30px'}}/>
                        <Row>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-numbers">
                                        1.2M
                                    </div>
                                    <div className="widget-subheading">
                                        Leads Generated
                                    </div>
                                    <div className="widget-description text-info">
                                        <FontAwesomeIcon icon={faEllipsisH}/>
                                        <span className="pl-1">115.5%</span>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-chart-actions">
                                        <UncontrolledButtonDropdown>
                                            <DropdownToggle color="link">
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
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-numbers">
                                        5.82k
                                    </div>
                                    <div className="widget-subheading">
                                        Reports Submitted
                                    </div>
                                    <div className="widget-description text-primary">
                                        <span className="pr-1">54.1%</span>
                                        <FontAwesomeIcon icon={faAngleUp}/>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
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
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-numbers">
                                        3.47k
                                    </div>
                                    <div className="widget-subheading">
                                        Users Active
                                    </div>
                                    <div className="widget-description text-danger">
                                        <span className="pr-1">31.2%</span>
                                        <FontAwesomeIcon icon={faAngleDown}/>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-numbers">
                                        3.7M
                                    </div>
                                    <div className="widget-subheading">
                                        Lifetime Tickets
                                    </div>
                                    <div className="widget-description text-warning">
                                        <FontAwesomeIcon icon={faArrowRight}/>
                                        <span className="pl-1">121.9%</span>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className="divider mt-0" style={{marginBottom: '30px'}}/>
                        <Row>
                            <Col md="4">
                                <div className="card mb-3 widget-chart card-hover-shadow-2x">
                                    <div className="icon-wrapper border-light rounded">
                                        <div className="icon-wrapper-bg bg-light"/>
                                        <i className="lnr-cog icon-gradient bg-night-fade"/>
                                    </div>
                                    <div className="widget-numbers">
                                        45.8k
                                    </div>
                                    <div className="widget-subheading">
                                        Total Views
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart card-hover-shadow-2x">
                                    <div className="icon-wrapper border-light rounded">
                                        <div className="icon-wrapper-bg bg-light"/>
                                        <i className="lnr-screen icon-gradient bg-ripe-malin"/>
                                    </div>
                                    <div className="widget-numbers">
                                        17.2k
                                    </div>
                                    <div className="widget-subheading">
                                        Profiles
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart card-hover-shadow-2x">
                                    <div className="icon-wrapper border-light rounded">
                                        <div className="icon-wrapper-bg bg-light"/>
                                        <i className="lnr-laptop-phone icon-gradient bg-arielle-smile"/>
                                    </div>
                                    <div className="widget-numbers">
                                        5.82k
                                    </div>
                                    <div className="widget-subheading">
                                        Reports Submitted
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart card-hover-shadow-2x">
                                    <div className="icon-wrapper border-light rounded">
                                        <div className="icon-wrapper-bg bg-light"/>
                                        <i className="lnr-graduation-hat icon-gradient bg-happy-itmeo"/>
                                    </div>
                                    <div className="widget-numbers">
                                        63.2k
                                    </div>
                                    <div className="widget-subheading">
                                        Bugs Fixed
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart card-hover-shadow-2x">
                                    <div className="icon-wrapper border-light rounded-circle">
                                        <div className="icon-wrapper-bg bg-light"/>
                                        <i className="lnr-lock icon-gradient bg-malibu-beach"> </i>
                                    </div>
                                    <div className="widget-numbers">
                                        1.5M
                                    </div>
                                    <div className="widget-subheading">
                                        Views
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart card-hover-shadow-2x">
                                    <div className="icon-wrapper border-light rounded">
                                        <div className="icon-wrapper-bg bg-light"/>
                                        <i className="lnr-hourglass icon-gradient bg-love-kiss"> </i>
                                    </div>
                                    <div className="widget-numbers">
                                        1,584
                                    </div>
                                    <div className="widget-subheading">
                                        Active Social Accounts
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className="divider mt-0" style={{marginBottom: '30px'}}/>
                        <Row>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-chart-content">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-primary"/>
                                            <i className="lnr-cog text-primary"/>
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
                                    <div className="widget-chart-wrapper">
                                        <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                            <LineChart data={data}
                                                       margin={{top: 0, right: 5, left: 5, bottom: 0}}>
                                                <Line type='monotone' dataKey='pv' stroke='#3ac47d' strokeWidth={3}/>
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-chart-content">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-success"/>
                                            <i className="lnr-screen text-success"/>
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
                                    <div className="widget-chart-wrapper">
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
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-chart-content">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-danger"/>
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
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-chart-content">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-info"/>
                                            <i className="lnr-graduation-hat text-info"/>
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
                                    <div className="widget-chart-wrapper">
                                        <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                            <AreaChart data={data}
                                                       margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                                                <Area type='stepAfter' dataKey='uv' stroke='#3aabff' fill='#78C3FB'/>
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-chart-content">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-warning"/>
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
                                            <span className="text-danger pl-1 pr-1">
                                                <FontAwesomeIcon icon={faAngleDown}/>
                                                <span className="pl-1">54.1%</span>
                                            </span>
                                            from 30 days ago
                                        </div>
                                    </div>
                                    <div className="widget-chart-wrapper">
                                        <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                            <LineChart data={data2}
                                                       margin={{top: 0, right: 5, left: 5, bottom: 0}}>
                                                <Line type="monotone" dataKey="pv" stroke="#d6b5ff" strokeWidth={2}/>
                                                <Line type="monotone" dataKey="uv" stroke="#a75fff" strokeWidth={2}/>
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-chart-content">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-info"/>
                                            <i className="lnr-graduation-hat text-info"/>
                                        </div>
                                        <div className="widget-numbers">
                                            1.5M
                                        </div>
                                        <div className="widget-subheading">
                                            Bugs Fixed
                                        </div>
                                        <div className="widget-description text-info">
                                            Down by
                                            <span className=" pl-1 pr-1">
                                                <FontAwesomeIcon icon={faAngleDown}/>
                                                <span className="text-danger pl-1">54.1%</span>
                                            </span>
                                            from 30 days ago
                                        </div>
                                    </div>
                                    <div className="widget-chart-wrapper">
                                        <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                            <ComposedChart data={data2}>
                                                <CartesianGrid stroke="#f5f5f5"/>
                                                <Area type="monotone" dataKey="amt" fill="#f7ffd0" stroke="#85a200"/>
                                                <Bar dataKey="pv" barSize={10} fill="#565e6b"/>
                                                <Line type="monotone" dataKey="uv" stroke="#272631"/>
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className="divider mt-0" style={{marginBottom: '30px'}}/>
                        <Row>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-chart-content">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-primary"/>
                                            <i className="lnr-cog text-primary"/>
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
                                    <div className="widget-chart-wrapper chart-wrapper-relative">
                                        <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                            <LineChart data={data}
                                                       margin={{top: 5, right: 5, left: 5, bottom: 0}}>
                                                <Line type='monotone' dataKey='pv' stroke='#3ac47d'
                                                      strokeWidth={3}/>
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-chart-content">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-success"/>
                                            <i className="lnr-screen text-success"/>
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
                                    <div className="widget-chart-wrapper chart-wrapper-relative">
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
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-chart-content">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-danger"/>
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
                                                <Bar dataKey='uv' fill='#81a4ff' stroke='#3f6ad8' strokeWidth={2}/>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-chart-content">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-info"/>
                                            <i className="lnr-graduation-hat text-info"/>
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
                                    <div className="widget-chart-wrapper chart-wrapper-relative">
                                        <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                            <AreaChart data={data}
                                                       margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                                                <Area type='stepAfter' dataKey='uv' stroke='#3aabff' fill='#78C3FB'/>
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-chart-content">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-warning"/>
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
                                            <span className="text-danger pl-1 pr-1">
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
                                                <Line type="monotone" dataKey="pv" stroke="#d6b5ff" strokeWidth={2}/>
                                                <Line type="monotone" dataKey="uv" stroke="#a75fff" strokeWidth={2}/>
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-chart-content">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-info"/>
                                            <i className="lnr-graduation-hat text-info"/>
                                        </div>
                                        <div className="widget-numbers">
                                            1.5M
                                        </div>
                                        <div className="widget-subheading">
                                            Bugs Fixed
                                        </div>
                                        <div className="widget-description text-info">
                                            Down by
                                            <span className="pl-1 pr-1">
                                                <FontAwesomeIcon icon={faAngleDown}/>
                                                <span className="text-danger pl-1">54.1%</span>
                                            </span>
                                            from 30 days ago
                                        </div>
                                    </div>
                                    <div className="widget-chart-wrapper chart-wrapper-relative">
                                        <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                            <ComposedChart data={data2}>
                                                <CartesianGrid stroke="#f5f5f5"/>
                                                <Area type="monotone" dataKey="amt" fill="#f7ffd0" stroke="#85a200"/>
                                                <Bar dataKey="pv" barSize={5} fill="#32a40a"/>
                                                <Line type="monotone" dataKey="uv" stroke="#272631"/>
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className="divider mt-0" style={{marginBottom: '30px'}}/>
                        <Row>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-chart-content">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-primary"/>
                                            <i className="lnr-cog text-primary"/>
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
                                    <div className="widget-chart-wrapper">
                                        <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                            <LineChart data={data}
                                                       margin={{top: 0, right: 5, left: 5, bottom: 0}}>
                                                <Line type='monotone' dataKey='pv' stroke='#3ac47d' strokeWidth={3}/>
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-chart-content">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-success"/>
                                            <i className="lnr-screen text-success"/>
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
                                    <div className="widget-chart-wrapper">
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
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-chart-content">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-danger"/>
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
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-chart-content">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-info"/>
                                            <i className="lnr-graduation-hat text-info"/>
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
                                    <div className="widget-chart-wrapper">
                                        <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                            <AreaChart data={data}
                                                       margin={{top: 0, right: 0, left: 0, bottom: 0}}>
                                                <Area type='stepAfter' dataKey='uv' stroke='#3aabff' fill='#78C3FB'/>
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-chart-content">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-warning"/>
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
                                            <span className="text-danger pl-1 pr-1">
                                                <FontAwesomeIcon icon={faAngleDown}/>
                                                <span className="pl-1">54.1%</span>
                                            </span>
                                            from 30 days ago
                                        </div>
                                    </div>
                                    <div className="widget-chart-wrapper">
                                        <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                            <LineChart data={data2}
                                                       margin={{top: 0, right: 5, left: 5, bottom: 0}}>
                                                <Line type="monotone" dataKey="pv" stroke="#d6b5ff" strokeWidth={2}/>
                                                <Line type="monotone" dataKey="uv" stroke="#a75fff" strokeWidth={2}/>
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
                                    <div className="widget-chart-content">
                                        <div className="icon-wrapper rounded-circle">
                                            <div className="icon-wrapper-bg bg-info"/>
                                            <i className="lnr-graduation-hat text-info"/>
                                        </div>
                                        <div className="widget-numbers">
                                            1.5M
                                        </div>
                                        <div className="widget-subheading">
                                            Bugs Fixed
                                        </div>
                                        <div className="widget-description text-info">
                                            Down by
                                            <span className="pl-1 pr-1">
                                                <FontAwesomeIcon icon={faAngleDown}/>
                                                <span className="text-danger pl-1">54.1%</span>
                                            </span>
                                            from 30 days ago
                                        </div>
                                    </div>
                                    <div className="widget-chart-wrapper">
                                        <ResponsiveContainer width='100%' aspect={3.0 / 1.0}>
                                            <ComposedChart data={data2}>
                                                <Area type="monotone" dataKey="amt" fill="#f7ffd0" stroke="#85a200"/>
                                                <Bar dataKey="pv" barSize={10} fill="#7b808a"/>
                                                <Line type="monotone" dataKey="uv" stroke="#272631"/>
                                            </ComposedChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        <div className="divider mt-0" style={{marginBottom: '30px'}}/>
                        <Row>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">

                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg bg-primary"/>
                                        <i className="lnr-cog text-primary"/>
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
                                    <div className="widget-progress-wrapper mt-3">
                                        <Progress className="progress-bar-sm progress-bar-animated-alt" color="success"
                                                  value="65"/>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg bg-success"/>
                                        <i className="lnr-screen text-success"/>
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
                                    <div className="widget-progress-wrapper mt-3">
                                        <Progress className="progress-bar-xs progress-bar-animated-alt" color="danger"
                                                  value="85"/>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart card-border">
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg bg-danger"/>
                                        <i className="lnr-laptop-phone text-danger"/>
                                    </div>
                                    <div className="widget-numbers">
                                        5.82k
                                    </div>
                                    <div className="widget-subheading">
                                        Reports Submitted
                                    </div>
                                    <div className="widget-description text-primary">
                                        <span className="pr-1">54.1%</span>
                                        <FontAwesomeIcon icon={faAngleUp}/>
                                    </div>
                                    <div className="widget-progress-wrapper mt-3 progress-wrapper-bottom">
                                        <Progress className="progress-bar-sm progress-bar-animated" color="warning"
                                                  value="47"/>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart card-border">
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg bg-info"/>
                                        <i className="lnr-graduation-hat text-info"/>
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
                                    <div className="widget-progress-wrapper mt-3 progress-wrapper-bottom">
                                        <Progress className="progress-bar-xs" color="primary" value="91"/>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">

                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg bg-focus"/>
                                        <i className="pe-7s-bluetooth text-focus"/>
                                    </div>
                                    <div className="widget-numbers">
                                        15.8k
                                    </div>
                                    <div className="widget-subheading">
                                        Total Views
                                    </div>
                                    <div className="widget-description">
                                        <span className="text-success pr-1">
                                            <FontAwesomeIcon icon={faAngleUp}/>
                                            <span className="pl-1">54.1%</span>
                                        </span>
                                        increase since last month
                                    </div>
                                    <div className="widget-progress-wrapper mt-3">
                                        <Progress className="progress-bar-lg progress-bar-animated" color="primary"
                                                  value="65"/>
                                    </div>
                                </div>
                            </Col>
                            <Col md="4">
                                <div className="card mb-3 widget-chart">
                                    <div className="icon-wrapper rounded-circle">
                                        <div className="icon-wrapper-bg bg-warning"/>
                                        <i className="pe-7s-stopwatch text-warning"/>
                                    </div>
                                    <div className="widget-numbers">
                                        17.2k
                                    </div>
                                    <div className="widget-subheading">
                                        Profiles
                                    </div>
                                    <div className="widget-description">
                                        <span className="text-success pl-1 pr-1">
                                                <FontAwesomeIcon icon={faAngleUp}/>
                                                <span className="pl-1">77.5%</span>
                                            </span>
                                        new sales leads
                                    </div>
                                    <div className="widget-progress-wrapper mt-3">
                                        <Progress className="progress-bar-xs progress-bar-animated" color="info"
                                                  value="85"/>
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
