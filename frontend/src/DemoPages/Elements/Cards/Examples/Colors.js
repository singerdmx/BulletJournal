import React, {Component, Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {
    Row, Col,
    Card, CardImg, CardText, CardBody, CardImgOverlay,
    CardTitle, CardHeader, CardFooter
} from 'reactstrap';

class CardsColors extends Component {

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
                        <Col md="4">
                            <Card body className="card-shadow-primary border mb-3" outline color="primary">
                                <CardTitle>Primary Card Shadow</CardTitle>
                                With supporting text below as a natural lead-in to additional
                                    content.
                            </Card>
                            <Card body className="card-shadow-secondary border mb-3" outline color="secondary">
                                <CardTitle>Secondary Card Shadow</CardTitle>
                                With supporting text below as a natural lead-in to additional
                                    content.
                            </Card>

                            <Card body className="card-shadow-warning border mb-3" outline color="warning">
                                <CardTitle>Warning Card Shadow</CardTitle>
                                With supporting text below as a natural lead-in to additional
                                    content.
                            </Card>
                            <Card body className="card-shadow-danger border mb-3" outline color="danger">
                                <CardTitle>Danger Card Shadow</CardTitle>
                                With supporting text below as a natural lead-in to additional
                                    content.
                            </Card>
                            <Card body className="card-shadow-success border mb-3" outline color="success">
                                <CardTitle>Success Card Shadow</CardTitle>
                                With supporting text below as a natural lead-in to additional
                                    content.
                            </Card>
                            <Card body className="card-shadow-info border mb-3" outline color="info">
                                <CardTitle>Info Card Shadow</CardTitle>
                                With supporting text below as a natural lead-in to additional
                                    content.
                            </Card>
                            <Card body className="card-shadow-focus border mb-3" outline color="focus">
                                <CardTitle>Focus Card Shadow</CardTitle>
                                With supporting text below as a natural lead-in to additional
                                    content.
                            </Card>
                            <Card body className="card-shadow-alternate border mb-3" outline color="alternate">
                                <CardTitle>Alternate Card Shadow</CardTitle>
                                With supporting text below as a natural lead-in to additional
                                    content.
                            </Card>
                            <Card className="mb-3" inverse>
                                <CardImg width="100%"
                                         src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97270&w=318&h=270&bg=333333&txtclr=666666"
                                         alt="Card image cap"/>
                                <CardImgOverlay>
                                    <CardTitle className="text-white">Card Title</CardTitle>
                                    This is a wider card with supporting text below as a natural lead-in to
                                        additional content. This content is a little bit longer.

                                        <small className="text-white">Last updated 3 mins ago</small>

                                </CardImgOverlay>
                            </Card>
                        </Col>
                        <Col md="4">
                            <Card body className="card-border mb-3" outline color="primary">
                                <CardTitle>Primary Card Border</CardTitle>
                                With supporting text below as a natural lead-in to additional
                                    content.
                            </Card>
                            <Card body className="card-border mb-3" outline color="secondary">
                                <CardTitle>Secondary Card Border</CardTitle>
                                With supporting text below as a natural lead-in to additional
                                    content.
                            </Card>

                            <Card body className="card-border mb-3" outline color="warning">
                                <CardTitle>Warning Card Border</CardTitle>
                                With supporting text below as a natural lead-in to additional
                                    content.
                            </Card>
                            <Card body className="card-border mb-3" outline color="danger">
                                <CardTitle>Danger Card Border</CardTitle>
                                With supporting text below as a natural lead-in to additional
                                    content.
                            </Card>
                            <Card body className="card-border mb-3" outline color="success">
                                <CardTitle>Success Card Border</CardTitle>
                                With supporting text below as a natural lead-in to additional
                                    content.
                            </Card>
                            <Card body className="card-border mb-3" outline color="info">
                                <CardTitle>Info Card Border</CardTitle>
                                With supporting text below as a natural lead-in to additional
                                    content.
                            </Card>
                            <Card body className="card-border mb-3" outline color="focus">
                                <CardTitle>Focus Card Border</CardTitle>
                                With supporting text below as a natural lead-in to additional
                                    content.
                            </Card>
                            <Card body className="card-border mb-3" outline color="alternate">
                                <CardTitle>Alternate Card Border</CardTitle>
                                With supporting text below as a natural lead-in to additional
                                    content.
                            </Card>
                        </Col>
                        <Col md="4">
                            <Card className="mb-3" inverse color="primary">
                                <CardHeader>Header</CardHeader>
                                <CardBody>
                                    With supporting text below as a natural lead-in to additional
                                        content.
                                </CardBody>
                                <CardFooter>Footer</CardFooter>
                            </Card>
                            <Card className="mb-3" body inverse style={{backgroundColor: '#333', borderColor: '#333'}}>
                                <CardTitle className="text-white">Special Title Treatment</CardTitle>
                                With supporting text below as a natural lead-in to additional
                                    content.
                            </Card>
                            <Card className="mb-3" body inverse color="primary">
                                <CardTitle className="text-white">Special Title Treatment</CardTitle>
                                With supporting text below as a natural lead-in to additional
                                    content.
                            </Card>
                            <Card className="mb-3" body inverse color="success">
                                <CardTitle className="text-white">Special Title Treatment</CardTitle>
                                With supporting text below as a natural lead-in to additional
                                    content.
                            </Card>
                            <Card className="mb-3" body inverse color="danger">
                                <CardTitle className="text-white">Special Title Treatment</CardTitle>
                                With supporting text below as a natural lead-in to additional
                                    content.
                            </Card>
                            <Card className="mb-3" body inverse color="info">
                                <CardTitle className="text-white">Special Title Treatment</CardTitle>
                                With supporting text below as a natural lead-in to additional
                                    content.
                            </Card>
                            <Card className="mb-3" body inverse color="warning">
                                <CardTitle className="text-white">Special Title Treatment</CardTitle>
                                With supporting text below as a natural lead-in to additional
                                    content.
                            </Card>
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
};

export default CardsColors;
