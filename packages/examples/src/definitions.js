// @flow
import type { FieldDef } from "../../../types";

const rendererChoice: FieldDef[] = [
  {
    id: "RENDERER",
    type: "select",
    label: "Select renderer",
    name: "renderer",
    defaultValue: "ATLASKIT",
    options: [
      {
        items: [
          {
            label: "Native HTML",
            value: "NATIVE"
          },
          {
            label: "Atlaskit",
            value: "ATLASKIT"
          },
          {
            label: "Material UI",
            value: "MATERIALUI"
          }
        ]
      }
    ]
  }
];

const createTeamForm: FieldDef[] = [
  {
    id: "TEAMNAME",
    type: "text",
    name: "name",
    label: "Team name",
    required: true,
    trimValue: true,
    validWhen: {
      lengthIsLessThan: {
        length: 256,
        message: "Team names can be a maximum of 255 characters in length"
      }
    }
  },
  {
    id: "TEAM_TYPE",
    type: "select",
    name: "type",
    label: "Team type",
    description: "Some important messagea about team type",
    defaultValue: "SCRUM",
    required: true,
    options: [
      {
        items: [
          { label: "Scrum", value: "SCRUM" },
          { label: "Kanban", value: "KANBAN" }
        ]
      }
    ]
  },
  {
    id: "SIZING_METRIC",
    type: "radiogroup",
    label: "Estimation Metric",
    name: "metric",
    defaultValue: "POINTS",
    options: [
      {
        items: [
          { label: "Points", value: "POINTS" },
          { label: "Hours", value: "HOURS" },
          { label: "Days", value: "DAYS" }
        ]
      }
    ]
  },
  {
    id: "VELOCITY_POINTS",
    type: "text",
    name: "velocity",
    label: "Velocity (pts)",
    description: "Something about velocity",
    defaultValue: 30,
    visibleWhen: [
      {
        field: "SIZING_METRIC",
        is: ["POINTS"]
      }
    ],
    omitWhenHidden: true
  },
  {
    id: "VELOCITY_HOURS",
    type: "text",
    name: "velocity",
    label: "Velocity (hours)",
    description: "Something about velocity",
    defaultValue: 200,
    visibleWhen: [
      {
        field: "SIZING_METRIC",
        is: ["HOURS"]
      }
    ],
    omitWhenHidden: true
  },
  {
    id: "VELOCITY_DAYS",
    type: "text",
    name: "velocity",
    label: "Velocity (days)",
    description: "Something about velocity",
    visibleWhen: [
      {
        field: "SIZING_METRIC",
        is: ["DAYS"]
      }
    ],
    omitWhenHidden: true
  },
  {
    id: "ITERATION_LENGTH",
    type: "text",
    name: "iterationLength",
    label: "Iteration length (weeks)",
    omitWhenHidden: true,
    visibleWhen: [
      {
        field: "TEAM_TYPE",
        is: ["SCRUM"]
      }
    ],
    validWhen: {
      matchesRegEx: {
        pattern: "^[\\d]+$",
        message: "Length can only be in whole numbers"
      },
      fallsWithinNumericalRange: {
        min: 0
      }
    }
  },
  {
    id: "MEMBERS",
    type: "multiselect",
    name: "members",
    label: "Members"
  }
];

const form1: FieldDef[] = [
  {
    id: "NAME",
    name: "name",
    label: "Name?",
    description: "Some additional information",
    placeholder: "Your name...",
    defaultValue: "Bob",
    type: "text",
    required: true,
    validWhen: {
      lengthIsGreaterThan: {
        length: 3,
        message: "Name is too short!"
      }
      // comparedToField: {
      //   id: 'ADDRESS',
      //   is: 'SMALLER'
      // }
    }
  },
  {
    id: "ADDRESS",
    name: "address",
    label: "Address",
    type: "textarea",
    placeholder: "Enter address...",
    defaultValue: "",
    required: false,
    disabledWhen: [
      {
        field: "NAME",
        is: [""]
      }
    ]
  },
  {
    id: "SUBSCRIBE",
    name: "subscribe",
    label: "Would you like to receive regular updates?",
    defaultValue: true,
    type: "checkbox"
  },
  {
    id: "EMAIL",
    name: "email",
    label: "What's your e-mail address?",
    defaultValue: "",
    type: "text",
    visibleWhen: [
      {
        field: "SUBSCRIBE",
        isNot: [false]
      }
    ]
  },
  {
    id: "REASON",
    name: "reason",
    label: "How did you hear about us?",
    placeholder: "Where?",
    defaultValue: "Advert",
    type: "radiogroup",
    options: [
      {
        items: ["Advert", "Friend", "Other"]
      }
    ],
    omitWhenValueIs: ["Other"]
  },
  {
    id: "OTHER_REASON",
    name: "reason",
    label: "What was the reason?",
    type: "textarea",
    defaultValue: "",
    visibleWhen: [
      {
        field: "REASON",
        is: ["Other"]
      }
    ],
    omitWhenHidden: true
  },
  {
    id: "PICKAGAIN",
    name: "colours",
    label: "Choose a colour",
    placeholder: "Pick a colour",
    defaultValue: "G",
    type: "multiselect",
    options: [
      {
        items: [
          {
            label: "Green",
            value: "G"
          },
          {
            label: "Red",
            value: "R"
          },
          {
            label: "Blue",
            value: "B"
          }
        ]
      }
    ]
  },
  {
    id: "PICKMORETHANONE",
    name: "fruit",
    label: "Pick some fruit",
    placeholder: "Available fruits...",
    type: "multiselect",
    defaultValue: "apple,banana",
    valueDelimiter: ",",
    useChangesAsValues: true,
    options: [
      { items: ["apple", "banana", "kiwi", "melon", "grapefruit", "plum"] }
    ]
  }
];

const frag1: FieldDef[] = [
  {
    id: "ONE",
    type: "checkbox",
    name: "prop1",
    label: "Show the field in the next tab",
    value: true
  }
];

const frag2: FieldDef[] = [
  {
    id: "TWO",
    type: "textarea",
    name: "prop2",
    label: "Shown when the field in the first tab is checked",
    visibleWhen: [
      {
        field: "ONE",
        is: [true]
      }
    ]
  }
];

export { createTeamForm, form1, frag1, frag2, rendererChoice };
