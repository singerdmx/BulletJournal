import React, {Component, Fragment} from 'react';
import {Button} from 'reactstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Row, Col,
    Card, CardBody,
    CardTitle,
} from 'reactstrap';

class BadgesExamples extends Component {

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
                        <Col lg="6">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>With Buttons</CardTitle>
                                    <Button className="mb-2 mr-2" color="primary">
                                        Primary
                                        <span className="badge badge-pill badge-light">6</span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="secondary">
                                        Secondary
                                        <span className="badge badge-pill badge-light">6</span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="success">
                                        Success
                                        <span className="badge badge-pill badge-light">6</span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="info">
                                        Info
                                        <span className="badge badge-pill badge-light">6</span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="warning">
                                        Warning
                                        <span className="badge badge-pill badge-light">6</span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="danger">
                                        Danger
                                        <span className="badge badge-pill badge-light">6</span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="focus">
                                        Focus
                                        <span className="badge badge-pill badge-light">6</span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="alternate">
                                        Alt
                                        <span className="badge badge-pill badge-light">6</span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="light">
                                        Light
                                        <span className="badge badge-pill badge-light">6</span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="dark">
                                        Dark
                                        <span className="badge badge-pill badge-light">6</span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="link">
                                        Link 1
                                        <span className="badge badge-pill badge-primary">6</span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="link">
                                        Link 2
                                        <span className="badge badge-pill badge-success">6</span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="link">
                                        Link 3
                                        <span className="badge badge-pill badge-danger">6</span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="link">
                                        Link 4
                                        <span className="badge badge-pill badge-warning">6</span>
                                    </Button>
                                </CardBody>
                            </Card>
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Badge Dots</CardTitle>
                                    <Row className="text-center">
                                        <Col md="4">
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-sm badge-primary">
                                                Primary
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-sm badge-secondary">
                                                Secondary
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-sm badge-success">
                                                Success
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-sm badge-info">Info
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-sm badge-warning">
                                                Warning
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-sm badge-danger">Danger
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-sm badge-focus">Focus
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-sm badge-alternate">Alt
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-sm badge-dark">Dark
                                            </div>
                                        </Col>
                                        <Col md="4">
                                            <div className="mb-2 mr-2 badge badge-dot badge-primary">Primary</div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-secondary">Secondary</div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-success">Success</div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-info">Info</div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-warning">Warning</div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-danger">Danger</div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-focus">Focus</div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-alternate">Alt</div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dark">Dark</div>
                                        </Col>
                                        <Col md="4">
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-lg badge-primary">
                                                Primary
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-lg badge-secondary">
                                                Secondary
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-lg badge-success">
                                                Success
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-lg badge-info">Info
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-lg badge-warning">
                                                Warning
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-lg badge-danger">Danger
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-lg badge-focus">Focus
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-lg badge-alternate">Alt
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-lg badge-dark">Dark
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="divider"/>
                                    <Row>
                                        <Col md="12">
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-xl badge-primary">
                                                Primary
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-xl badge-secondary">
                                                Secondary
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-xl badge-success">
                                                Success
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-xl badge-info">Info
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-xl badge-warning">
                                                Warning
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-xl badge-danger">Danger
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-xl badge-focus">Focus
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-xl badge-alternate">Alt
                                            </div>
                                            <div className="mb-2 mr-2 badge badge-dot badge-dot-xl badge-dark">Dark
                                            </div>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Badge Dots Buttons</CardTitle>
                                    <Button className="mb-2 mr-2" color="primary">
                                        Primary
                                        <span className="badge badge-secondary badge-dot badge-dot-lg"> </span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="secondary">
                                        Secondary
                                        <span className="badge badge-primary badge-dot badge-dot-lg"> </span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="success">
                                        Success
                                        <span className="badge badge-success badge-dot badge-dot-lg"> </span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="info">
                                        Info
                                        <span className="badge badge-info badge-dot badge-dot-lg"> </span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="warning">
                                        Warning
                                        <span className="badge badge-warning badge-dot badge-dot-lg"> </span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="danger">
                                        Danger
                                        <span className="badge badge-focus badge-dot badge-dot-lg"> </span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="focus">
                                        Focus
                                        <span className="badge badge-danger badge-dot badge-dot-lg"> </span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="alternate">
                                        Alt
                                        <span className="badge badge-alternate badge-dot badge-dot-lg"> </span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="light">
                                        Light
                                        <span className="badge badge-success badge-dot badge-dot-lg"> </span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="dark">
                                        Dark
                                        <span className="badge badge-primary badge-dot badge-dot-lg"> </span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="link">
                                        Link 1
                                        <span className="badge badge-primary badge-dot badge-dot-lg"> </span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="link">
                                        Link 2
                                        <span className="badge badge-success badge-dot badge-dot-lg"> </span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="link">
                                        Link 3
                                        <span className="badge badge-danger badge-dot badge-dot-lg"> </span>
                                    </Button>
                                    <Button className="mb-2 mr-2" color="link">
                                        Link 4
                                        <span className="badge badge-warning badge-dot badge-dot-lg"> </span>
                                    </Button>
                                </CardBody>
                            </Card>
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Icon Buttons with Badges</CardTitle>
                                    <button className="mb-2 mr-2 btn-icon btn-icon-only btn btn-link btn-sm">
                                        <i className="pe-7s-settings btn-icon-wrapper font-size-xlg"> </i>
                                        <span className="badge badge-warning badge-dot badge-dot-sm"> </span>
                                    </button>
                                    <button className="mb-2 mr-2 btn-icon btn-icon-only btn btn-link btn-sm">
                                        <i className="lnr-license btn-icon-wrapper font-size-xlg"> </i>
                                        <span className="badge badge-primary badge-dot badge-dot"> </span>
                                    </button>
                                    <button className="mb-2 mr-4 btn-icon btn-icon-only btn btn-link btn-sm">
                                        <i className="lnr-map btn-icon-wrapper font-size-xlg"> </i>
                                        <span className="badge badge-success badge-dot badge-dot-lg"> </span>
                                    </button>

                                    <button className="mb-2 mr-2 btn-icon btn-icon-only btn btn-link btn-sm">
                                        <i className="pe-7s-settings btn-icon-wrapper font-size-xlg"> </i>
                                        <span className="badge badge-pill badge-warning">2</span>
                                    </button>
                                    <button className="mb-2 mr-2 btn-icon btn-icon-only btn btn-link btn-sm">
                                        <i className="lnr-license btn-icon-wrapper font-size-xlg"> </i>
                                        <span className="badge badge-pill badge-primary">3</span>
                                    </button>
                                    <button className="mb-2 mr-2 btn-icon btn-icon-only btn btn-link btn-sm">
                                        <i className="lnr-map btn-icon-wrapper font-size-xlg"> </i>
                                        <span className="badge badge-pill badge-success">5</span>
                                    </button>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
};

export default BadgesExamples;
