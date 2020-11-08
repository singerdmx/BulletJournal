import React, {useState} from "react";
import {loadStripe} from "@stripe/stripe-js";
import {Elements} from "@stripe/react-stripe-js";
import {InputNumber, Select, Steps} from 'antd';
import {LoadingOutlined, SmileOutlined, SolutionOutlined,} from '@ant-design/icons';
import {CheckoutForm} from "./checkout.pages";
import './payment-page.styles.less'
import "antd/dist/antd.css";

import currencyList from "./currencyList.js";

const {Option} = Select;


const stripePromise = loadStripe("pk_test_6pRNASCoBOKtIshFeQd4XMUh");
const currencyOptions = currencyList.data.map((c) => ({
    label: `${c.CcyNm} - ${c.CtryNm}`,
    value: `${c.Ccy}`
}));

export const PaymentPage = () => {
    const {Step} = Steps;
    const [amount, setAmount] = useState(0);
    const [secret, setSecret] = useState({});
    const [received, setReceived] = useState(false);
    const [verification, setVerification] = useState(false);
    const [currency, setCurrency] = React.useState('usd');
    const amountOnChange = (e: any) => {
        setAmount(e);
    }
    const currencyOnChange = (e: string) => {
        setCurrency(e);
    }
    const paymentReceived = (flag: boolean) => {
        setReceived(flag);
    }
    const onClick = (event: any) => {
        event.preventDefault();
        const response: any = fetch('/api/paymentIntents', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({amount: amount * 100, currency: currency.toLowerCase()}),
        }).then(function (res) {
            res.text().then((secret) => {
                setSecret(secret);
                setVerification(true);
                return secret;
            })
        })
    }

    return (
        <div className="payment">
            <div className="title"> Make A Payment</div>
            <div className="currency">
                <InputNumber
                    onChange={amountOnChange}
                    min={1}
                    defaultValue={5}
                    style={{
                        width: 400,
                        marginRight: "1rem"
                    }}
                />

                <Select
                    showSearch
                    value={currency}
                    style={{width: 240, marginTop: "1rem"}}
                    onChange={currencyOnChange}
                >
                    {currencyOptions.map(opt => (
                        <Option key={opt.label} value={opt.value}>
                            {opt.label}
                        </Option>
                    ))}
                </Select>
            </div>
            <button className="confirmBtn" onClick={onClick}>Confirm</button>
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


