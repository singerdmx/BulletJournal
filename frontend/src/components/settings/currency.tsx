import React from 'react';
import { Select } from 'antd';
import _ from 'lodash';
import 'flag-icon-css/css/flag-icon.css'; //flag icon
var LocaleCurrency = require('locale-currency'); //currency code
var cc = require('country-code'); //contry alpha2 code
const { Option } = Select;

type CurrencyProps = {};

class CurrencyPicker extends React.Component<CurrencyProps> {
  render() {
    const a = cc.countries.CHN;

    return (
      <span>
        <Select
          showSearch={true}
          style={{ width: 300 }}
          placeholder='Select a before'
          value={
            <span>
              <span
                style={{ width: '20px' }}
                className={`flag-icon flag-icon-${a.alpha2.toLowerCase()}`}
              ></span>
              <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{a.name}</span>
              <span>
                &nbsp;&nbsp; (
                {LocaleCurrency.getCurrency(a.alpha2.toLowerCase())})
              </span>
            </span>
          }
        >
          {_.map(cc.countries, country => (
            <Option
              title={country.name + ' (' +
                LocaleCurrency.getCurrency(country.alpha2.toLowerCase()) + ')'}
              key={country.name}
              value={
                country.name +
                LocaleCurrency.getCurrency(country.alpha2.toLowerCase())
              }
            >
              <span>
                <span
                  style={{ width: '20px' }}
                  className={`flag-icon flag-icon-${country.alpha2.toLowerCase()}`}
                ></span>
                <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{country.name}</span>
                <span>
                  &nbsp;&nbsp; (
                  {LocaleCurrency.getCurrency(country.alpha2.toLowerCase())})
                </span>
              </span>
            </Option>
          ))}
        </Select>
      </span>
    );
  }
}

export default CurrencyPicker;
