// @flow
import React from 'react';
import Button from '@atlaskit/button';
import { FormContext } from '../../Form';
import type { FormValue } from '../../../types';

export type FormButtonProps = {
  label?: string,
  onClick: (value: FormValue) => void,
  value?: FormValue,
  isValid?: boolean
};

class FormButton extends React.Component<FormButtonProps> {
  render() {
    const { isValid, label = 'OK', onClick, value = {} } = this.props;
    return (
      <Button
        appearance="primary"
        isDisabled={!isValid}
        onClick={() => onClick(value)}
      >
        {label}{' '}
      </Button>
    );
  }
}

export default (props: FormButtonProps) => (
  <FormContext.Consumer>
    {form => <FormButton {...form} {...props} />}
  </FormContext.Consumer>
);
