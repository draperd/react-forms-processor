// @flow
import React from 'react';
import FieldText from '../components/fields/atlaskit/FieldText';
import FieldTextArea from '../components/fields/atlaskit/FieldTextArea';
import Checkbox from '../components/fields/atlaskit/Checkbox';
import RadioGroup from '../components/fields/atlaskit/RadioGroup';
import SingleSelect from '../components/fields/atlaskit/Select';
import MultiSelect from '../components/fields/atlaskit/MultiSelect';
import RepeatingFormField from '../components/RepeatingFormField';
import type { RenderField, FieldDef, OnFieldChange } from '../types';

const renderField: RenderField = (field: FieldDef, onChange: OnFieldChange) => {
  const { id, type, label, misc = {} } = field;
  switch (type) {
    case 'text':
      return <FieldText key={id} {...field} />;

    case 'textarea':
      return <FieldTextArea key={id} {...field} />;

    case 'checkbox':
      return <Checkbox key={id} {...field} />;

    case 'select':
      return <SingleSelect key={id} {...field} />;

    case 'multiselect':
      return <MultiSelect key={id} {...field} />;

    case 'radiogroup':
      return <RadioGroup key={id} {...field} />;

    case 'repeating':
      const fields: FieldDef[] = misc.fields || [];
      const addButtonLabel: string = misc.addButtonLabel;
      const unidentifiedLabel: string = misc.unidentifiedLabel;
      const noItemsMessage: string = misc.noItemsMessage;
      const idAttribute: string = misc.idAttribute;
      return (
        <RepeatingFormField
          key={id}
          addButtonLabel={addButtonLabel}
          label={label}
          onChange={value => onChange(id, value)}
          fields={fields}
          unidentifiedLabel={unidentifiedLabel}
          noItemsMessage={noItemsMessage}
          idAttribute={idAttribute}
        />
      );

    default:
      return <div>No mapped field</div>;
  }
};

export default renderField;
