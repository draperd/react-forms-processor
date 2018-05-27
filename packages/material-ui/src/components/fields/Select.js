// @flow
import React from "react";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormHelperText from "@material-ui/core/FormHelperText";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import { FieldWrapper } from "react-forms-processor";
import type { Field, FieldDef } from "../../../../../types";

class MaterialUiSelect extends React.Component<Field> {
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
    const items = options.reduce((itemsSoFar, option) => {
      return itemsSoFar.concat(
        option.items.map(item => {
          if (typeof item === "string") {
            return <MenuItem value={item}>{item}</MenuItem>;
          } else {
            return (
              <MenuItem value={item.value}>{item.label || item.value}</MenuItem>
            );
          }
        })
      );
    }, []);

    return (
      <FormControl key={id} disabled={disabled}>
        <InputLabel htmlFor={id}>{label}</InputLabel>
        <Select
          value={value}
          onChange={evt => {
            onFieldChange(id, evt.item.value);
          }}
          input={<Input name={name} id={id} />}
        >
          {items}
        </Select>
      </FormControl>
    );
  }
}

export default (props: FieldDef) => (
  <FieldWrapper {...props}>
    {/* $FlowFixMe */}
    <MaterialUiSelect />
  </FieldWrapper>
);
