// @flow
import React, { Component } from "react";
import type { FieldDef, OnFieldChange } from "../types";

type DefaultFieldProps = {
  field: FieldDef,
  onChange: OnFieldChange
};

export default class DefaultField extends Component<DefaultFieldProps, void> {
  render() {
    const { field, onChange } = this.props;
    const { name, id, value, type, placeholder, disabled, required } = field;
    const checked = type === "checkbox" ? value : undefined;
    return (
      <div>
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          checked={checked}
          onChange={evt =>
            onChange(
              id,
              type === "checkbox" ? evt.target.checked : evt.target.value
            )
          }
        />
      </div>
    );
  }
}
