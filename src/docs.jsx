/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useState } from "react";

import { Card, Col, Container, Nav, Row } from "react-bootstrap";

export const Docs = (props) => {

    const [card, setCard] = useState("#purpose");
    console.log("Docs: " + props.redeemToken);
    return (
        <>
            {props.redeemToken ?
                <h5 className="card-title">Please sign-in to complete signup.</h5>
                :
                props.error ?
                    <div>
                        <h5 className="card-title">You do not own or belong to any tenant.</h5>
                        <h5> Please create one or get invited to a tenant owned by someone else to complete the signin.</h5>
                    </div>
                    :
                    <Container className="text-justify">
                        <Row>
                            <Col>
                            <p>POC Implementation of a single Azure B2C directory providing user identity support for the AIP application that partitions
                                                        users into <b>application tenants</b>.  Since Azure Active Directory itself uses the term <b>tenant</b> when describing it's own instances, the term 
                                                        <b>application tenant</b> will be used to describe the tenancy that is implemented here.</p>
                                                    <p><i>Note that as implemented here, users may be <b>authenticated</b> using other Identity Providers but, <b>authorization</b> information including the 
                                                        <b>application tenant</b> and roles etc. will be provided by the single B2C directory used here.</i></p>
                                                    <p>This process here leverages some 'out of the box' policies that assume self-creation of a tenant.  These will be adjusted and split to require a separate application run by site
                                                        administrators that will create and provision the tenants, and a public facing application that will allow access by fund managers and investors based on our requirements and use cases.</p>
                            </Col>
                        </Row>
                    </Container>
            }
        </>)
}