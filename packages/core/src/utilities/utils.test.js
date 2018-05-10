// @flow
import {
  calculateFormValue,
  createField,
  determineChangedValues,
  evaluateRule,
  evaluateAllRules,
  fieldDefIsValid,
  getFirstDefinedValue,
  getMissingItems,
  joinDelimitedValue,
  mapFieldsById,
  shouldOmitFieldValue,
  processFields,
  registerFields,
  splitDelimitedValue,
  updateFieldValue
} from './utils';
import type { FieldDef, FormState } from '../types';

const field1 = createField({
  id: 'one',
  name: 'name',
  value: 'value'
});

describe('registerFields', () => {
  const field1 = createField({
    id: 'a',
    name: 'a',
    type: 'text'
  });
  const field2 = createField({
    id: 'b',
    name: 'b',
    type: 'text'
  });
  const field3 = createField({
    id: 'a',
    name: 'c',
    type: 'text'
  });

  const fields = [field1, field2, field3];

  test('fields with duplicate IDs are filtered out', () => {
    const registeredFields = registerFields(fields, {});
    expect(registeredFields.length).toEqual(2);
    expect(registeredFields[0].id).toEqual('a');
    expect(registeredFields[1].id).toEqual('b');
  });
});

describe('fieldDefIsValid', () => {
  it('field is valid when the form does not contain a field with the same id', () => {
    expect(fieldDefIsValid(field1, [])).toEqual(true);
  });

  test('field is not valid when form already contains a field with the same id', () => {
    expect(fieldDefIsValid(field1, [field1])).toEqual(false);
  });
});

describe('evaluateRule', () => {
  test('evaluting a rule with no arguments', () => {
    expect(evaluateRule()).toEqual(true);
  });

  test("successful 'is' rule", () => {
    expect(
      evaluateRule({
        field: 'one',
        rule: {
          is: [true]
        },
        targetValue: true
      })
    ).toEqual(true);
  });

  test("failing 'is' rule", () => {
    expect(
      evaluateRule(
        {
          field: 'one',
          is: [false]
        },
        true
      )
    ).toEqual(false);
  });

  test("successful 'isNot' rule", () => {
    expect(
      evaluateRule(
        {
          field: 'one',
          isNot: [true]
        },
        false
      )
    ).toEqual(true);
  });

  test("failing 'isNot' rule", () => {
    expect(
      evaluateRule(
        {
          field: 'one',
          isNot: [false]
        },
        false
      )
    ).toEqual(false);
  });

  test("successful combined 'is' and isNot' rule", () => {
    expect(
      evaluateRule(
        {
          field: 'onee',
          is: [true],
          isNot: [false]
        },
        true
      )
    ).toEqual(true);
  });

  test("failing combined 'is' and isNot' rule", () => {
    expect(
      evaluateRule(
        {
          field: 'one',
          is: [true],
          isNot: [false]
        },
        false
      )
    ).toEqual(false);
  });

  // NOTE: This is one option for allowing form builder to construct rules, but is harder to implement
  test('works with complex objects', () => {
    expect(
      evaluateRule(
        {
          field: 'one',
          is: [{ value: 'bob' }],
          isNot: [{ value: 'ted' }]
        },
        'bob'
      )
    ).toEqual(true);
  });
});

// describe("evaluateAllRules", () => {
//   test("evaluating no rules returns the default default", () => {
//     expect(evaluateAllRules()).toEqual(true);
//   });
// });

