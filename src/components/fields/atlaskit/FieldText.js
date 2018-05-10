// @flow
import React from 'react';
import FieldText from '@atlaskit/field-text';
import FieldWrapper from './FieldWrapper';
import type { Field, FieldDef } from '../../../types';

class AtlaskitFieldText extends React.Component<Field> {
  render() {
    const {
      disabled,
      errorMessages,
      id,
      isValid,
      name,
      onFieldChange,
      placeholder,
      required,
      value,
      label
    } = this.props;
    return (
      <FieldText
        key={id}
        name={name}
        label={label}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        isInvalid={!isValid}
        invalidMessage={errorMessages}
        value={value}
        onChange={(evt: any) => onFieldChange(id, evt.target.value)}
      />
    );
  }
}

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    {/* $FlowFixMe */}
    <AtlaskitFieldText />
  </FieldWrapper>
);
