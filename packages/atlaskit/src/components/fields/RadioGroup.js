// @flow
import React from "react";
import RadioGroup from "@atlaskit/field-radio-group";
import { FieldWrapper } from "react-forms-processor";
import styled from "styled-components";
import type { Field, FieldDef } from "react-forms-processor";
import { Field as AkField } from "@atlaskit/form";

// NOTE: Temporary hack to workaround the problem of duplicate label appearing - this can stop being used as soon as Atlaskit forms support Radio Groups properly
const Layout = styled.div`
  label {
    height: 0;
  }
`;

class AtlaskitRadioGroup extends React.Component<Field> {
  render() {
    const {
      description,
      disabled,
      errorMessages,
      id,
      isValid,
      name,
      options = [],
      placeholder,
      required,
      value,
      label,
      onFieldFocus,
      onFieldBlur,
      onFieldChange
    } = this.props;
    const stringValue: string | void = value ? value.toString() : undefined;
    const items = options.reduce((itemsSoFar, option) => {
      if (!option.items) {
        return [];
      }
      return itemsSoFar.concat(
        option.items.map(item => {
          if (typeof item === "string") {
            const _item = {
              label: item,
              value: item,
              isSelected: item === value,
              isDisabled: disabled
            };
            return _item;
          } else {
            const _item = {
              label: item.label || item.value,
              value: item.value,
              isSelected: item.value === value,
              isDisabled: disabled
            };
            return _item;
          }
        })
      );
    }, []);

    return (
      <AkField
        label={label}
        helperText={description}
        isRequired={required}
        isInvalid={!isValid}
        invalidMessage={errorMessages}
        validateOnBlur={false}
      >
        <Layout>
          <RadioGroup
            name={name}
            placeholder={placeholder}
            value={stringValue}
            items={items}
            onRadioChange={(evt: any) => onFieldChange(id, evt.target.value)}
            onFocus={() => onFieldFocus(id)}
            onBlur={() => onFieldBlur(id)}
          />
        </Layout>
      </AkField>
    );
  }
}

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    {/* $FlowFixMe */}
    <AtlaskitRadioGroup />
  </FieldWrapper>
);
