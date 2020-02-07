import React, {Component, Fragment} from 'react';
import {Button} from 'reactstrap';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {
    Row, Col,
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, CardLink, CardHeader, CardFooter
} from 'reactstrap';


class CardsBasic extends Component {

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
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Basic Example</CardTitle>

                                        <p>Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo
                                            ligula
                                            eget dolor. Aenean massa.</p>

                                </CardBody>
                            </Card>
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Card with Subtitle</CardTitle>
                                    <CardSubtitle>Lorem ipsum dolor sit amet, consectetuer adipiscing
                                        elit</CardSubtitle>

                                        <p>Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla
                                            consequat massa quis eni</p>

                                </CardBody>
                            </Card>
                            <Card className="mb-3" body>
                                <CardTitle>Special Title Treatment</CardTitle>
                                <p>With supporting text below as a natural lead-in to additional
                                    content.</p>
                                <Button color="primary">Go somewhere</Button>
                            </Card>
                            <Card className="mb-3 text-center" body>
                                <CardTitle>Special Title Treatment</CardTitle>
                                <p>With supporting text below as a natural lead-in to additional
                                    content.</p>
                                <Button color="danger">Go somewhere</Button>
                            </Card>
                            <Card className="mb-3 text-right" body>
                                <CardTitle>Special Title Treatment</CardTitle>
                                <p>With supporting text below as a natural lead-in to additional
                                    content.</p>
                                <Button outline color="focus">Go somewhere</Button>
                            </Card>
                            <Card className="main-card mb-3">
                                <CardHeader>Header</CardHeader>
                                <CardBody>
                                    <CardTitle>Special Title Treatment</CardTitle>
                                    <p>With supporting text below as a natural lead-in to additional
                                        content.</p>
                                    <Button color="warning">Go somewhere</Button>
                                </CardBody>
                                <CardFooter>Footer</CardFooter>
                            </Card>
                        </Col>
                        <Col md="4">
                            <Card className="main-card mb-3">
                                <CardImg top width="100%"
                                         src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
                                         alt="Card image cap"/>
                                <CardBody>
                                    <CardTitle>Card title</CardTitle>
                                    <CardSubtitle>Card subtitle</CardSubtitle>
                                    Some quick example text to build on the card title and make up the bulk of
                                        the
                                        card's content.
                                    <Button>Button</Button>
                                </CardBody>
                            </Card>
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Card Title</CardTitle>
                                    <p>This is a wider card with supporting text below as a natural lead-in to
                                        additional content. This content is a little bit longer.</p>

                                        <small className="text-muted">Last updated 3 mins ago</small>

                                </CardBody>
                                <CardImg bottom width="100%"
                                         src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
                                         alt="Card image cap"/>
                            </Card>
                        </Col>
                        <Col md="4">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Card title</CardTitle>
                                    <CardSubtitle className="mb-0">Card subtitle</CardSubtitle>
                                </CardBody>
                                <img width="100%"
                                     src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
                                     alt="Card image cap"/>
                                <CardBody>
                                    Some quick example text to build on the card title and make up the bulk of
                                        the
                                        card's content.
                                    <CardLink href="javascript:void(0);">Card Link</CardLink>
                                    <CardLink href="javascript:void(0);">Another Link</CardLink>
                                </CardBody>
                            </Card>
                            <Card className="main-card mb-3">
                                <CardImg top width="100%"
                                         src="https://placeholdit.imgix.net/~text?txtsize=33&txt=318%C3%97180&w=318&h=180"
                                         alt="Card image cap"/>
                                <CardBody>
                                    <CardTitle>Card Title</CardTitle>
                                    <p>This is a wider card with supporting text below as a natural lead-in to
                                        additional content. This content is a little bit longer.</p>

                                        <small className="text-muted">Last updated 3 mins ago</small>

                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
};

export default CardsBasic;
