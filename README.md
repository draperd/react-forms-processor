# React Forms Processor

### What problem does this project solve?
React Forms Processor allows you to create a form where updates in one field can change the attributes of another without requiring you to write the code to implement that relationship

### What sort of relationships are we talking about?
Well, let's say that you have one field that is only visible when another has a certain value (for example a checkbox being checked) then you can define this through the specification of the form. You can configure when fields are visible, disabled, required and if their value should be included in the overall form value based on the value of other fields.

### What about validation?
The form has an overall validity state that is based on the validity of all the fields. If a required field is empty then the form is invalid. If the value of a field fails to pass the validation rules it has been declared with then the form is invalid. The only exception to this is for invalid fields that are not visible - these do not effect the form validity.

### What sort of validation rules can you defined?
At the moment there are rules of Regular Expression matching, minimum and maximum character length and minimum and maximum numerical range - but more validators will be added soon, along with the ability to provide a custom validation handler.

### What about options?
It is possible to declare static options for a field in it's definition. In the future I'll be looking to expand this to allow you to define URLs to retrieve options from but as a catch-all fallback you can provide the form component with an options handler function that allows you to return options for a field that might be related to the value of other fields - this also allows you to return promises of options if you're fetching them via an XHR request.

### What fields are available?
That's up to you. React Forms Processor is intended to abstract the logic of forms processing away from the rendering implementation. It comes with an [Atlaskit](https://atlaskit.atlassian.com/) renderer out of the box but I'll be adding more renderers soon or you can write you own - it's simply a case of matching a field type to a React field implementation and mapping the props provided. 

The fields that are currently available in the Atlaskit renderer are:
* text
* textarea
* checkbox
* select
* multiselect
* radiogroup

### What about field layout?
You can build a form from multiple fragments that each have their own definition - but those definitions are aggregated by the form. This means that you can each split fields across multiple tabs or collapsible sections. Button components can be placed anywhere within the context of a form. The ID of each field is used in the DOM so you can write custom CSS selectors for fine grained control over a fields position and appearance

### Are there any limitations?
This project uses the new React Context API so you are required to use at least version 16.3 of React.

### Anything else I should know?
Because the forms can be defined declaratively it means that you can build and render forms dynamically in an application - check out the example in the [demo page](https://draperd.github.io/react-forms-processor/).

### Is this ready to use now?
You can install and use this now - but it's still quite new, I'd really love to get some feedback on it before you start using it in anger... but to install:

`yarn add react-forms-processor` (for the core engine)
`yarn add react-forms-processor-atlaskit` (for the Atlaskit renderer)

You can import and use the `Form` and `FormFragment` components from the core module. You will also probably want to import and use the `FormButton` component from the Atlaskit renderer. For example:

``` JSX
<Form defaultFields={myFieldsDefinition} 
      renderer={atlaskitRenderer} 
      optionsHandler={myCustomOptionsHandler}>
  <FormButton label="Save" onClick={value => doSomethingWithThFormValue()}/>
</Form>
```

...or split across fragments:

``` JSX
<Form renderer={atlaskitRenderer} 
      optionsHandler={myCustomOptionsHandler}>
  <FormFragment defaultFields={definition1} />
  <FormFragment defaultFields={definition2} />
  <FormButton label="Save" onClick={value => doSomethingWithThFormValue()}/>
</Form>
```

### Is there a demo available?
Why yes there is... You can find it [here](https://draperd.github.io/react-forms-processor/).


