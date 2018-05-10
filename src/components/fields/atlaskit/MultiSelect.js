// @flow
import React from 'react';
import MultiSelect from '@atlaskit/multi-select';
import FieldWrapper from './FieldWrapper';
import type { Field, FieldDef } from '../../../types';

class AtlaskitMultiSelect extends React.Component<Field> {
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
    const defaultSelectItems = [];
    const stringValue: string | void = value ? value.toString() : undefined;
    const items = options.map(option => ({
      heading: option.heading,
      items: option.items.map(item => {
        if (typeof item === 'string') {
          let isSelected = false;
          if (value && Array.isArray(value) && value.includes(item)) {
            isSelected = true;
          }
          const _item = {
            content: item,
            value: item,
            isSelected
          };
          if (_item.isSelected) {
            defaultSelectItems.push(_item);
          }
          return _item;
        } else {
          let isSelected = false;
          if (value && Array.isArray(value) && value.includes(item.value)) {
            isSelected = true;
          }
          const _item = {
            content: item.label || item.value,
            value: item.value,
            isSelected
          };
          if (_item.isSelected) {
            defaultSelectItems.push(_item);
          }
          return _item;
        }
      })
    }));

    return (
      <div key={id}>
        <MultiSelect
          key={id}
          name={name}
          label={label}
          defaultSelected={defaultSelectItems}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          isInvalid={!isValid}
          value={stringValue}
          items={items}
          onSelectedChange={evt => {
            onFieldChange(id, evt.items.map(item => item.value));
          }}
        />
      </div>
    );
  }
}

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    {/* $FlowFixMe */}
    <AtlaskitMultiSelect />
  </FieldWrapper>
);
