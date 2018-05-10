// @flow
import React from 'react';
import Checkbox from '@atlaskit/checkbox';
import FieldWrapper from './FieldWrapper';
import type { Field, FieldDef } from '../../../types';

class AtlaskitCheckbox extends React.Component<Field> {
  render() {
    const {
      disabled,
      id,
      isValid,
      name,
      onFieldChange,
      value,
      label
    } = this.props;
    const stringValue: string | void = value ? value.toString() : undefined;
    return (
      //$FlowFixMe
      <Checkbox
        key={id}
        name={name}
        label={label}
        isDisabled={disabled}
        isInvalid={!isValid}
        value={stringValue}
        initiallyChecked={value}
        onChange={evt => onFieldChange(id, evt.isChecked)}
      />
    );
  }
}

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    {/* $FlowFixMe */}
    <AtlaskitCheckbox />
  </FieldWrapper>
);
