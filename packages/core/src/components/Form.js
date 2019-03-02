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
      defaultValue: props.defaultValue || {},
      value: props.value || props.defaultValue || {},
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
    const valueChange = valueHasChanged(nextProps, prevState);
    if (
      defaultFieldsChange ||
      valueChange ||
      formDisabledStateHasChanged(nextProps, prevState) ||
      formTouchedBehaviourHasChanged(nextProps, prevState)
    ) {
      const {
        fields: fieldsFromState,
        defaultValue: defaultValueFromState,
        value: valueFromState
      } = prevState;

      let {
        defaultFields: defaultFieldsFromProps,
        defaultValue: defaultValueFromProps,
        value: valueFromProps,
        disabled = false
      } = nextProps;
      const {
        optionsHandler,
        validationHandler,
        parentContext,
        showValidationBeforeTouched = false
      } = nextProps;

      const value = {
        ...defaultValueFromProps,
        ...valueFromState,
        ...valueFromProps
      };

      const defaultFields = defaultFieldsFromProps || fieldsFromState;

      // TODO: Don't use the field value if the value prop has changed...
      if (!valueChange) {
        defaultFields.forEach(field => {
          if (field.value) {
            value[field.name] = field.value;
          }
        });
      }

      let fields;
      if (defaultFieldsFromProps && defaultFieldsChange) {
        fields = registerFields(defaultFieldsFromProps, value);
      } else {
        // TODO: Ideally we shouldn't need to register to update the value...
        fields = registerFields(fieldsFromState, value);
      }

      // We should reset the touched state of all the fields if the value passed as a prop to the form
      // changes...
      const resetTouchedState = valueChange;

      const nextState = getNextStateFromFields({
        fields,
        showValidationBeforeTouched,
        formIsDisabled: disabled,
        resetTouchedState,
        optionsHandler,
        validationHandler,
        parentContext
      });
      return {
        ...nextState,
        defaultFields: defaultFieldsFromProps,
        defaultValue: defaultValueFromProps || defaultValueFromState,
        disabled,
        showValidationBeforeTouched,
        value
      };
    }
    return null;
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
    fields = updateFieldTouchedState(id, true, fields);
    fields = updateFieldValue(id, value, fields);

    const nextState = getNextStateFromFields({
      fields,
      lastFieldUpdated: id,
      showValidationBeforeTouched,
      formIsDisabled: disabled,
      resetTouchedState: false,
      optionsHandler,
      validationHandler,
      parentContext
    });

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
    // At one stage the plan was to only show validation error messages once a field
    // had been touched, but in reality we only want to show validation messages when
    // a field has been changed OR has been blurred.
    // So now we just want to make sure that callbacks on the form for handling when
    // a field is focused are called.
    const { onFieldFocus: onFieldFocusProp } = this.props;
    onFieldFocusProp && onFieldFocusProp(id);
  }

  onFieldBlur(id: string) {
    const {
      optionsHandler,
      validationHandler,
      onFieldBlur: onFieldBlurProp,
      parentContext,
      showValidationBeforeTouched = false,
      disabled = false
    } = this.props;
    let { fields } = this.state;
    fields = updateFieldTouchedState(id, true, fields);
    const nextState = getNextStateFromFields({
      fields,
      showValidationBeforeTouched,
      formIsDisabled: disabled,
      resetTouchedState: false,
      optionsHandler,
      validationHandler,
      parentContext
    });

    this.setState(nextState, () => onFieldBlurProp && onFieldBlurProp(id));
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
        const { optionsHandler, validationHandler, parentContext } = props;
        const filteredFields = state.fields.filter(
          existingField => existingField.id !== field.id
        );
        // let updatedFields = fields.concat(filteredFields);
        let updatedFields = filteredFields.concat(field);
        const nextState = getNextStateFromFields({
          fields: updatedFields,
          showValidationBeforeTouched,
          formIsDisabled: disabled,
          resetTouchedState: false,
          optionsHandler,
          validationHandler,
          parentContext
        });
        return {
          ...nextState
        };
      });
    }
  }

  createFormContext() {
    const { fields, defaultValue, value, isValid } = this.state;
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
    const onFieldBlur = this.onFieldBlur.bind(this);

    const context: FormContextData = {
      fields,
      isValid,
      defaultValue,
      value,
      registerField: this.registerField.bind(this),
      renderer,
      optionsHandler,
      options: {},
      onFieldBlur,
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
