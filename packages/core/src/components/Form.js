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

const defaultFieldsHaveChanged = (
  nextProps: FormComponentProps,
  prevState: FormComponentState
) => !isEqual(nextProps.defaultFields, prevState.defaultFields);

const valueHasChanged = (
  nextProps: FormComponentProps,
  prevState: FormComponentState
) => nextProps.value && nextProps.value !== prevState.value;

const defaultValueHasChanged = (
  nextProps: FormComponentProps,
  prevState: FormComponentState
) => nextProps.value && nextProps.value !== prevState.defaultValue;

const formDisabledStateHasChanged = (
  nextProps: FormComponentProps,
  prevState: FormComponentState
) =>
  nextProps.disabled !== undefined && nextProps.disabled !== prevState.disabled;

const formTouchedBehaviourHasChanged = (
  nextProps: FormComponentProps,
  prevState: FormComponentState
) =>
  nextProps.showValidationBeforeTouched !==
  prevState.showValidationBeforeTouched;

export default class Form extends Component<
  FormComponentProps,
  FormComponentState
> {
  constructor(props: FormComponentProps) {
    super(props);
    this.state = {
      fields: [],
      defaultValue: props.value || {},
      value: props.value || {},
      isValid: false,
      defaultFields: [],
      disabled: props.disabled || false,
      showValidationBeforeTouched: !!props.showValidationBeforeTouched
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
    const defaultFieldsChange = defaultFieldsHaveChanged(nextProps, prevState);
    const defaultValueChange = defaultValueHasChanged(nextProps, prevState);
    if (
      defaultFieldsChange ||
      valueHasChanged(nextProps, prevState) ||
      formDisabledStateHasChanged(nextProps, prevState) ||
      formTouchedBehaviourHasChanged(nextProps, prevState)
    ) {
      const { fields: fieldsFromState, value: valueFromState } = prevState;

      let {
        defaultFields: defaultFieldsFromProps,
        value: valueFromProps,
        disabled = false
      } = nextProps;
      const {
        optionsHandler,
        validationHandler,
        parentContext,
        showValidationBeforeTouched = false
      } = nextProps;

      // If a new value has been passed to the Form as a prop then it should take precedence over the last calculated state
      const value = valueFromProps || valueFromState || {};

      const defaultFields = defaultFieldsFromProps || fieldsFromState;
      let fields;
      if (defaultFieldsFromProps && defaultFieldsChange) {
        fields = registerFields(defaultFieldsFromProps, value);
      } else {
        // TODO: Ideally we shouldn't need to register to update the value...
        fields = registerFields(fieldsFromState, value);
      }

      // We should reset the touched state of all the fields if the value passed as a prop to the form
      // changes...
      const resetTouchedState = defaultValueChange;

      const nextState = getNextStateFromFields(
        fields,
        showValidationBeforeTouched,
        disabled,
        resetTouchedState,
        optionsHandler,
        validationHandler,
        parentContext
      );
      return {
        ...nextState,
        defaultFields: defaultFieldsFromProps,
        disabled,
        showValidationBeforeTouched
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
      showValidationBeforeTouched = false,
      disabled = false
    } = this.props;
    let { fields } = this.state;
    fields = updateFieldValue(id, value, fields);
    const nextState = getNextStateFromFields(
      fields,
      showValidationBeforeTouched,
      disabled,
      false,
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
      onFocus,
      parentContext,
      showValidationBeforeTouched = false,
      disabled = false
    } = this.props;
    let { fields } = this.state;
    fields = updateFieldTouchedState(id, true, fields);
    const nextState = getNextStateFromFields(
      fields,
      showValidationBeforeTouched,
      disabled,
      false,
      optionsHandler,
      validationHandler,
      parentContext
    );

    this.setState(nextState, () => onFocus && onFocus(id));
  }

  // Register field is provided in the context to allow children to register with this form...
  registerField(field: FieldDef) {
    let { fields = [], value = {} } = this.state;
    const {
      showValidationBeforeTouched = false,
      disabled = false
    } = this.props;

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
          disabled,
          false,
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
      conditionalUpdate = false,
      disabled = false
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
      conditionalUpdate,
      disabled
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
