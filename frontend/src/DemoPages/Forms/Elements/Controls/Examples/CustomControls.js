import React, {Fragment} from 'react';
import {
    Row, Col,
    Card, CardBody,
    CardTitle,
    CustomInput, Form, FormGroup, Label
} from 'reactstrap';

export default class FormsCustomControls extends React.Component {
    render() {
        return (
            <Fragment>
                <Form>
                    <Row>
                        <Col md="6">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Checkboxes</CardTitle>
                                    <FormGroup>
                                        <div>
                                            <CustomInput type="checkbox" id="exampleCustomCheckbox"
                                                         label="Check this custom checkbox"/>
                                            <CustomInput type="checkbox" id="exampleCustomCheckbox2"
                                                         label="Or this one"/>
                                            <CustomInput type="checkbox" id="exampleCustomCheckbox3"
                                                         label="But not this disabled one"
                                                         disabled/>
                                        </div>
                                    </FormGroup>
                                </CardBody>
                            </Card>
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Inline</CardTitle>
                                    <FormGroup>
                                        <div>
                                            <CustomInput type="checkbox" id="exampleCustomInline"
                                                         label="An inline custom input"
                                                         inline/>
                                            <CustomInput type="checkbox" id="exampleCustomInline2"
                                                         label="and another one" inline/>
                                        </div>
                                    </FormGroup>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="6">
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Radios</CardTitle>
                                    <FormGroup>
                                        <div>
                                            <CustomInput type="radio" id="exampleCustomRadio" name="customRadio"
                                                         label="Select this custom radio"/>
                                            <CustomInput type="radio" id="exampleCustomRadio2" name="customRadio"
                                                         label="Or this one"/>
                                            <CustomInput type="radio" id="exampleCustomRadio3"
                                                         label="But not this disabled one"
                                                         disabled/>
                                        </div>
                                    </FormGroup>
                                </CardBody>
                            </Card>
                            <Card className="main-card mb-3">
                                <CardBody>
                                    <CardTitle>Form Select</CardTitle>
                                    <Row>
                                        <Col md="6">
                                            <FormGroup>
                                                <Label for="exampleCustomSelect">Custom Select</Label>
                                                <CustomInput type="select" id="exampleCustomSelect"
                                                             name="customSelect">
                                                    <option value="">Select</option>
                                                    <option>Value 1</option>
                                                    <option>Value 2</option>
                                                    <option>Value 3</option>
                                                    <option>Value 4</option>
                                                    <option>Value 5</option>
                                                </CustomInput>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="exampleCustomMutlipleSelect">Custom Multiple
                                                    Select</Label>
                                                <CustomInput type="select" id="exampleCustomMutlipleSelect"
                                                             name="customSelect"
                                                             multiple>
                                                    <option value="">Select</option>
                                                    <option>Value 1</option>
                                                    <option>Value 2</option>
                                                    <option>Value 3</option>
                                                    <option>Value 4</option>
                                                    <option>Value 5</option>
                                                </CustomInput>
                                            </FormGroup>
                                        </Col>
                                        <Col md="6">
                                            <FormGroup>
                                                <Label for="exampleCustomSelectDisabled">Custom Select
                                                    Disabled</Label>
                                                <CustomInput type="select" id="exampleCustomSelectDisabled"
                                                             name="customSelect"
                                                             disabled>
                                                    <option value="">Select</option>
                                                    <option>Value 1</option>
                                                    <option>Value 2</option>
                                                    <option>Value 3</option>
                                                    <option>Value 4</option>
                                                    <option>Value 5</option>
                                                </CustomInput>
                                            </FormGroup>
                                            <FormGroup>
                                                <Label for="exampleCustomMutlipleSelectDisabled">Custom Multiple
                                                    Select
                                                    Disabled</Label>
                                                <CustomInput type="select" id="exampleCustomMutlipleSelectDisabled"
                                                             name="customSelect" multiple
                                                             disabled>
                                                    <option value="">Select</option>
                                                    <option>Value 1</option>
                                                    <option>Value 2</option>
                                                    <option>Value 3</option>
                                                    <option>Value 4</option>
                                                    <option>Value 5</option>
                                                </CustomInput>
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Form>
            </Fragment>
        );
    }
}
