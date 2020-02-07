import React from 'react';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';

const FormInputGroupSizing = (props) => {
  return (
    <div>
      <InputGroup size="lg">
        <InputGroupAddon addonType="prepend">@lg</InputGroupAddon>
        <Input />
      </InputGroup>
      <br />
      <InputGroup>
        <InputGroupAddon addonType="prepend">@normal</InputGroupAddon>
        <Input />
      </InputGroup>
      <br />
      <InputGroup size="sm">
        <InputGroupAddon addonType="prepend">@sm</InputGroupAddon>
        <Input />
      </InputGroup>
    </div>
  );
};

export default FormInputGroupSizing;
