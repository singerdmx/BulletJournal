import React, {Component, Fragment} from 'react';
import {Button, Dropdown, UncontrolledButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem} from 'reactstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {Animated} from "react-animated-css";

import {
    Row, Col,
    Card, CardBody,
    CardTitle,
} from 'reactstrap';

export default class DropdownStyles extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.state = {
            dropdownOpen: false
        };
    }

    toggle() {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    onMouseEnter() {
        this.setState({dropdownOpen: true});
    }

    onMouseLeave() {
        this.setState({dropdownOpen: false});
    }

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
                    <Row>
                        <Col md="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Dropdown Menu Styles</CardTitle>
                                    <UncontrolledButtonDropdown className="mb-2 mr-2">
                                        <DropdownToggle caret color="primary">
                                            Basic
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <Dropdown className="d-inline-block" onMouseOver={this.onMouseEnter}
                                              onMouseLeave={this.onMouseLeave} isOpen={this.state.dropdownOpen}
                                              toggle={this.toggle}>
                                        <DropdownToggle caret color="primary" className="mb-2 mr-2">
                                            Hover Open
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem disabled>Action</DropdownItem>
                                            <DropdownItem>Another Action</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Another Action</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret className="mb-2 mr-2" color="primary">
                                            Rounded
                                        </DropdownToggle>
                                        <DropdownMenu className="dropdown-menu-rounded">
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret className="mb-2 mr-2" color="primary">
                                            Shadow
                                        </DropdownToggle>
                                        <DropdownMenu className="dropdown-menu-shadow">
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret className="mb-2 mr-2" color="primary">
                                            Hover Link
                                        </DropdownToggle>
                                        <DropdownMenu className="dropdown-menu-hover-link">
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret className="mb-2 mr-2" color="primary">
                                            Hover Background
                                        </DropdownToggle>
                                        <DropdownMenu className="dropdown-menu-hover-primary">
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret className="mb-2 mr-2" color="primary">
                                            Icons
                                        </DropdownToggle>
                                        <DropdownMenu className="dropdown-menu-hover-link">
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>
                                                <i className="dropdown-icon lnr-inbox"> </i>
                                                <span>Menus</span>
                                            </DropdownItem>
                                            <DropdownItem>
                                                <i className="dropdown-icon lnr-file-empty"> </i>
                                                <span>Settings</span>
                                            </DropdownItem>
                                            <DropdownItem>
                                                <i className="dropdown-icon lnr-book"> </i>
                                                <span>Actions</span>
                                            </DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>
                                                <i className="dropdown-icon lnr-picture"> </i>
                                                <span>Dividers</span>
                                            </DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret className="mb-2" color="primary">
                                            Right aligned
                                        </DropdownToggle>
                                        <DropdownMenu className="dropdown-menu-right dropdown-menu-rounded">
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg="6">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Basic</CardTitle>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret className="mb-2 mr-2" color="primary">
                                            Primary
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret className="mb-2 mr-2" color="secondary">
                                            Secondary
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret className="mb-2 mr-2" color="success">
                                            Success
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret className="mb-2 mr-2" color="info">
                                            Info
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret className="mb-2 mr-2" color="warning">
                                            Warning
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret className="mb-2 mr-2" color="danger">
                                            Danger
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret className="mb-2 mr-2" color="focus">
                                            Focus
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret className="mb-2 mr-2" color="alternate">
                                            Alt
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret className="mb-2 mr-2" color="light">
                                            Light
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret className="mb-2 mr-2" color="dark">
                                            Dark
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret className="mb-2 mr-2" color="link">
                                            Link
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                </CardBody>
                            </Card>
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Split Dropdowns</CardTitle>
                                    <UncontrolledButtonDropdown className="mb-2 mr-2">
                                        <Button color="primary">Primary</Button>
                                        <DropdownToggle className="dropdown-toggle-split" caret color="primary"/>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown className="mb-2 mr-2">
                                        <Button color="secondary">Secondary</Button>
                                        <DropdownToggle className="dropdown-toggle-split" caret color="secondary"/>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown className="mb-2 mr-2">
                                        <Button color="success">Success</Button>
                                        <DropdownToggle className="dropdown-toggle-split" caret color="success"/>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown className="mb-2 mr-2">
                                        <Button color="info">Info</Button>
                                        <DropdownToggle className="dropdown-toggle-split" caret color="info"/>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown className="mb-2 mr-2">
                                        <Button color="warning">Warning</Button>
                                        <DropdownToggle className="dropdown-toggle-split" caret color="warning"/>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown className="mb-2 mr-2">
                                        <Button color="danger">Danger</Button>
                                        <DropdownToggle className="dropdown-toggle-split" caret color="danger"/>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown className="mb-2 mr-2">
                                        <Button color="focus">Focus</Button>
                                        <DropdownToggle className="dropdown-toggle-split" caret color="focus"/>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown className="mb-2 mr-2">
                                        <Button color="alternate">Alt</Button>
                                        <DropdownToggle className="dropdown-toggle-split" caret color="alternate"/>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown className="mb-2 mr-2">
                                        <Button color="light">Light</Button>
                                        <DropdownToggle className="dropdown-toggle-split" caret color="light"/>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown className="mb-2 mr-2">
                                        <Button color="dark">Dark</Button>
                                        <DropdownToggle className="dropdown-toggle-split" caret color="dark"/>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                </CardBody>
                            </Card>
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Split Outline Dropdowns</CardTitle>
                                    <UncontrolledButtonDropdown className="mb-2 mr-2">
                                        <Button outline color="primary">Primary</Button>
                                        <DropdownToggle outline className="dropdown-toggle-split" caret
                                                        color="primary"/>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown className="mb-2 mr-2">
                                        <Button outline color="secondary">Secondary</Button>
                                        <DropdownToggle outline className="dropdown-toggle-split" caret
                                                        color="secondary"/>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown className="mb-2 mr-2">
                                        <Button outline color="success">Success</Button>
                                        <DropdownToggle outline className="dropdown-toggle-split" caret
                                                        color="success"/>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown className="mb-2 mr-2">
                                        <Button outline color="info">Info</Button>
                                        <DropdownToggle outline className="dropdown-toggle-split" caret color="info"/>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown className="mb-2 mr-2">
                                        <Button outline color="warning">Warning</Button>
                                        <DropdownToggle outline className="dropdown-toggle-split" caret
                                                        color="warning"/>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown className="mb-2 mr-2">
                                        <Button outline color="danger">Danger</Button>
                                        <DropdownToggle outline className="dropdown-toggle-split" caret color="danger"/>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown className="mb-2 mr-2">
                                        <Button outline color="focus">Focus</Button>
                                        <DropdownToggle outline className="dropdown-toggle-split" caret color="focus"/>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown className="mb-2 mr-2">
                                        <Button outline color="alternate">Alt</Button>
                                        <DropdownToggle outline className="dropdown-toggle-split" caret
                                                        color="alternate"/>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown className="mb-2 mr-2">
                                        <Button outline color="light">Light</Button>
                                        <DropdownToggle outline className="dropdown-toggle-split" caret color="light"/>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown className="mb-2 mr-2">
                                        <Button outline color="dark">Dark</Button>
                                        <DropdownToggle outline className="dropdown-toggle-split" caret color="dark"/>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                </CardBody>
                            </Card>
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Menu positions</CardTitle>
                                    <div className="text-center">
                                        <UncontrolledButtonDropdown direction="left" className="mb-2 mr-2">
                                            <Button className="btn-wide" color="primary">Dropleft</Button>
                                            <DropdownToggle className="dropdown-toggle-split" caret color="primary"/>
                                            <DropdownMenu>
                                                <DropdownItem>Menus</DropdownItem>
                                                <DropdownItem>Settings</DropdownItem>
                                                <DropdownItem header>Header</DropdownItem>
                                                <DropdownItem>Actions</DropdownItem>
                                                <DropdownItem divider/>
                                                <DropdownItem>Dividers</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                        <UncontrolledButtonDropdown direction="up" className="mb-2 mr-2">
                                            <Button className="btn-wide" color="primary">Dropup</Button>
                                            <DropdownToggle className="dropdown-toggle-split" caret color="primary"/>
                                            <DropdownMenu>
                                                <DropdownItem>Menus</DropdownItem>
                                                <DropdownItem>Settings</DropdownItem>
                                                <DropdownItem header>Header</DropdownItem>
                                                <DropdownItem>Actions</DropdownItem>
                                                <DropdownItem divider/>
                                                <DropdownItem>Dividers</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                        <UncontrolledButtonDropdown direction="right" className="mb-2 mr-2">
                                            <Button className="btn-wide" color="primary">Dropright</Button>
                                            <DropdownToggle className="dropdown-toggle-split" caret color="primary"/>
                                            <DropdownMenu>
                                                <DropdownItem>Menus</DropdownItem>
                                                <DropdownItem>Settings</DropdownItem>
                                                <DropdownItem header>Header</DropdownItem>
                                                <DropdownItem>Actions</DropdownItem>
                                                <DropdownItem divider/>
                                                <DropdownItem>Dividers</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                    </div>

                                    <div className="divider"/>

                                    <div className="text-center">
                                        <UncontrolledButtonDropdown direction="left">
                                            <DropdownToggle className="btn-wide mb-2 mr-2" caret color="primary">
                                                Dropleft
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem>Menus</DropdownItem>
                                                <DropdownItem>Settings</DropdownItem>
                                                <DropdownItem header>Header</DropdownItem>
                                                <DropdownItem>Actions</DropdownItem>
                                                <DropdownItem divider/>
                                                <DropdownItem>Dividers</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                        <UncontrolledButtonDropdown direction="up">
                                            <DropdownToggle className="btn-wide mb-2 mr-2" caret color="primary">
                                                Dropup
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem>Menus</DropdownItem>
                                                <DropdownItem>Settings</DropdownItem>
                                                <DropdownItem header>Header</DropdownItem>
                                                <DropdownItem>Actions</DropdownItem>
                                                <DropdownItem divider/>
                                                <DropdownItem>Dividers</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                        <UncontrolledButtonDropdown direction="right">
                                            <DropdownToggle className="btn-wide mb-2 mr-2" caret color="primary">
                                                Dropright
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem>Menus</DropdownItem>
                                                <DropdownItem>Settings</DropdownItem>
                                                <DropdownItem header>Header</DropdownItem>
                                                <DropdownItem>Actions</DropdownItem>
                                                <DropdownItem divider/>
                                                <DropdownItem>Dividers</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Outline</CardTitle>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret outline className="mb-2 mr-2" color="primary">
                                            Primary
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret outline className="mb-2 mr-2" color="secondary">
                                            Secondary
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret outline className="mb-2 mr-2" color="success">
                                            Success
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret outline className="mb-2 mr-2" color="info">
                                            Info
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret outline className="mb-2 mr-2" color="warning">
                                            Warning
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret outline className="mb-2 mr-2" color="danger">
                                            Danger
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret outline className="mb-2 mr-2" color="focus">
                                            Focus
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret outline className="mb-2 mr-2" color="alternate">
                                            Alt
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret outline className="mb-2 mr-2" color="light">
                                            Light
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret outline className="mb-2 mr-2" color="dark">
                                            Dark
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                    <UncontrolledButtonDropdown>
                                        <DropdownToggle caret outline className="mb-2 mr-2" color="link">
                                            Link
                                        </DropdownToggle>
                                        <DropdownMenu>
                                            <DropdownItem>Menus</DropdownItem>
                                            <DropdownItem>Settings</DropdownItem>
                                            <DropdownItem header>Header</DropdownItem>
                                            <DropdownItem>Actions</DropdownItem>
                                            <DropdownItem divider/>
                                            <DropdownItem>Dividers</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                </CardBody>
                            </Card>
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Sizing</CardTitle>
                                    <div className="text-center">
                                        <UncontrolledButtonDropdown className="mb-2 mr-2">
                                            <Button size="lg" color="primary">Large</Button>
                                            <DropdownToggle size="lg" className="dropdown-toggle-split" caret
                                                            color="primary"/>
                                            <DropdownMenu>
                                                <DropdownItem>Menus</DropdownItem>
                                                <DropdownItem>Settings</DropdownItem>
                                                <DropdownItem header>Header</DropdownItem>
                                                <DropdownItem>Actions</DropdownItem>
                                                <DropdownItem divider/>
                                                <DropdownItem>Dividers</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                        <UncontrolledButtonDropdown className="mb-2 mr-2">
                                            <Button color="primary">Normal</Button>
                                            <DropdownToggle className="dropdown-toggle-split" caret color="primary"/>
                                            <DropdownMenu>
                                                <DropdownItem>Menus</DropdownItem>
                                                <DropdownItem>Settings</DropdownItem>
                                                <DropdownItem header>Header</DropdownItem>
                                                <DropdownItem>Actions</DropdownItem>
                                                <DropdownItem divider/>
                                                <DropdownItem>Dividers</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                        <UncontrolledButtonDropdown className="mb-2 mr-2">
                                            <Button size="sm" color="primary">Small</Button>
                                            <DropdownToggle size="sm" className="dropdown-toggle-split" caret
                                                            color="primary"/>
                                            <DropdownMenu>
                                                <DropdownItem>Menus</DropdownItem>
                                                <DropdownItem>Settings</DropdownItem>
                                                <DropdownItem header>Header</DropdownItem>
                                                <DropdownItem>Actions</DropdownItem>
                                                <DropdownItem divider/>
                                                <DropdownItem>Dividers</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                    </div>

                                    <div className="divider"/>

                                    <div className="text-center">
                                        <UncontrolledButtonDropdown>
                                            <DropdownToggle size="lg" caret className="mb-2 mr-2" color="primary">
                                                Large
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem>Menus</DropdownItem>
                                                <DropdownItem>Settings</DropdownItem>
                                                <DropdownItem header>Header</DropdownItem>
                                                <DropdownItem>Actions</DropdownItem>
                                                <DropdownItem divider/>
                                                <DropdownItem>Dividers</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                        <UncontrolledButtonDropdown>
                                            <DropdownToggle caret className="mb-2 mr-2" color="primary">
                                                Normal
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem>Menus</DropdownItem>
                                                <DropdownItem>Settings</DropdownItem>
                                                <DropdownItem header>Header</DropdownItem>
                                                <DropdownItem>Actions</DropdownItem>
                                                <DropdownItem divider/>
                                                <DropdownItem>Dividers</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                        <UncontrolledButtonDropdown>
                                            <DropdownToggle size="sm" caret className="mb-2 mr-2" color="primary">
                                                Small
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem>Menus</DropdownItem>
                                                <DropdownItem>Settings</DropdownItem>
                                                <DropdownItem header>Header</DropdownItem>
                                                <DropdownItem>Actions</DropdownItem>
                                                <DropdownItem divider/>
                                                <DropdownItem>Dividers</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                    </div>
                                </CardBody>
                            </Card>
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Wider</CardTitle>
                                    <div className="text-center">
                                        <UncontrolledButtonDropdown className="mb-2 mr-2">
                                            <Button size="lg" className="btn-wide" color="primary">Large</Button>
                                            <DropdownToggle size="lg" className="dropdown-toggle-split" caret
                                                            color="primary"/>
                                            <DropdownMenu>
                                                <DropdownItem>Menus</DropdownItem>
                                                <DropdownItem>Settings</DropdownItem>
                                                <DropdownItem header>Header</DropdownItem>
                                                <DropdownItem>Actions</DropdownItem>
                                                <DropdownItem divider/>
                                                <DropdownItem>Dividers</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                        <UncontrolledButtonDropdown className="mb-2 mr-2">
                                            <Button className="btn-wide" color="primary">Normal</Button>
                                            <DropdownToggle className="dropdown-toggle-split" caret color="primary"/>
                                            <DropdownMenu>
                                                <DropdownItem>Menus</DropdownItem>
                                                <DropdownItem>Settings</DropdownItem>
                                                <DropdownItem header>Header</DropdownItem>
                                                <DropdownItem>Actions</DropdownItem>
                                                <DropdownItem divider/>
                                                <DropdownItem>Dividers</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                        <UncontrolledButtonDropdown className="mb-2 mr-2">
                                            <Button className="btn-wide" size="sm" color="primary">Small</Button>
                                            <DropdownToggle size="sm" className="dropdown-toggle-split" caret
                                                            color="primary"/>
                                            <DropdownMenu>
                                                <DropdownItem>Menus</DropdownItem>
                                                <DropdownItem>Settings</DropdownItem>
                                                <DropdownItem header>Header</DropdownItem>
                                                <DropdownItem>Actions</DropdownItem>
                                                <DropdownItem divider/>
                                                <DropdownItem>Dividers</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                    </div>

                                    <div className="divider"/>

                                    <div className="text-center">
                                        <UncontrolledButtonDropdown>
                                            <DropdownToggle className="btn-wide mb-2 mr-2" size="lg" caret
                                                            color="primary">
                                                Large
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem>Menus</DropdownItem>
                                                <DropdownItem>Settings</DropdownItem>
                                                <DropdownItem header>Header</DropdownItem>
                                                <DropdownItem>Actions</DropdownItem>
                                                <DropdownItem divider/>
                                                <DropdownItem>Dividers</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                        <UncontrolledButtonDropdown>
                                            <DropdownToggle className="btn-wide mb-2 mr-2" caret color="primary">
                                                Normal
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem>Menus</DropdownItem>
                                                <DropdownItem>Settings</DropdownItem>
                                                <DropdownItem header>Header</DropdownItem>
                                                <DropdownItem>Actions</DropdownItem>
                                                <DropdownItem divider/>
                                                <DropdownItem>Dividers</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                        <UncontrolledButtonDropdown>
                                            <DropdownToggle className="btn-wide mb-2 mr-2" size="sm" caret
                                                            color="primary">
                                                Small
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <DropdownItem>Menus</DropdownItem>
                                                <DropdownItem>Settings</DropdownItem>
                                                <DropdownItem header>Header</DropdownItem>
                                                <DropdownItem>Actions</DropdownItem>
                                                <DropdownItem divider/>
                                                <DropdownItem>Dividers</DropdownItem>
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
};
