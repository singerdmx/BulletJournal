import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import {
    Card, CardBody, Row, Col,
    CardTitle, Form, FormGroup, Label, Input, FormFeedback, FormText
} from 'reactstrap';

export default class FormsFeedback extends React.Component {
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
                                    <CardBody>
                                        <CardTitle>Basic</CardTitle>
                                        <Form>
                                            <FormGroup>
                                                <Label for="exampleEmail">Input without validation</Label>
                                                <Input/>
                                                <FormFeedback>You will not be able to see this</FormFeedback>
                                                <FormText>Example help text that remains unchanged.</FormText>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="exampleEmail">Valid input</Label>
                                                <Input valid/>
                                                <FormFeedback valid>Sweet! that name is available</FormFeedback>
                                                <FormText>Example help text that remains unchanged.</FormText>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="examplePassword">Invalid input</Label>
                                                <Input invalid/>
                                                <FormFeedback>Oh noes! that name is already taken</FormFeedback>
                                                <FormText>Example help text that remains unchanged.</FormText>
                                            </FormGroup>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                            <Col md="6">
                                <Card className="main-card mb-3">
                                    <CardBody className="pb-5">
                                        <CardTitle>Alternate Style</CardTitle>
                                        <Form>
                                            <FormGroup>
                                                <Label for="exampleEmail">Input without validation</Label>
                                                <Input/>
                                                <FormFeedback tooltip>You will not be able to see this</FormFeedback>
                                                <FormText>Example help text that remains unchanged.</FormText>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="exampleEmail">Valid input</Label>
                                                <Input valid/>
                                                <FormFeedback valid tooltip>Sweet! that name is available</FormFeedback>
                                                <FormText>Example help text that remains unchanged.</FormText>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="examplePassword">Invalid input</Label>
                                                <Input invalid/>
                                                <FormFeedback tooltip>Oh noes! that name is already taken</FormFeedback>
                                                <FormText>Example help text that remains unchanged.</FormText>
                                            </FormGroup>
                                        </Form>
                                    </CardBody>
                                </Card>
                            </Col>
                        </Row>
                        <br/><br/><br/><br/><br/><br/>
                        <br/><br/><br/><br/><br/><br/>
                    </div>
                </ReactCSSTransitionGroup>
            </Fragment>
        );
    }
}
