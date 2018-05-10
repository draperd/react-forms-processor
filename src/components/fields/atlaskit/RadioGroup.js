// @flow
import React from 'react';
import RadioGroup from '@atlaskit/field-radio-group';
import FieldWrapper from './FieldWrapper';
import type { Field, FieldDef } from '../../../types';

class AtlaskitRadioGroup extends React.Component<Field> {
  render() {
    const {
      disabled,
      id,
      isValid,
      name,
      options = [],
      placeholder,
      required,
      value,
      label,
      onFieldChange
    } = this.props;
    const stringValue: string | void = value ? value.toString() : undefined;
    const items = options.reduce((itemsSoFar, option) => {
      return itemsSoFar.concat(
        option.items.map(item => {
          if (typeof item === 'string') {
            const _item = {
              label: item,
              value: item,
              isSelected: item === value
            };
            return _item;
          } else {
            const _item = {
              label: item.label || item.value,
              value: item.value,
              isSelected: item.value === value
            };
            return _item;
          }
        })
      );
    }, []);

    return (
      <RadioGroup
        key={id}
        name={name}
        label={label}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        isInvalid={!isValid}
        value={stringValue}
        items={items}
        onRadioChange={(evt: any) => onFieldChange(id, evt.target.value)}
      />
    );
  }
}

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    {/* $FlowFixMe */}
    <AtlaskitRadioGroup />
  </FieldWrapper>
);
