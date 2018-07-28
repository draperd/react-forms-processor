// @flow
import React, { Component, type Node } from "react";
import uniqueId from "lodash/uniqueId";
import { Form, FormContext } from "react-forms-processor";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import type { FieldDef, OnFormChange } from "../../../types";

type Item = {
  id: string,
  data: Object
};

type Props = {
  defaultValue: Object[], // TODO: Could be anything - not just fields
  fields: FieldDef[],
  onChange?: any => void
};

type State = {
  value: Object[], // TODO: Could be anything - not just fields
  //   forms: Node[],
  items: Item[]
};

type CreateFormChangeHandler = (index: number) => OnFormChange;

const createFormForItem = (
  item: Object,
  targetIndex: number,
  fieldsForForm: FieldDef[],
  formChangeHandler: OnFormChange
): Node => {
  return (
    <FormContext.Consumer>
      {context => {
        const { renderer, optionsHandler } = context;
        return (
          <Form
            parentContext={context}
            key={`FIELD_${targetIndex}`}
            defaultFields={fieldsForForm}
            renderer={renderer}
            value={item}
            optionsHandler={optionsHandler}
            onChange={formChangeHandler}
          />
        );
      }}
    </FormContext.Consumer>
  );
};

// const addFormForItem = (
//   item: Object,
//   forms: Node[],
//   fieldsForForm: FieldDef[],
//   createFormChangeHandler: CreateFormChangeHandler
// ): Node[] => {
//   const targetIndex = forms.length;
//   const newForm = createFormForItem(
//     item,
//     targetIndex,
//     fieldsForForm,
//     createFormChangeHandler
//   );
//   return [...forms, newForm];
// };

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const grid = 8;

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? "lightblue" : "lightgrey",
  padding: grid,
  width: 250
});

const getItemStyle = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: "none",
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  background: isDragging ? "lightgreen" : "white",

  // styles we need to apply on draggables
  ...draggableStyle
});

export default class Repeats extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const { fields, defaultValue = [], onChange } = props;

    // Map the supplied array to an Item[] in order to give each piece of data an id for drag-and-drop
    const items: Item[] = defaultValue.map(data => ({ id: uniqueId(), data }));
    this.state = {
      value: defaultValue,
      items
    };

    // For each item, render a form
  }

  createFormChangeHandler(targetIndex: number): OnFormChange {
    return (value, isValid) => {
      const { items } = this.state;
      items[targetIndex] = value;
      this.setState(
        {
          items
        },
        () => {
          const { onChange } = this.props;
          const { items } = this.state;
          onChange && onChange(items);
        }
      );
    };
  }

  // TODO: Remove an item from state
  // TODO: Add an item to state
  // TODO: Re-order items in state

  onDragEnd(result: any) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );

    this.setState({
      items
    });
  }

  getForms() {
    const { items } = this.state;
    const { fields, onChange } = this.props;
    return (
      <DragDropContext onDragEnd={this.onDragEnd.bind(this)}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {items.map((item, index) => {
                const formChangeHandler = this.createFormChangeHandler(index);
                const form = createFormForItem(
                  item,
                  index,
                  fields,
                  formChangeHandler
                );
                return (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        {form}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    );
  }

  render() {
    // Render the items in the state
    return <div>{this.getForms()}</div>;
  }
}
