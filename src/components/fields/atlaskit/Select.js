// @flow
import React from 'react';
import SingleSelect from '@atlaskit/single-select';
import FieldWrapper from './FieldWrapper';
import type { Field, FieldDef } from '../../../types';

class AtlaskitSelect extends React.Component<Field> {
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
    let defaultSelected;
    const stringValue: string | void = value ? value.toString() : undefined;
    const items = options.map(option => {
      const { heading, items = [] } = option;
      return {
        heading,
        items: items.map(item => {
          if (typeof item === 'string') {
            const _item = {
              content: item,
              value: item,
              isSelected: item === value
            };
            if (_item.isSelected) {
              defaultSelected = _item;
            }
            return _item;
          } else {
            const _item = {
              content: item.label || item.value,
              value: item.value,
              isSelected: item.value === value
            };
            if (_item.isSelected) {
              defaultSelected = _item;
            }
            return _item;
          }
        })
      };
    });

    return (
      <SingleSelect
        key={id}
        name={name}
        label={label}
        defaultSelected={defaultSelected}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        isInvalid={!isValid}
        value={stringValue}
        items={items}
        onSelected={evt => {
          onFieldChange(id, evt.item.value);
        }}
      />
    );
  }
}

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    {/* $FlowFixMe */}
    <AtlaskitSelect />
  </FieldWrapper>
);
