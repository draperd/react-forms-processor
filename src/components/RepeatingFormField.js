// @flow
import React, { Component, PureComponent } from 'react';
import Form, { FormContext } from './Form';
import renderField from '../renderers/AtlasKitFields';
import type { FieldDef } from '../types';
import Button from '@atlaskit/button';
import ChevronDownIcon from '@atlaskit/icon/glyph/chevron-down';
import ChevronRightIcon from '@atlaskit/icon/glyph/chevron-right';
import CrossCircleIcon from '@atlaskit/icon/glyph/cross-circle';
import './RepeatingFormField.css';

type ChevronProps = {
  isExpanded: boolean,
  //   ariaControls: string,
  onExpandToggle?: Function
};

type ChevronState = {
  isFocused: boolean,
  isHovered: boolean
};

class Chevron extends PureComponent<ChevronProps, ChevronState> {
  state: ChevronState = {
    isFocused: false,
    isHovered: false
  };

  handleClick = () => {
    if (this.props.onExpandToggle) {
      this.props.onExpandToggle();
    }
  };

  handleMouseOver = () => {
    this.setState({ isHovered: true });
  };

  handleMouseOut = () => {
    this.setState({ isHovered: false });
  };

  handleFocus = () => {
    this.setState({ isFocused: true });
  };

  handleBlur = () => {
    this.setState({ isFocused: false });
  };

  render() {
    const { isExpanded /*ariaControls*/ } = this.props;
    // const { isFocused, isHovered } = this.state;
    const iconProps = {
      size: 'medium'
      //   primaryColor: isHovered || isFocused ? iconColorFocus : iconColor
    };
    return (
      <span>
        <button
          type={'button'}
          //   aria-controls={ariaControls}
          onClick={this.handleClick}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          onMouseOver={this.handleMouseOver}
          onMouseOut={this.handleMouseOut}
        >
          {isExpanded ? (
            <ChevronDownIcon label="Collapse" {...iconProps} />
          ) : (
            <ChevronRightIcon label="Expand" {...iconProps} />
          )}
        </button>
      </span>
    );
  }
}

type ExpanderProps = {
  label: string,
  remove: () => void,
  children: any
};

type ExpanderState = {
  isExpanded: boolean
};

class Expander extends Component<ExpanderProps, ExpanderState> {
  state: ExpanderState = {
    isExpanded: false
  };

  render() {
    const { isExpanded } = this.state;
    const { children, label, remove } = this.props;

    return (
      <div className="expander">
        <Chevron
          key="chevron"
          isExpanded={isExpanded}
          onExpandToggle={() =>
            this.setState(prevState => ({
              isExpanded: !prevState.isExpanded
            }))
          }
        />
        <span className="label">{label}</span>
        <CrossCircleIcon onClick={remove} />
        <div
          className="content"
          style={{ display: isExpanded ? 'block' : 'none' }}
        >
          {children}
        </div>
      </div>
    );
  }
}

type Props = {
  label?: string,
  idAttribute?: string,
  addButtonLabel?: string,
  unidentifiedLabel?: string,
  noItemsMessage?: string,
  fields: FieldDef[],
  onChange?: any => void
};

type State = {
  items: Array<any>,
  values: Array<any>
};

export default class RepeatingFormField extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      items: [],
      values: []
    };
  }

  addItem() {
    const { fields } = this.props;
    const { items } = this.state;
    const targetIndex = items.length;
    items[targetIndex] = (
      <FormContext.Consumer>
        {value => {
          return (
            <Form
              parentContext={value}
              key={`FIELD_${targetIndex}`}
              defaultFields={fields}
              renderField={renderField}
              optionsHandler={value && value.optionsHandler}
              onChange={(value, isValid) => {
                const { values } = this.state;
                values[targetIndex] = value;
                this.setState(
                  {
                    values
                  },
                  () => {
                    const { onChange } = this.props;
                    const { values } = this.state;
                    onChange && onChange(values);
                  }
                );
              }}
            />
          );
        }}
      </FormContext.Consumer>
    );
    this.setState({ items });
  }

  removeItem(index: number) {
    const { items, values } = this.state;
    this.setState(
      {
        items: items.filter((f, i) => index !== i),
        values: values.filter((f, i) => index !== i)
      },
      () => {
        const { onChange } = this.props;
        const { values } = this.state;
        onChange && onChange(values);
      }
    );
  }

  render() {
    const { items, values } = this.state;
    const {
      idAttribute = 'id',
      label = 'Item',
      addButtonLabel = 'Add item',
      unidentifiedLabel = 'Unidentified item',
      noItemsMessage = 'No items yet'
    } = this.props;

    const fields = items.map((builder, index) => {
      const label =
        (values[index] && values[index][idAttribute]) || unidentifiedLabel;
      return (
        <Expander
          key={`exp_${index}`}
          label={label}
          remove={() => {
            this.removeItem(index);
          }}
        >
          {builder}
        </Expander>
      );
    });

    const noItems = <span className="no-items">{noItemsMessage}</span>;
    return (
      <div className="repeating-form-field">
        <div className="label">{label}</div>
        <div>{fields.length > 0 ? fields : noItems}</div>
        <Button onClick={() => this.addItem()}>{addButtonLabel}</Button>
      </div>
    );
  }
}
