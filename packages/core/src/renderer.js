// @flow
import React from "react";
import type {
  FieldRenderer,
  FieldDef,
  OnFieldChange,
  OnFieldFocus,
  Option
} from "./types";

const mapOptionItems = (optionGroupItems: Option[]) =>
  optionGroupItems.map(item => {
    if (typeof item === "string") {
      return (
        <option key={item} value={item}>
          {item}
        </option>
      );
    } else {
      return (
        <option key={item.value} value={item.value}>
          {item.label || item.value}
        </option>
      );
    }
  });

const renderSelect = (
  field: FieldDef,
  onChange: OnFieldChange,
  onFieldFocus: OnFieldFocus,
  multiple: boolean
) => {
  const {
    disabled,
    id,
    name,
    required,
    value,
    label,
    options = [],
    valueDelimiter
  } = field;

  let items = [];
  options.forEach(optionGroup => {
    const { heading } = optionGroup;
    const optionItems = mapOptionItems(optionGroup.items);
    if (heading) {
      items.push(
        <optgroup key={heading} label={heading}>
          {optionItems}
        </optgroup>
      );
    } else {
      items = items.concat(optionItems);
    }
  });

  let processedValue = value;
  if (valueDelimiter && typeof value === "string" && multiple) {
    processedValue = value.split(valueDelimiter);
  }

  if (processedValue && !Array.isArray(processedValue) && multiple) {
    processedValue = [processedValue];
  }

  return (
    <div key={id}>
      <label htmlFor={id}>{label}</label>
      <select
        multiple={multiple}
        id={id}
        name={name}
        value={processedValue}
        disabled={disabled}
        required={required}
        onFocus={() => onFieldFocus(id)}
        onChange={evt => {
          if (multiple) {
            const options = evt.target.options;
            const value = [...evt.target.options]
              .filter(({ selected }) => selected)
              .map(({ value }) => value);
            onChange(id, value);
          } else {
            onChange(id, evt.target.value);
          }
        }}
      >
        {items}
      </select>
    </div>
  );
};

const renderer: FieldRenderer = (field, onChange, onFieldFocus) => {
  const {
    disabled = false,
    errorMessages,
    id,
    isValid,
    name,
    placeholder,
    required,
    type,
    value,
    label,
    options = []
  } = field;
  let items;
  switch (type) {
    case "checkbox":
      return (
        <div key={id}>
          <label htmlFor={id}>{label}</label>
          <input
            type={type}
            id={id}
            name={name}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            checked={value}
            onChange={evt => onChange(id, evt.target.checked)}
            onFocus={() => onFieldFocus(id)}
          />
        </div>
      );
    case "select":
      return renderSelect(field, onChange, onFieldFocus, false);

    case "multiselect":
      return renderSelect(field, onChange, onFieldFocus, true);

    case "radiogroup":
      items = options.reduce((itemsSoFar, option) => {
        return itemsSoFar.concat(
          option.items.map((item, index) => {
            const inputId = `${id}_${index}`;
            if (typeof item === "string") {
              return (
                <div key={inputId}>
                  <input
                    id={inputId}
                    type="radio"
                    name={name}
                    value={item}
                    checked={item === value}
                    onChange={evt => onChange(id, evt.target.value)}
                    onFocus={() => onFieldFocus(id)}
                  />
                  <label htmlFor={inputId}>{item}</label>
                </div>
              );
            } else {
              return (
                <div key={inputId}>
                  <input
                    id={inputId}
                    type="radio"
                    name={name}
                    value={item.value}
                    checked={item.value === value}
                    onChange={evt => onChange(id, evt.target.value)}
                    onFocus={() => onFieldFocus(id)}
                  />
                  <label htmlFor={inputId}>{item.label || item.value}</label>
                </div>
              );
            }
          })
        );
      }, []);
      return <div key={id}>{items}</div>;
    default:
      const checked = type === "checkbox" ? value : undefined;
      return (
        <div key={id}>
          <label htmlFor={id}>{label} </label>
          <input
            type={type}
            id={id}
            name={name}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            checked={checked}
            onChange={evt => onChange(id, evt.target.value)}
            onFocus={() => onFieldFocus(id)}
          />
          {required ? "*" : null}
          {!isValid ? <span className="errors">{errorMessages}</span> : null}
        </div>
      );
  }
};

export default renderer;
