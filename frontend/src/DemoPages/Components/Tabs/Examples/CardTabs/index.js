import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import classnames from 'classnames';

import {
    TabContent, TabPane, Nav, NavItem, NavLink,
    Row, Col, CardHeader, CardFooter,
    Card, CardBody,
    Button, ButtonGroup
} from 'reactstrap';

export default class CardTabsExample extends React.Component {
    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            activeTab: '1',
        };
    }

    toggle(tab) {
        if (this.state.activeTab !== tab) {
            this.setState({
                activeTab: tab
            });
        }
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
                    <div>
                        <Row>
                            <Col md="6">
                                <Card className="main-card mb-3">
                                    <CardHeader>
                                        <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                        Header with Tabs
                                        <div className="btn-actions-pane-right">
                                            <ButtonGroup size="sm">
                                                <Button color="primary"
                                                        className={"btn-shadow " + classnames({active: this.state.activeTab === '1'})}
                                                        onClick={() => {
                                                            this.toggle('1');
                                                        }}
                                                >Tab 1</Button>
                                                <Button color="primary"
                                                        className={"btn-shadow " + classnames({active: this.state.activeTab === '2'})}
                                                        onClick={() => {
                                                            this.toggle('2');
                                                        }}
                                                >Tab 2</Button>
                                                <Button color="primary"
                                                        className={"btn-shadow " + classnames({active: this.state.activeTab === '3'})}
                                                        onClick={() => {
                                                            this.toggle('3');
                                                        }}
                                                >Tab 3</Button>
                                            </ButtonGroup>
                                        </div>
                                    </CardHeader>
                                    <CardBody>

                                        <TabContent activeTab={this.state.activeTab}>
                                            <TabPane tabId="1">
                                                <p>It was popularised in the 1960s with the release of Letraset sheets
                                                    containing Lorem Ipsum passages, and more recently with desktop
                                                    publishing software like Aldus PageMaker including versions of Lorem
                                                    Ipsum.</p>
                                            </TabPane>
                                            <TabPane tabId="2">
                                                <p>Like Aldus PageMaker including versions of Lorem. It has survived not
                                                    only five centuries, but
                                                    also the leap into electronic typesetting, remaining essentially
                                                    unchanged. </p>
                                            </TabPane>
                                            <TabPane tabId="3">
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since
                                                    the
                                                    1500s, when an unknown printer took a galley of type and scrambled
                                                    it to
                                                    make a type specimen book. It has survived not only five centuries,
                                                    but
                                                    also the leap into electronic typesetting, remaining essentially
                                                    unchanged. </p>
                                            </TabPane>
                                        </TabContent>

                                    </CardBody>
                                    <CardFooter className="d-block text-right">
                                        <Button className="btn-wide" color="success">
                                            Save
                                        </Button>
                                    </CardFooter>
                                </Card>
                                <Card className="main-card mb-3">
                                    <CardHeader>
                                        <i className="header-icon lnr-license icon-gradient bg-plum-plate"> </i>
                                        Header Tabs Buttons
                                        <div className="btn-actions-pane-right">
                                            <Button size="sm" outline color="alternate"
                                                    className={"btn-pill btn-wide " + classnames({active: this.state.activeTab === '1'})}
                                                    onClick={() => {
                                                        this.toggle('1');
                                                    }}>Tab 1</Button>
                                            <Button size="sm" outline color="alternate"
                                                    className={"btn-pill btn-wide mr-1 ml-1 " + classnames({active: this.state.activeTab === '2'})}
                                                    onClick={() => {
                                                        this.toggle('2');
                                                    }}>Tab 2</Button>
                                            <Button size="sm" outline color="alternate"
                                                    className={"btn-pill btn-wide " + classnames({active: this.state.activeTab === '3'})}
                                                    onClick={() => {
                                                        this.toggle('3');
                                                    }}>Tab 3</Button>
                                        </div>
                                    </CardHeader>
                                    <CardBody>

                                        <TabContent activeTab={this.state.activeTab}>
                                            <TabPane tabId="1">
                                                <p>It was popularised in the 1960s with the release of Letraset sheets
                                                    containing Lorem Ipsum passages, and more recently with desktop
                                                    publishing software like Aldus PageMaker including versions of Lorem
                                                    Ipsum.</p>
                                            </TabPane>
                                            <TabPane tabId="2">
                                                <p>Like Aldus PageMaker including versions of Lorem. It has survived not
                                                    only five centuries, but
                                                    also the leap into electronic typesetting, remaining essentially
                                                    unchanged. </p>
                                            </TabPane>
                                            <TabPane tabId="3">
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since
                                                    the
                                                    1500s, when an unknown printer took a galley of type and scrambled
                                                    it to
                                                    make a type specimen book. It has survived not only five centuries,
                                                    but
                                                    also the leap into electronic typesetting, remaining essentially
                                                    unchanged. </p>
                                            </TabPane>
                                        </TabContent>

                                    </CardBody>
                                    <CardFooter className="d-block text-right">
                                        <Button className="btn-wide" color="success">
                                            Save
                                        </Button>
                                    </CardFooter>
                                </Card>
                                <Card className="main-card mb-3">
                                    <CardHeader>
                                        <i className="header-icon lnr-gift icon-gradient bg-mixed-hopes"> </i>
                                        Alternate Tabs
                                        <div className="btn-actions-pane-right">
                                            <ButtonGroup size="sm">
                                                <Button color="focus"
                                                        className={"btn-pill pl-3 " + classnames({active: this.state.activeTab === '1'})}
                                                        onClick={() => {
                                                            this.toggle('1');
                                                        }}
                                                >Tab 1</Button>
                                                <Button color="focus"
                                                        className={classnames({active: this.state.activeTab === '2'})}
                                                        onClick={() => {
                                                            this.toggle('2');
                                                        }}
                                                >Tab 2</Button>
                                                <Button color="focus"
                                                        className={"btn-pill pr-3 " + classnames({active: this.state.activeTab === '3'})}
                                                        onClick={() => {
                                                            this.toggle('3');
                                                        }}
                                                >Tab 3</Button>
                                            </ButtonGroup>
                                        </div>
                                    </CardHeader>
                                    <CardBody>

                                        <TabContent activeTab={this.state.activeTab}>
                                            <TabPane tabId="1">
                                                <p>It was popularised in the 1960s with the release of Letraset sheets
                                                    containing Lorem Ipsum passages, and more recently with desktop
                                                    publishing software like Aldus PageMaker including versions of Lorem
                                                    Ipsum.</p>
                                            </TabPane>
                                            <TabPane tabId="2">
                                                <p>Like Aldus PageMaker including versions of Lorem. It has survived not
                                                    only five centuries, but
                                                    also the leap into electronic typesetting, remaining essentially
                                                    unchanged. </p>
                                            </TabPane>
                                            <TabPane tabId="3">
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since
                                                    the
                                                    1500s, when an unknown printer took a galley of type and scrambled
                                                    it to
                                                    make a type specimen book. It has survived not only five centuries,
                                                    but
                                                    also the leap into electronic typesetting, remaining essentially
                                                    unchanged. </p>
                                            </TabPane>
                                        </TabContent>

                                    </CardBody>
                                </Card>
                                <Card className="main-card mb-3">
                                    <CardHeader>
                                        <i className="header-icon lnr-gift icon-gradient bg-grow-early"> </i>
                                        Header Tabs Standard Buttons
                                        <div className="btn-actions-pane-right">
                                            <Button outline
                                                    className={"border-0 btn-pill btn-wide btn-transition " + classnames({active: this.state.activeTab === '1'})}
                                                    color="danger" onClick={() => {
                                                this.toggle('1');
                                            }}>Tab 1</Button>
                                            <Button outline
                                                    className={"mr-1 ml-1 btn-pill btn-wide border-0 btn-transition " + classnames({active: this.state.activeTab === '2'})}
                                                    color="danger" onClick={() => {
                                                this.toggle('2');
                                            }}>Tab 2</Button>
                                            <Button outline
                                                    className={"border-0 btn-pill btn-wide btn-transition " + classnames({active: this.state.activeTab === '3'})}
                                                    color="danger" onClick={() => {
                                                this.toggle('3');
                                            }}>Tab 3</Button>
                                        </div>
                                    </CardHeader>
                                    <CardBody>
                                        <TabContent activeTab={this.state.activeTab}>
                                            <TabPane tabId="1">
                                                <p>It was popularised in the 1960s with the release of Letraset sheets
                                                    containing Lorem Ipsum passages, and more recently with desktop
                                                    publishing software like Aldus PageMaker including versions of Lorem
                                                    Ipsum.</p>
                                            </TabPane>
                                            <TabPane tabId="2">
                                                <p>Like Aldus PageMaker including versions of Lorem. It has survived not
                                                    only five centuries, but
                                                    also the leap into electronic typesetting, remaining essentially
                                                    unchanged. </p>
                                            </TabPane>
                                            <TabPane tabId="3">
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since
                                                    the
                                                    1500s, when an unknown printer took a galley of type and scrambled
                                                    it to
                                                    make a type specimen book. It has survived not only five centuries,
                                                    but
                                                    also the leap into electronic typesetting, remaining essentially
                                                    unchanged. </p>
                                            </TabPane>
                                        </TabContent>
                                    </CardBody>
                                    <CardFooter className="d-block text-right">
                                        <Button className="btn-wide" color="success">
                                            Save
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Col>
                            <Col md="6">
                                <Card tabs="true" className="mb-3">
                                    <CardHeader className="card-header-tab">
                                        <div className="card-header-title">
                                            <i className="header-icon lnr-bicycle icon-gradient bg-love-kiss"> </i>
                                            Header Alternate Tabs
                                        </div>
                                        <Nav>
                                            <NavItem>
                                                <NavLink href="javascript:void(0);"
                                                         className={classnames({active: this.state.activeTab === '1'})}
                                                         onClick={() => {
                                                             this.toggle('1');
                                                         }}
                                                >
                                                    Tab 1
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink href="javascript:void(0);"
                                                         className={classnames({active: this.state.activeTab === '2'})}
                                                         onClick={() => {
                                                             this.toggle('2');
                                                         }}
                                                >
                                                    Tab 2
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink href="javascript:void(0);"
                                                         className={classnames({active: this.state.activeTab === '3'})}
                                                         onClick={() => {
                                                             this.toggle('3');
                                                         }}
                                                >
                                                    Tab 3
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </CardHeader>
                                    <CardBody>

                                        <TabContent activeTab={this.state.activeTab}>
                                            <TabPane tabId="1">
                                                <p>It was popularised in the 1960s with the release of Letraset sheets
                                                    containing Lorem Ipsum passages, and more recently with desktop
                                                    publishing software like Aldus PageMaker including versions of Lorem
                                                    Ipsum.</p>
                                            </TabPane>
                                            <TabPane tabId="2">
                                                <p>Like Aldus PageMaker including versions of Lorem. It has survived not
                                                    only five centuries, but
                                                    also the leap into electronic typesetting, remaining essentially
                                                    unchanged. </p>
                                            </TabPane>
                                            <TabPane tabId="3">
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since
                                                    the
                                                    1500s, when an unknown printer took a galley of type and scrambled
                                                    it to
                                                    make a type specimen book. It has survived not only five centuries,
                                                    but
                                                    also the leap into electronic typesetting, remaining essentially
                                                    unchanged. </p>
                                            </TabPane>
                                        </TabContent>

                                    </CardBody>
                                    <CardFooter className="d-block text-right">
                                        <Button className="btn-wide btn-shadow" color="danger">
                                            Delete
                                        </Button>
                                    </CardFooter>
                                </Card>
                                <Card className="main-card mb-3">
                                    <CardHeader>
                                        <i className="header-icon lnr-gift icon-gradient bg-grow-early"> </i>
                                        Header Tabs Standard Buttons
                                        <div className="btn-actions-pane-right">
                                            <Button outline
                                                    className={"border-0 btn-transition " + classnames({active: this.state.activeTab === '1'})}
                                                    color="primary" onClick={() => {
                                                this.toggle('1');
                                            }}>Tab 1</Button>
                                            <Button outline
                                                    className={"mr-1 ml-1 border-0 btn-transition " + classnames({active: this.state.activeTab === '2'})}
                                                    color="primary" onClick={() => {
                                                this.toggle('2');
                                            }}>Tab 2</Button>
                                            <Button outline
                                                    className={"border-0 btn-transition " + classnames({active: this.state.activeTab === '3'})}
                                                    color="primary" onClick={() => {
                                                this.toggle('3');
                                            }}>Tab 3</Button>
                                        </div>
                                    </CardHeader>
                                    <CardBody>

                                        <TabContent activeTab={this.state.activeTab}>
                                            <TabPane tabId="1">
                                                <p>It was popularised in the 1960s with the release of Letraset sheets
                                                    containing Lorem Ipsum passages, and more recently with desktop
                                                    publishing software like Aldus PageMaker including versions of Lorem
                                                    Ipsum.</p>
                                            </TabPane>
                                            <TabPane tabId="2">
                                                <p>Like Aldus PageMaker including versions of Lorem. It has survived not
                                                    only five centuries, but
                                                    also the leap into electronic typesetting, remaining essentially
                                                    unchanged. </p>
                                            </TabPane>
                                            <TabPane tabId="3">
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since
                                                    the
                                                    1500s, when an unknown printer took a galley of type and scrambled
                                                    it to
                                                    make a type specimen book. It has survived not only five centuries,
                                                    but
                                                    also the leap into electronic typesetting, remaining essentially
                                                    unchanged. </p>
                                            </TabPane>
                                        </TabContent>
                                    </CardBody>
                                    <CardFooter className="d-block text-right">
                                        <Button className="btn-wide" color="success">
                                            Save
                                        </Button>
                                    </CardFooter>
                                </Card>
                                <Card tabs="true" className="mb-3">
                                    <CardHeader>
                                        <Nav justified>
                                            <NavItem>
                                                <NavLink href="javascript:void(0);"
                                                         className={classnames({active: this.state.activeTab === '1'})}
                                                         onClick={() => {
                                                             this.toggle('1');
                                                         }}
                                                >
                                                    Tab 1
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink href="javascript:void(0);"
                                                         className={classnames({active: this.state.activeTab === '2'})}
                                                         onClick={() => {
                                                             this.toggle('2');
                                                         }}
                                                >
                                                    Tab 2
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink href="javascript:void(0);"
                                                         className={classnames({active: this.state.activeTab === '3'})}
                                                         onClick={() => {
                                                             this.toggle('3');
                                                         }}
                                                >
                                                    Tab 3
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </CardHeader>
                                    <CardBody>

                                        <TabContent activeTab={this.state.activeTab}>
                                            <TabPane tabId="1">
                                                <p>It was popularised in the 1960s with the release of Letraset sheets
                                                    containing Lorem Ipsum passages, and more recently with desktop
                                                    publishing software like Aldus PageMaker including versions of Lorem
                                                    Ipsum.</p>
                                            </TabPane>
                                            <TabPane tabId="2">
                                                <p>Like Aldus PageMaker including versions of Lorem. It has survived not
                                                    only five centuries, but
                                                    also the leap into electronic typesetting, remaining essentially
                                                    unchanged. </p>
                                            </TabPane>
                                            <TabPane tabId="3">
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since
                                                    the
                                                    1500s, when an unknown printer took a galley of type and scrambled
                                                    it to
                                                    make a type specimen book. It has survived not only five centuries,
                                                    but
                                                    also the leap into electronic typesetting, remaining essentially
                                                    unchanged. </p>
                                            </TabPane>
                                        </TabContent>

                                    </CardBody>
                                </Card>
                                <Card tabs="true" className="mb-3">
                                    <CardHeader className="card-header-tab card-header-tab-animation">
                                        <div
                                            className="card-header-title font-size-lg text-capitalize font-weight-normal">
                                            <i className="header-icon lnr-gift icon-gradient bg-love-kiss"> </i>
                                            Tabs Alternate Animation
                                        </div>
                                        <Nav>
                                            <NavItem>
                                                <NavLink href="javascript:void(0);"
                                                         className={classnames({active: this.state.activeTab === '1'})}
                                                         onClick={() => {
                                                             this.toggle('1');
                                                         }}
                                                >
                                                    Tab 1
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink href="javascript:void(0);"
                                                         className={classnames({active: this.state.activeTab === '2'})}
                                                         onClick={() => {
                                                             this.toggle('2');
                                                         }}
                                                >
                                                    Tab 2
                                                </NavLink>
                                            </NavItem>
                                            <NavItem>
                                                <NavLink href="javascript:void(0);"
                                                         className={classnames({active: this.state.activeTab === '3'})}
                                                         onClick={() => {
                                                             this.toggle('3');
                                                         }}
                                                >
                                                    Tab 3
                                                </NavLink>
                                            </NavItem>
                                        </Nav>
                                    </CardHeader>
                                    <CardBody>

                                        <TabContent activeTab={this.state.activeTab}>
                                            <TabPane tabId="1">
                                                <p>It was popularised in the 1960s with the release of Letraset sheets
                                                    containing Lorem Ipsum passages, and more recently with desktop
                                                    publishing software like Aldus PageMaker including versions of Lorem
                                                    Ipsum.</p>
                                            </TabPane>
                                            <TabPane tabId="2">
                                                <p>Like Aldus PageMaker including versions of Lorem. It has survived not
                                                    only five centuries, but
                                                    also the leap into electronic typesetting, remaining essentially
                                                    unchanged. </p>
                                            </TabPane>
                                            <TabPane tabId="3">
                                                <p>Lorem Ipsum has been the industry's standard dummy text ever since
                                                    the
                                                    1500s, when an unknown printer took a galley of type and scrambled
                                                    it to
                                                    make a type specimen book. It has survived not only five centuries,
                                                    but
                                                    also the leap into electronic typesetting, remaining essentially
                                                    unchanged. </p>
                                            </TabPane>
                                        </TabContent>

                                    </CardBody>
                                    <CardFooter className="d-block text-center">
                                        <Button className="btn-wide" color="link">
                                            Link Button
                                        </Button>
                                        <Button className="btn-wide btn-shadow" color="danger">
                                            Delete
                                        </Button>
                                    </CardFooter>
                                </Card>
                            </Col>
                        </Row>
                    </div>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
}