describe('processFields', () => {
  const triggerField = createField({
    id: 'triggerField',
    name: 'triggerField',
    value: 'test'
  });
  const shouldBeVisible = createField({
    id: 'shouldBeVisible',
    name: 'shouldBeVisible',
    visibleWhen: [
      {
        field: 'triggerField',
        is: ['test']
      }
    ]
  });
  const shouldBeHidden = createField({
    id: 'shouldBeHidden',
    name: 'shouldBeHidden',
    visibleWhen: [
      {
        field: 'triggerField',
        isNot: ['test']
      }
    ]
  });
  const shouldBeRequired = createField({
    id: 'shouldBeRequired',
    name: 'shouldBeRequired',
    requiredWhen: [
      {
        field: 'triggerField',
        is: ['test']
      }
    ]
  });
  const shouldBeOptional = createField({
    id: 'shouldBeOptional',
    name: 'shouldBeOptional',
    requiredWhen: [
      {
        field: 'triggerField',
        isNot: ['test']
      }
    ]
  });
  const shouldBeDisabled = createField({
    id: 'shouldBeDisabled',
    name: 'shouldBeDisabled',
    disabledWhen: [
      {
        field: 'triggerField',
        is: ['test']
      }
    ]
  });
  const shouldBeEnabled = createField({
    id: 'shouldBeEnabled',
    name: 'shouldBeEnabled',
    disabledWhen: [
      {
        field: 'triggerField',
        isNot: ['test']
      }
    ]
  });

  const fields = [
    triggerField,
    shouldBeVisible,
    shouldBeHidden,
    shouldBeRequired,
    shouldBeOptional,
    shouldBeDisabled,
    shouldBeEnabled
  ];

  const processedFields = processFields(fields);
  const processedFieldsById = mapFieldsById(processedFields);

  test('field should be visible', () => {
    expect(processedFieldsById.shouldBeVisible.visible).toBe(true);
  });
  test('field should be hidden', () => {
    expect(processedFieldsById.shouldBeHidden.visible).toBe(false);
  });
  test('field should be required', () => {
    expect(processedFieldsById.shouldBeRequired.required).toBe(true);
  });
  test('field should be optional', () => {
    expect(processedFieldsById.shouldBeOptional.required).toBe(false);
  });
  test('field should be disabled', () => {
    expect(processedFieldsById.shouldBeDisabled.disabled).toBe(true);
  });
  test('field should be enabled', () => {
    expect(processedFieldsById.shouldBeEnabled.disabled).toBe(false);
  });
});

describe('shouldOmitFieldValue', () => {
  const baseField: FieldDef = {
    id: 'TEST',
    value: 'foo',
    name: 'test',
    type: 'text'
  };
  test('value should be omitted when hidden', () => {
    const field = {
      ...baseField,
      omitWhenHidden: true,
      visible: false
    };
    expect(shouldOmitFieldValue(field)).toEqual(true);
  });
  test('value should be included when visible', () => {
    const field = {
      ...baseField,
      omitWhenHidden: true,
      visible: true
    };
    expect(shouldOmitFieldValue(field)).toEqual(false);
  });
  test('value should be ommitted when value matches', () => {
    const field = {
      ...baseField,
      omitWhenValueIs: ['foo']
    };
    expect(shouldOmitFieldValue(field)).toEqual(true);
  });
  test('value should be included when value does not match', () => {
    const field = {
      ...baseField,
      omitWhenValueIs: ['wrong']
    };
    expect(shouldOmitFieldValue(field)).toEqual(false);
  });
});

describe('calculateFormValue', () => {
  const baseField: FieldDef = {
    id: 'TEST',
    value: 'foo',
    name: 'test',
    type: 'text'
  };
  const field1 = {
    ...baseField,
    omitWhenHidden: true,
    visible: false
  };
  const field2 = {
    ...baseField,
    id: 'TEST2',
    name: 'test2',
    value: 'bar'
  };
  const field3 = {
    ...baseField,
    id: 'TEST3',
    name: 'test3',
    value: 'bob'
  };
  const field4 = {
    ...baseField,
    id: 'TEST4',
    name: 'test3',
    value: 'ted'
  };

  const value = calculateFormValue([field1, field2, field3, field4]);
  test('two field values should be omitted', () => {
    expect(Object.keys(value).length).toEqual(2);
  });
  test('hidden field value should not be included', () => {
    expect(value.test).not.toBeDefined();
  });
  test('normal value should be included', () => {
    expect(value.test2).toEqual('bar');
  });
  test('last field wins', () => {
    expect(value.test3).toEqual('ted');
  });

  test('get added and removed values', () => {
    const field1 = {
      ...baseField,
      defaultValue: '1,2,3',
      value: ['2', '4', '5'], // HERE BE DRAGONS - will the new value really always be an array?
      valueDelimiter: ',',
      useChangesAsValues: true
    };
    const value = calculateFormValue([field1]);
    expect(value.test_added).toEqual('4,5');
    expect(value.test_removed).toEqual('1,3');
  });

  // test("dot-notation values setting", () => {
  //   const field1 = {
  //     name: "some.nested.prop",
  //     ...baseField,
  //     value: "foo"
  //   };
  //   const value = calculateFormValue([field1]);
  //   expect(value.some.nested.prop).toEqual("foo");
  // });
});

