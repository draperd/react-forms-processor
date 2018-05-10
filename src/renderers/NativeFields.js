// @flow
import React from 'react';
import type { RenderField, FieldDef, OnFieldChange } from '../types';

const renderField: RenderField = (field: FieldDef, onChange: OnFieldChange) => {
  const {
    disabled,
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
    case 'checkbox':
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
          />
        </div>
      );
    case 'select':
      items = options.reduce((itemsSoFar, option) => {
        return itemsSoFar.concat(
          option.items.map(item => {
            if (typeof item === 'string') {
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
          })
        );
      }, []);
      return (
        <div key={id}>
          <label htmlFor={id}>{label}</label>
          <select
            id={id}
            name={name}
            value={value}
            disabled={disabled}
            required={required}
            onChange={evt => onChange(id, evt.target.value)}
          >
            {items}
          </select>
        </div>
      );

    case 'radiogroup':
      items = options.reduce((itemsSoFar, option) => {
        return itemsSoFar.concat(
          option.items.map((item, index) => {
            const inputId = `${id}_${index}`;
            if (typeof item === 'string') {
              return (
                <div key={inputId}>
                  <input
                    id={inputId}
                    type="radio"
                    name={name}
                    value={item}
                    checked={item === value}
                    onChange={evt => onChange(id, evt.target.value)}
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
      const checked = type === 'checkbox' ? value : undefined;
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
          />
          {required ? '*' : ''}
          {!isValid ? 'Error!' : ''}
        </div>
      );
  }
};

export default renderField;
