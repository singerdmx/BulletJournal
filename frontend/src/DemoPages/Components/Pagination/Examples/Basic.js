import React, {Fragment} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import {
    Row, Col,
    Card, CardBody,
    CardTitle,
    Pagination, PaginationItem, PaginationLink
} from 'reactstrap';

const BasicPagination = (props) => {
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
                                <CardTitle>Basic</CardTitle>
                                <Pagination aria-label="Page navigation example">
                                    <PaginationItem>
                                        <PaginationLink previous href="javascript:void(0);"/>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="javascript:void(0);">
                                            1
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem active>
                                        <PaginationLink href="javascript:void(0);">
                                            2
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="javascript:void(0);">
                                            3
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="javascript:void(0);">
                                            4
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="javascript:void(0);">
                                            5
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink next href="javascript:void(0);"/>
                                    </PaginationItem>
                                </Pagination>
                            </CardBody>
                        </Card>
                        <Card className="main-card mb-3">
                            <CardBody>
                                <CardTitle>Rounded</CardTitle>
                                <Pagination className="pagination-rounded" aria-label="Page navigation example">
                                    <PaginationItem>
                                        <PaginationLink previous href="javascript:void(0);"/>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="javascript:void(0);">
                                            1
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem active>
                                        <PaginationLink href="javascript:void(0);">
                                            2
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="javascript:void(0);">
                                            3
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="javascript:void(0);">
                                            4
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="javascript:void(0);">
                                            5
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink next href="javascript:void(0);"/>
                                    </PaginationItem>
                                </Pagination>
                            </CardBody>
                        </Card>
                    </Col>
                    <Col lg="6">
                        <Card className="main-card mb-3">
                            <CardBody>
                                <CardTitle>Sizing</CardTitle>
                                <Pagination size="sm" aria-label="Page navigation example">
                                    <PaginationItem>
                                        <PaginationLink previous href="javascript:void(0);"/>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="javascript:void(0);">
                                            1
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="javascript:void(0);">
                                            2
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="javascript:void(0);">
                                            3
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="javascript:void(0);">
                                            4
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="javascript:void(0);">
                                            5
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink next href="javascript:void(0);"/>
                                    </PaginationItem>
                                </Pagination>
                                <div className="divider"/>
                                <Pagination aria-label="Page navigation example">
                                    <PaginationItem>
                                        <PaginationLink previous href="javascript:void(0);"/>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="javascript:void(0);">
                                            1
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="javascript:void(0);">
                                            2
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="javascript:void(0);">
                                            3
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink next href="javascript:void(0);"/>
                                    </PaginationItem>
                                </Pagination>
                                <div className="divider"/>
                                <Pagination size="lg" aria-label="Page navigation example">
                                    <PaginationItem>
                                        <PaginationLink previous href="javascript:void(0);"/>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="javascript:void(0);">
                                            1
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="javascript:void(0);">
                                            2
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink href="javascript:void(0);">
                                            3
                                        </PaginationLink>
                                    </PaginationItem>
                                    <PaginationItem>
                                        <PaginationLink next href="javascript:void(0);"/>
                                    </PaginationItem>
                                </Pagination>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </ReactCSSTransitionGroup>
        </Fragment>
    );
};

export default BasicPagination;
