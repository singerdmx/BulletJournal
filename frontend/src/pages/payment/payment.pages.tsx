import React, {useState} from "react";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import {Radio, Steps} from 'antd';
import {LoadingOutlined, SmileOutlined, SolutionOutlined,} from '@ant-design/icons';
import {paymentIntentReceive} from '../../apis/paymentApis'
import 'antd/dist/antd.css';
import CheckoutForm from "./checkout.pages";
import './payment-page.styles.less'
import "antd/dist/antd.css";

const stripePromise = loadStripe("pk_test_6pRNASCoBOKtIshFeQd4XMUh");

export const PaymentPage = () => {
    const {Step} = Steps;
    const [amount, setAmount] = useState(0);
    const [secret, setSecret] = useState({});
    const [received, setReceived] = useState(false);
    const [verification, setVerification] = useState(false);
    const amountOnChange = (e: any) => {
        setAmount(e.target.value);
    }

    const paymentReceived = (flag: boolean) => {
        setReceived(flag);
    }
    const onClick = (event: any) => {
        event.preventDefault();
        const response: any = paymentIntentReceive(amount).then(function (res) {
            res.text().then((secret) => {
                setSecret(secret);
                setVerification(true);
                return secret;
            })
        })
    }
    const radioStyle = {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
    };
    return (
        <div className="payment">
            <div className="title"> Make A Payment</div>
            <div className="amount">
                <Radio.Group onChange={amountOnChange} value={amount}>
                    <Radio style={radioStyle} value={5}>
                        100 points ($5)
                    </Radio>
                    <Radio style={radioStyle} value={10}>
                        250 points ($10)
                    </Radio>
                    <Radio style={radioStyle} value={15}>
                        500 points ($15)
                    </Radio>
                </Radio.Group>

            </div>
            <button className="confirmBtn" disabled={amount === 0} onClick={onClick}>Confirm</button>
            <div className="steps">
                <Steps>
                    <Step status="finish" title="Confirm Amount" icon={<SolutionOutlined/>}/>
                    <Step status={verification ? "process" : "wait"} title="Pay" icon={<LoadingOutlined/>}/>
                    <Step status={received ? "process" : "wait"} title="Done" icon={<SmileOutlined/>}/>
                </Steps>
            </div>
            {verification && <div>
                <Elements stripe={stripePromise}>
                    <CheckoutForm secret={secret} paymentReceived={paymentReceived}/>
                </Elements></div>}
        </div>
    );
};


