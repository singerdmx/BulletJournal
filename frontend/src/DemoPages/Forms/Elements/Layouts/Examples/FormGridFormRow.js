import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Col, Row, Card, CardBody,
    CardTitle, Button, Form, FormGroup, Label, Input
} from 'reactstrap';

import FormInline from './FormInline';

export default class FormGridFormRow extends React.Component {
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
                    <Card className="main-card mb-3">
                        <CardBody>
                            <CardTitle>Grid Rows</CardTitle>
                            <Form>
                                <Row form>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="exampleEmail11">Email</Label>
                                            <Input type="email" name="email" id="exampleEmail11"
                                                   placeholder="with a placeholder"/>
                                        </FormGroup>
                                    </Col>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="examplePassword11">Password</Label>
                                            <Input type="password" name="password" id="examplePassword11"
                                                   placeholder="password placeholder"/>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <FormGroup>
                                    <Label for="exampleAddress">Address</Label>
                                    <Input type="text" name="address" id="exampleAddress"
                                           placeholder="1234 Main St"/>
                                </FormGroup>
                                <FormGroup>
                                    <Label for="exampleAddress2">Address 2</Label>
                                    <Input type="text" name="address2" id="exampleAddress2"
                                           placeholder="Apartment, studio, or floor"/>
                                </FormGroup>
                                <Row form>
                                    <Col md={6}>
                                        <FormGroup>
                                            <Label for="exampleCity">City</Label>
                                            <Input type="text" name="city" id="exampleCity"/>
                                        </FormGroup>
                                    </Col>
                                    <Col md={4}>
                                        <FormGroup>
                                            <Label for="exampleState">State</Label>
                                            <Input type="text" name="state" id="exampleState"/>
                                        </FormGroup>
                                    </Col>
                                    <Col md={2}>
                                        <FormGroup>
                                            <Label for="exampleZip">Zip</Label>
                                            <Input type="text" name="zip" id="exampleZip"/>
                                        </FormGroup>
                                    </Col>
                                </Row>
                                <FormGroup check>
                                    <Input type="checkbox" name="check" id="exampleCheck"/>
                                    <Label for="exampleCheck" check>Check me out</Label>
                                </FormGroup>
                                <Button color="primary" className="mt-2">Sign in</Button>
                            </Form>

                        </CardBody>
                    </Card>
                    <Card className="main-card mb-3">
                        <CardBody>
                            <CardTitle>Inline</CardTitle>
                            <FormInline/>
                        </CardBody>
                    </Card>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
}
