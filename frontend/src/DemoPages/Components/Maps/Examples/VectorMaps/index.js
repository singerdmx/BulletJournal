import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Row, Col,
    Card, CardBody,
    CardTitle
} from 'reactstrap';

// Examples

import VectorMapsBasic from './Basic'
import VectorMapsMarkers from './Markers'
import VectorMapsDatasets from './Datasets'
import VectorMapsAnimated from './Animated'

class VectorMapsExample extends React.Component {

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
                                    <CardTitle>
                                        Basic
                                    </CardTitle>
                                    <VectorMapsBasic/>
                                </CardBody>
                            </Card>
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>
                                        Datasets
                                    </CardTitle>
                                    <VectorMapsDatasets/>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col lg="6">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>
                                        Animated
                                    </CardTitle>
                                    <VectorMapsAnimated/>
                                </CardBody>
                            </Card>
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>
                                        Markers
                                    </CardTitle>
                                    <VectorMapsMarkers/>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>
        )
    }
}

export default VectorMapsExample;