describe('updateFieldValue', () => {
  const field1 = {
    id: 'A',
    name: 'a',
    type: 'text',
    value: 'baa'
  };
  const field2 = {
    id: 'B',
    name: 'b',
    type: 'text',
    value: 'moo'
  };
  const field3 = {
    id: 'C',
    name: 'c',
    type: 'text',
    value: 'woof'
  };

  const fields = updateFieldValue('B', 'oink', [field1, field2, field3]);
  const fieldsById = mapFieldsById(fields);

  test('field is updated with new value', () => {
    expect(fieldsById.B.value).toEqual('oink');
  });
});

describe('joinDelimitedValue', () => {
  test('join with commas', () => {
    expect(joinDelimitedValue([1, 2, 3], ',')).toEqual('1,2,3');
  });

  test('leave non-array values as-id', () => {
    expect(joinDelimitedValue('test', ',')).toEqual('test');
  });
});

describe('splitDelimitedValue', () => {
  test('split on commas', () => {
    // NOTE: Always becomes an array of strings
    //       Is this worth parsing?
    expect(splitDelimitedValue('1,2,3', ',')).toEqual(['1', '2', '3']);
  });

  test('create an array from an non-delimited value', () => {
    expect(splitDelimitedValue('test', ',')).toEqual(['test']);
  });

  test('leave value as is if no delimiter provided', () => {
    expect(splitDelimitedValue('test')).toEqual('test');
  });
});

describe('getMissingItems', () => {
  test('a is missing from [b,c] but is in [a,b,c]', () => {
    expect(getMissingItems(['b', 'c'], ['a', 'b', 'c'])).toEqual(['a']);
  });
});

describe('determineChangedValues', () => {
  const field: FieldDef = {
    id: 'TEST',
    name: 'foo',
    type: 'text',
    value: ['a', 'c', 'e', 'f'],
    defaultValue: ['a', 'b', 'c', 'd']
  };

  const changes = determineChangedValues(field);
  test('output structure is correct', () => {
    expect(changes.length).toEqual(2);
    expect(changes[0].name).toEqual('foo_added');
    expect(changes[1].name).toEqual('foo_removed');
  });
  test('e and f were added', () => {
    expect(changes[0].value).toEqual(['e', 'f']);
  });
  test('b and d were removed', () => {
    expect(changes[1].value).toEqual(['b', 'd']);
  });
});

describe('getFirstDefinedValue', () => {
  test('boolean', () => {
    expect(getFirstDefinedValue(undefined, undefined, false, true)).toEqual(
      false
    );
  });
  test('number', () => {
    expect(getFirstDefinedValue(undefined, 0, 10)).toEqual(0);
  });
});

describe('default value handling', () => {
  const field: FieldDef = {
    id: 'WITH_DEFAULT',
    name: 'test',
    type: 'text',
    defaultValue: 'bob'
  };

  test('default value is assigned to value', () => {
    const processedFields = processFields([field]);
    expect(processedFields[0].value).toEqual('bob');
  });

  test('Value takes precedence over defaultValue', () => {
    field.value = 'ted';
    const processedFields = processFields([field]);
    expect(processedFields[0].value).toEqual('ted');
  });

  test('Falsy value takes precedence over defaultValue', () => {
    field.value = false;
    const processedFields = processFields([field]);
    expect(processedFields[0].value).toEqual(false);
  });
});

describe('trimming behaviour', () => {
  const field: FieldDef = {
    id: 'TO_BE_TRIMMED',
    name: 'test',
    type: 'text',
    value: '   foo     ',
    trimValue: true
  };

  test('leading and trailing whitespace is removed from value', () => {
    const processedFields = processFields([field]);
    const trimmedField = processedFields[0];
    expect(trimmedField.value).toEqual('foo');
  });
});
