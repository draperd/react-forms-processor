// @flow
import React, { Component } from "react";
import isEqual from "lodash/isEqual";
import FormContext from "./FormContext";
import FormFragment from "./FormFragment";
import DefaultField from "./DefaultField";
import {
  getNextStateFromFields,
  setOptionsInFieldInState,
  registerField,
  registerFields,
  updateFieldValue,
  updateFieldTouchedState
} from "../utilities/utils";
import type {
  FieldDef,
  FormContextData,
  FormComponentProps,
  FormComponentState,
  OnFieldChange,
  Options,
  Value
} from "../types";
import defaultRenderer from "../renderer";

export default class Form extends Component<
  FormComponentProps,
  FormComponentState
> {
  constructor(props: FormComponentProps) {
    super(props);
    this.state = {
      fields: [],
      value: props.value || {},
      isValid: false,
      defaultFields: []
    };
  }

  shouldComponentUpdate(
    nextProps: FormComponentProps,
    nextState: FormComponentState
  ) {
    const { conditionalUpdate = false } = this.props;
    // TODO: This might need some further thought, but it definitely improves performance in the FormBuilder
    if (
      conditionalUpdate &&
      nextProps.renderer === this.props.renderer &&
      isEqual(this.state.fields, nextState.fields) &&
      isEqual(this.state.value, nextState.value)
    ) {
      return false;
    }
    return true;
  }

  static getDerivedStateFromProps(
    nextProps: FormComponentProps,
    prevState: FormComponentState
  ) {
    if (
      (nextProps.defaultFields &&
        nextProps.defaultFields !== prevState.defaultFields) ||
      (nextProps.value && nextProps.value !== prevState.value)
    ) {
      const { fields: fieldsFromState, value: valueFromState } = prevState;

      let {
        defaultFields: defaultFieldFromProps,
        value: valueFromProps
      } = nextProps;
      const {
        optionsHandler,
        validationHandler,
        parentContext,
        showValidationBeforeTouched = false
      } = nextProps;

      const defaultFields = defaultFieldFromProps || fieldsFromState;

      // TODO: Are fields getting re-registered too much? Is new prop value being used?
      const fields = registerFields(
        defaultFields,
        valueFromProps || valueFromState || {}
      );
      const nextState = getNextStateFromFields(
        fields,
        showValidationBeforeTouched,
        optionsHandler,
        validationHandler,
        parentContext
      );
      return {
        ...nextState,
        defaultFields
      };
    } else {
      return null;
    }
  }

  onFieldChange(id: string, value: Value) {
    const {
      optionsHandler,
      validationHandler,
      parentContext,
      showValidationBeforeTouched = false
    } = this.props;
    let { fields } = this.state;
    fields = updateFieldValue(id, value, fields);
    const nextState = getNextStateFromFields(
      fields,
      showValidationBeforeTouched,
      optionsHandler,
      validationHandler,
      parentContext
    );

    this.setState(
      (state, props) => {
        return nextState;
      },
      () => {
        const { onChange } = this.props;
        const { value, isValid } = nextState;
        if (onChange) {
          onChange(value, isValid);
        }
      }
    );
  }

  onFieldFocus(id: string) {
    const {
      optionsHandler,
      validationHandler,
      parentContext,
      showValidationBeforeTouched = false
    } = this.props;
    let { fields } = this.state;
    fields = updateFieldTouchedState(id, true, fields);
    const nextState = getNextStateFromFields(
      fields,
      showValidationBeforeTouched,
      optionsHandler,
      validationHandler,
      parentContext
    );

    this.setState((state, props) => {
      return nextState;
    });
  }

  // Register field is provided in the context to allow children to register with this form...
  registerField(field: FieldDef) {
    let { fields = [], value = {} } = this.state;
    const { showValidationBeforeTouched = false } = this.props;

    if (fields.find(existingField => field.id === existingField.id)) {
      // Don't register fields twice...
      // console.warn("Field ID already in use", field.id);
    } else {
      fields = registerField(field, fields, value);
      this.setState((state, props) => {
        const filteredFields = state.fields.filter(
          existingField => existingField.id !== field.id
        );
        // let updatedFields = fields.concat(filteredFields);
        let updatedFields = filteredFields.concat(field);
        const nextState = getNextStateFromFields(
          updatedFields,
          showValidationBeforeTouched,
          props.optionsHandler,
          props.validationHandler,
          props.parentContext
        );
        return {
          ...nextState
        };
      });
    }
  }

  createFormContext() {
    const { fields, value, isValid } = this.state;
    const {
      renderer = defaultRenderer,
      optionsHandler,
      validationHandler,
      parentContext,
      showValidationBeforeTouched = false,
      conditionalUpdate = false
    } = this.props;
    const onFieldChange = this.onFieldChange.bind(this); // TODO: Is this creating a new function each time? Does this result in too many listeners?
    const onFieldFocus = this.onFieldFocus.bind(this); // TODO: See above comment

    const context: FormContextData = {
      fields,
      isValid,
      value,
      registerField: this.registerField.bind(this),
      renderer,
      optionsHandler,
      options: {},
      onFieldChange,
      onFieldFocus,
      parentContext,
      showValidationBeforeTouched,
      validationHandler,
      conditionalUpdate
    };

    return context;
  }

  render() {
    const { children, defaultFields } = this.props;
    const { fields } = this.state;

    fields.forEach(field => {
      if (field.pendingOptions) {
        field.pendingOptions.then(options =>
          this.setState(prevState =>
            setOptionsInFieldInState(prevState, field, options)
          )
        );
      }
    });

    const context = this.createFormContext();
    return (
      <FormContext.Provider value={context}>
        {defaultFields && <FormFragment defaultFields={fields} />}
        {children}
      </FormContext.Provider>
    );
  }
}
