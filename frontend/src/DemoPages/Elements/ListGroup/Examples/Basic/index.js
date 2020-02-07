import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Row, Col,
    Card, CardBody,
    CardTitle
} from 'reactstrap';

import ListGroupDefault from './ListGroup';
import ListGroupAnchorsAndButtons from './ListGroupAnchorsAndButtons';
import ListGroupBadge from './ListGroupBadge';
import ListGroupContextualClasses from './ListGroupContextualClasses';
import ListGroupCustomContent from './ListGroupCustomContent';
import ListGroupDisabledItems from './ListGroupDisabledItems';
import ListGroupFlush from './ListGroupFlush';

const ListGroupExampleBasic = (props) => {
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
                    <Col md="6">
                        <Card className="main-card mb-3">
                            <CardBody>
                                <CardTitle>List group</CardTitle>
                                <ListGroupDefault/>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="6">
                        <Card className="main-card mb-3">
                            <CardBody>
                                <CardTitle>List group buttons</CardTitle>
                                <ListGroupAnchorsAndButtons/>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="6">
                        <Card className="main-card mb-3">
                            <CardBody>
                                <CardTitle>List group badges</CardTitle>
                                <ListGroupBadge/>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="6">
                        <Card className="main-card mb-3">
                            <CardBody>
                                <CardTitle>List group contextual classes</CardTitle>
                                <ListGroupContextualClasses/>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="6">
                        <Card className="main-card mb-3">
                            <CardBody>
                                <CardTitle>List group custom content</CardTitle>
                                <ListGroupCustomContent/>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="6">
                        <Card className="main-card mb-3">
                            <CardBody>
                                <CardTitle>List group disabled items</CardTitle>
                                <ListGroupDisabledItems/>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col md="6">
                        <Card className="main-card mb-3">
                            <CardBody>
                                <CardTitle>List group without border</CardTitle>
                                <ListGroupFlush/>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </ReactCSSTransitionGroup>
        </Fragment>
    );
};

export default ListGroupExampleBasic;
