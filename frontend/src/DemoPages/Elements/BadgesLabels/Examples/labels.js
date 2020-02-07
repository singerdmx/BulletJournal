import React, {Component, Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Row, Col,
    Card, CardBody,
    CardTitle, Button
} from 'reactstrap';


class LabelsExamples extends Component {

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
                            <Col lg="6">
                                <Card className="main-card mb-3">
                                    <CardBody>
                                        <CardTitle>Colors</CardTitle>
                                        <div className="mb-2 mr-2 badge badge-primary">Primary</div>
                                        <div className="mb-2 mr-2 badge badge-secondary">Secondary</div>
                                        <div className="mb-2 mr-2 badge badge-success">Success</div>
                                        <div className="mb-2 mr-2 badge badge-info">Info</div>
                                        <div className="mb-2 mr-2 badge badge-warning">Warning</div>
                                        <div className="mb-2 mr-2 badge badge-danger">Danger</div>
                                        <div className="mb-2 mr-2 badge badge-focus">Focus</div>
                                        <div className="mb-2 mr-2 badge badge-alternate">Alt</div>
                                        <div className="mb-2 mr-2 badge badge-light">Light</div>
                                        <div className="mb-2 mr-2 badge badge-dark">Dark</div>

                                        <div className="divider"/>

                                        <CardTitle>Pills</CardTitle>
                                        <div className="mb-2 mr-2 badge badge-pill badge-primary">Primary</div>
                                        <div className="mb-2 mr-2 badge badge-pill badge-secondary">Secondary</div>
                                        <div className="mb-2 mr-2 badge badge-pill badge-success">Success</div>
                                        <div className="mb-2 mr-2 badge badge-pill badge-info">Info</div>
                                        <div className="mb-2 mr-2 badge badge-pill badge-warning">Warning</div>
                                        <div className="mb-2 mr-2 badge badge-pill badge-danger">Danger</div>
                                        <div className="mb-2 mr-2 badge badge-pill badge-focus">Focus</div>
                                        <div className="mb-2 mr-2 badge badge-pill badge-alternate">Alt</div>
                                        <div className="mb-2 mr-2 badge badge-pill badge-light">Light</div>
                                        <div className="mb-2 mr-2 badge badge-pill badge-dark">Dark</div>

                                        <div className="divider"/>

                                        <CardTitle>Links</CardTitle>
                                        <a href="javascript:void(0);" className="mb-2 mr-2 badge badge-primary">Primary</a>
                                        <a href="javascript:void(0);" className="mb-2 mr-2 badge badge-secondary">Secondary</a>
                                        <a href="javascript:void(0);" className="mb-2 mr-2 badge badge-success">Success</a>
                                        <a href="javascript:void(0);" className="mb-2 mr-2 badge badge-info">Info</a>
                                        <a href="javascript:void(0);" className="mb-2 mr-2 badge badge-warning">Warning</a>
                                        <a href="javascript:void(0);" className="mb-2 mr-2 badge badge-danger">Danger</a>
                                        <a href="javascript:void(0);" className="mb-2 mr-2 badge badge-focus">Focus</a>
                                        <a href="javascript:void(0);" className="mb-2 mr-2 badge badge-alternate">Alt</a>
                                        <a href="javascript:void(0);" className="mb-2 mr-2 badge badge-light">Light</a>
                                        <a href="javascript:void(0);" className="mb-2 mr-2 badge badge-dark">Dark</a>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col lg="6">

                                <Card className="main-card mb-3">
                                    <CardBody>
                                        <CardTitle>With Buttons</CardTitle>
                                        <Button className="mb-2 mr-2" color="primary">
                                            Primary
                                            <span className="badge badge-light">NEW</span>
                                        </Button>
                                        <Button className="mb-2 mr-2" color="secondary">
                                            Secondary
                                            <span className="badge badge-light">NEW</span>
                                        </Button>
                                        <Button className="mb-2 mr-2" color="success">
                                            Success
                                            <span className="badge badge-light">NEW</span>
                                        </Button>
                                        <Button className="mb-2 mr-2" color="info">
                                            Info
                                            <span className="badge badge-light">NEW</span>
                                        </Button>
                                        <Button className="mb-2 mr-2" color="warning">
                                            Warning
                                            <span className="badge badge-light">NEW</span>
                                        </Button>
                                        <Button className="mb-2 mr-2" color="danger">
                                            Danger
                                            <span className="badge badge-light">NEW</span>
                                        </Button>
                                        <Button className="mb-2 mr-2" color="focus">
                                            Focus
                                            <span className="badge badge-light">NEW</span>
                                        </Button>
                                        <Button className="mb-2 mr-2" color="alternate">
                                            Alt
                                            <span className="badge badge-light">NEW</span>
                                        </Button>
                                        <Button className="mb-2 mr-2" color="light">
                                            Light
                                            <span className="badge badge-light">NEW</span>
                                        </Button>
                                        <Button className="mb-2 mr-2" color="dark">
                                            Dark
                                            <span className="badge badge-light">NEW</span>
                                        </Button>
                                        <Button className="mb-2 mr-2" color="link">
                                            Link 1
                                            <span className="badge badge-primary">NEW</span>
                                        </Button>
                                        <Button className="mb-2 mr-2" color="link">
                                            Link 2
                                            <span className="badge badge-success">NEW</span>
                                        </Button>
                                        <Button className="mb-2 mr-2" color="link">
                                            Link 3
                                            <span className="badge badge-danger">NEW</span>
                                        </Button>
                                        <Button className="mb-2 mr-2" color="link">
                                            Link 4
                                            <span className="badge badge-warning">NEW</span>
                                        </Button>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <br/><br/><br/><br/><br/><br/><br/><br/>
                    </div>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
};

export default LabelsExamples;
