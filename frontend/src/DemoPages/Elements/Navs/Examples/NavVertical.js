import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Button, UncontrolledButtonDropdown,
    DropdownToggle, Dropdown, DropdownMenu,
    DropdownItem,
} from 'reactstrap';

import {
    Row, Col,
    Card, CardBody,
    CardTitle, Nav, NavItem, NavLink

} from 'reactstrap';

export default class NavsVertical extends React.Component {
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
                                    <CardTitle>Vertical Menu</CardTitle>
                                    <Row>
                                        <Col>
                                            <Nav vertical>
                                                <NavItem>
                                                    <NavLink href="javascript:void(0);">Link</NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink href="javascript:void(0);">
                                                        Link
                                                        <div className="ml-auto badge badge-success">New</div>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink href="javascript:void(0);">
                                                        Another Link
                                                        <div className="ml-auto badge badge-warning">512</div>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink disabled href="javascript:void(0);">Disabled Link</NavLink>
                                                </NavItem>
                                            </Nav>
                                        </Col>
                                        <Col>
                                            <Nav vertical>
                                                <NavItem>
                                                    <NavLink href="javascript:void(0);">
                                                        <i className="nav-link-icon lnr-inbox"> </i>
                                                        <span>Inbox</span>
                                                        <div className="ml-auto badge badge-pill badge-secondary">86
                                                        </div>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink href="javascript:void(0);">
                                                        <i className="nav-link-icon lnr-book"> </i>
                                                        <span>Book</span>
                                                        <div className="ml-auto badge badge-pill badge-danger">5</div>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink href="javascript:void(0);">
                                                        <i className="nav-link-icon lnr-picture"> </i>
                                                        <span>Picture</span>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink disabled href="javascript:void(0);">
                                                        <i className="nav-link-icon lnr-file-empty"> </i>
                                                        <span>File Disabled</span>
                                                    </NavLink>
                                                </NavItem>
                                            </Nav>
                                        </Col>
                                    </Row>
                                    <div className="divider"/>
                                    <div className="text-center">
                                        <UncontrolledButtonDropdown direction="down">
                                            <DropdownToggle caret className="mb-2 mr-2" color="primary">
                                                Dropdown Basic
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <Nav vertical>
                                                    <NavItem>
                                                        <NavLink href="javascript:void(0);">Link</NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink href="javascript:void(0);">
                                                            Link
                                                            <div className="ml-auto badge badge-success">New</div>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink href="javascript:void(0);">
                                                            Another Link
                                                            <div className="ml-auto badge badge-warning">512</div>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink disabled href="javascript:void(0);">Disabled
                                                            Link</NavLink>
                                                    </NavItem>
                                                </Nav>
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                        <Dropdown direction="down" className="d-inline-block"
                                                  onMouseOver={this.onMouseEnter}
                                                  onMouseLeave={this.onMouseLeave} isOpen={this.state.dropdownOpen}
                                                  toggle={this.toggle}>
                                            <DropdownToggle caret color="primary" className="mb-2 mr-2">
                                                Dropdown Hover
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <Nav vertical>
                                                    <NavItem>
                                                        <NavLink href="javascript:void(0);">
                                                            <i className="nav-link-icon lnr-inbox"> </i>
                                                            <span>Inbox</span>
                                                            <div className="ml-auto badge badge-pill badge-secondary">86
                                                            </div>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink href="javascript:void(0);">
                                                            <i className="nav-link-icon lnr-book"> </i>
                                                            <span>Book</span>
                                                            <div className="ml-auto badge badge-pill badge-danger">5
                                                            </div>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink href="javascript:void(0);">
                                                            <i className="nav-link-icon lnr-picture"> </i>
                                                            <span>Picture</span>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink disabled href="javascript:void(0);">
                                                            <i className="nav-link-icon lnr-file-empty"> </i>
                                                            <span>File Disabled</span>
                                                        </NavLink>
                                                    </NavItem>
                                                </Nav>
                                            </DropdownMenu>
                                        </Dropdown>
                                    </div>
                                </CardBody>
                            </Card>
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Separators & Headers</CardTitle>
                                    <Row>
                                        <Col>
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
                                                    <Button size="sm" className="btn-wide btn-shadow" color="danger">
                                                        Cancel
                                                    </Button>
                                                </NavItem>
                                            </Nav>
                                        </Col>
                                        <Col>
                                            <Nav vertical>
                                                <NavItem className="nav-item-header">
                                                    Activity
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink href="javascript:void(0);">
                                                        <i className="nav-link-icon pe-7s-chat"> </i>
                                                        <span>Chat</span>
                                                        <div className="ml-auto badge badge-pill badge-info">8</div>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink href="javascript:void(0);">
                                                        <i className="nav-link-icon pe-7s-wallet"> </i>
                                                        <span>Recover Password</span>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem className="nav-item-header">
                                                    My Account
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink href="javascript:void(0);">
                                                        <i className="nav-link-icon pe-7s-config"> </i>
                                                        <span>Settings</span>
                                                        <div className="ml-auto badge badge-success">New</div>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink href="javascript:void(0);">
                                                        <i className="nav-link-icon pe-7s-coffee"> </i>
                                                        <span>Messages</span>
                                                        <div className="ml-auto badge badge-warning">512</div>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem>
                                                    <NavLink href="javascript:void(0);">
                                                        <i className="nav-link-icon pe-7s-box2"> </i>
                                                        <span>Logs</span>
                                                    </NavLink>
                                                </NavItem>
                                                <NavItem className="nav-item-divider"/>
                                                <NavItem className="nav-item-btn">
                                                    <Button size="sm" className="btn-pill" color="success">
                                                        Save
                                                    </Button>
                                                </NavItem>
                                            </Nav>
                                        </Col>
                                    </Row>
                                    <div className="divider"/>
                                    <div className="text-center">
                                        <UncontrolledButtonDropdown direction="up">
                                            <DropdownToggle caret className="mb-2 mr-2" color="primary">
                                                Dropdown Basic
                                            </DropdownToggle>
                                            <DropdownMenu>
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
                                        <UncontrolledButtonDropdown direction="up">
                                            <DropdownToggle caret color="primary" className="mb-2 mr-2">
                                                Dropdown Example
                                            </DropdownToggle>
                                            <DropdownMenu>
                                                <Nav vertical>
                                                    <NavItem className="nav-item-header">
                                                        Activity
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink href="javascript:void(0);">
                                                            <i className="nav-link-icon pe-7s-chat"> </i>
                                                            <span>Chat</span>
                                                            <div className="ml-auto badge badge-pill badge-info">8
                                                            </div>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink href="javascript:void(0);">
                                                            <i className="nav-link-icon pe-7s-wallet"> </i>
                                                            <span>Recover Password</span>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem className="nav-item-header">
                                                        My Account
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink href="javascript:void(0);">
                                                            <i className="nav-link-icon pe-7s-config"> </i>
                                                            <span>Settings</span>
                                                            <div className="ml-auto badge badge-success">New</div>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink href="javascript:void(0);">
                                                            <i className="nav-link-icon pe-7s-coffee"> </i>
                                                            <span>Messages</span>
                                                            <div className="ml-auto badge badge-warning">512</div>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem>
                                                        <NavLink href="javascript:void(0);">
                                                            <i className="nav-link-icon pe-7s-box2"> </i>
                                                            <span>Logs</span>
                                                        </NavLink>
                                                    </NavItem>
                                                    <NavItem className="nav-item-divider"/>
                                                    <NavItem className="nav-item-btn">
                                                        <Button size="sm" className="btn-pill" color="success">
                                                            Save
                                                        </Button>
                                                    </NavItem>
                                                </Nav>
                                            </DropdownMenu>
                                        </UncontrolledButtonDropdown>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="12">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Menu Hover Styles</CardTitle>
                                    <Row>
                                        <Col md="3">
                                            <Card className="p-1 mb-2 card-border">
                                                <div className="dropdown-menu dropdown-menu-inline">
                                                    <DropdownItem header>Header</DropdownItem>
                                                    <DropdownItem>Menus</DropdownItem>
                                                    <DropdownItem>Settings</DropdownItem>
                                                    <DropdownItem>Actions</DropdownItem>
                                                    <DropdownItem divider/>
                                                    <DropdownItem>Dividers</DropdownItem>
                                                </div>
                                            </Card>
                                        </Col>
                                        <Col md="3">
                                            <Card className="p-1 mb-2 card-border">
                                                <div
                                                    className="dropdown-menu dropdown-menu-inline dropdown-menu-rounded">
                                                    <DropdownItem header>Header</DropdownItem>
                                                    <DropdownItem>Menus</DropdownItem>
                                                    <DropdownItem>Settings</DropdownItem>
                                                    <DropdownItem>Actions</DropdownItem>
                                                    <DropdownItem divider/>
                                                    <DropdownItem>Dividers</DropdownItem>
                                                </div>
                                            </Card>
                                        </Col>
                                        <Col md="3">
                                            <Card className="p-1 mb-2 card-border">
                                                <div
                                                    className="dropdown-menu dropdown-menu-inline dropdown-menu-shadow">
                                                    <DropdownItem header>Header</DropdownItem>
                                                    <DropdownItem>Menus</DropdownItem>
                                                    <DropdownItem>Settings</DropdownItem>
                                                    <DropdownItem>Actions</DropdownItem>
                                                    <DropdownItem divider/>
                                                    <DropdownItem>Dividers</DropdownItem>
                                                </div>
                                            </Card>
                                        </Col>
                                        <Col md="3">
                                            <Card className="p-1 mb-2 card-border">
                                                <div
                                                    className="dropdown-menu dropdown-menu-inline dropdown-menu-hover-link">
                                                    <DropdownItem header>Header</DropdownItem>
                                                    <DropdownItem>Menus</DropdownItem>
                                                    <DropdownItem>Settings</DropdownItem>
                                                    <DropdownItem>Actions</DropdownItem>
                                                    <DropdownItem divider/>
                                                    <DropdownItem>Dividers</DropdownItem>
                                                </div>
                                            </Card>
                                        </Col>
                                        <Col md="3">
                                            <Card className="p-1 mb-2 card-border">
                                                <div
                                                    className="dropdown-menu dropdown-menu-inline dropdown-menu-hover-primary">
                                                    <DropdownItem header>Header</DropdownItem>
                                                    <DropdownItem>Menus</DropdownItem>
                                                    <DropdownItem>Settings</DropdownItem>
                                                    <DropdownItem>Actions</DropdownItem>
                                                    <DropdownItem divider/>
                                                    <DropdownItem>Dividers</DropdownItem>
                                                </div>
                                            </Card>
                                        </Col>
                                        <Col md="3">
                                            <Card className="p-1 mb-2 card-border">
                                                <div
                                                    className="dropdown-menu dropdown-menu-inline dropdown-menu-hover-link">
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
                                                </div>
                                            </Card>
                                        </Col>
                                        <Col md="3">
                                            <Card className="p-1 mb-2 card-border">
                                                <div
                                                    className="dropdown-menu dropdown-menu-inline dropdown-menu-rounded dropdown-menu-hover-primary">
                                                    <DropdownItem header>Header</DropdownItem>
                                                    <DropdownItem>Menus</DropdownItem>
                                                    <DropdownItem>Settings</DropdownItem>
                                                    <DropdownItem>Actions</DropdownItem>
                                                    <DropdownItem divider/>
                                                    <DropdownItem>Dividers</DropdownItem>
                                                </div>
                                            </Card>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
};
