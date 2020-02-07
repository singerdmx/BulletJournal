import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {
    Row, Col,
    Card, CardBody,
    CardTitle, Nav, NavItem, NavLink

} from 'reactstrap';

export default class NavsHorizontal extends React.Component {
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
                                    <CardTitle>Horizontal Menu</CardTitle>
                                    <Nav>
                                        <NavLink active href="javascript:void(0);">Link</NavLink>
                                        <NavLink href="javascript:void(0);">Link</NavLink>
                                        <NavLink href="javascript:void(0);">Another Link</NavLink>
                                        <NavLink disabled href="javascript:void(0);">Disabled Link</NavLink>
                                    </Nav>
                                    <div className="divider"/>
                                    <Nav>
                                        <NavLink active href="javascript:void(0);">
                                            <i className="nav-link-icon pe-7s-settings"> </i>
                                            <span>Link</span>
                                        </NavLink>
                                        <NavLink href="javascript:void(0);">
                                            <i className="nav-link-icon pe-7s-wallet"> </i>
                                            <span>Link</span>
                                            <div className="badge badge-pill badge-danger">12</div>
                                        </NavLink>
                                        <NavLink href="javascript:void(0);">
                                            <span>Another Link</span>
                                        </NavLink>
                                        <NavLink disabled href="javascript:void(0);">
                                            <i className="nav-link-icon pe-7s-box1"> </i>
                                            <span>Disabled Link</span>
                                        </NavLink>
                                    </Nav>
                                    <div className="divider"/>
                                    <Nav justified>
                                        <NavItem>
                                            <NavLink active href="javascript:void(0);">
                                                <i className="nav-link-icon pe-7s-settings"> </i>
                                                <span>Justified</span>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink href="javascript:void(0);">
                                                <i className="nav-link-icon pe-7s-chat"> </i>
                                                <span>Link</span>
                                                <div className="badge badge-success">NEW</div>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink href="javascript:void(0);">
                                                <span>Another Link</span>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink disabled href="javascript:void(0);">
                                                <i className="nav-link-icon pe-7s-box1"> </i>
                                                <span>Disabled Link</span>
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </CardBody>
                            </Card>
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Active Links</CardTitle>
                                    <Nav pills>
                                        <NavLink active href="javascript:void(0);">Link</NavLink>
                                        <NavLink href="javascript:void(0);">Link</NavLink>
                                        <NavLink href="javascript:void(0);">Another Link</NavLink>
                                        <NavLink disabled href="javascript:void(0);">Disabled Link</NavLink>
                                    </Nav>
                                    <div className="divider"/>
                                    <Nav pills>
                                        <NavLink active href="javascript:void(0);">
                                            <i className="nav-link-icon pe-7s-settings"> </i>
                                            <span>Link</span>
                                        </NavLink>
                                        <NavLink href="javascript:void(0);">
                                            <i className="nav-link-icon pe-7s-wallet"> </i>
                                            <span>Link</span>
                                            <div className="badge badge-pill badge-danger">12</div>
                                        </NavLink>
                                        <NavLink href="javascript:void(0);">
                                            <span>Another Link</span>
                                        </NavLink>
                                        <NavLink disabled href="javascript:void(0);">
                                            <i className="nav-link-icon pe-7s-box1"> </i>
                                            <span>Disabled Link</span>
                                        </NavLink>
                                    </Nav>
                                    <div className="divider"/>
                                    <Nav pills justified>
                                        <NavItem>
                                            <NavLink active href="javascript:void(0);">
                                                <i className="nav-link-icon pe-7s-settings"> </i>
                                                Justified
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink href="javascript:void(0);">
                                                <i className="nav-link-icon pe-7s-chat"> </i>
                                                Link
                                                <div className="badge badge-success">NEW</div>
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink href="javascript:void(0);">
                                                Another Link
                                            </NavLink>
                                        </NavItem>
                                        <NavItem>
                                            <NavLink disabled href="javascript:void(0);">
                                                <i className="nav-link-icon pe-7s-box1"> </i>
                                                Disabled Link
                                            </NavLink>
                                        </NavItem>
                                    </Nav>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
};
