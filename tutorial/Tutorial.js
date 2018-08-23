"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _LiveEditor = require("../LiveEditor");

var _LiveEditor2 = _interopRequireDefault(_LiveEditor);

var _definitions = require("./definitions");

var _SwapiOptionsHandler = require("../SwapiOptionsHandler");

var _tutorial = require("./tutorial1.md");

var _tutorial2 = _interopRequireDefault(_tutorial);

var _tutorial3 = require("./tutorial2.md");

var _tutorial4 = _interopRequireDefault(_tutorial3);

var _tutorial5 = require("./tutorial3.md");

var _tutorial6 = _interopRequireDefault(_tutorial5);

var _tutorial7 = require("./tutorial4.md");

var _tutorial8 = _interopRequireDefault(_tutorial7);

var _tutorial9 = require("./tutorial5.md");

var _tutorial10 = _interopRequireDefault(_tutorial9);

var _tutorial11 = require("./tutorial6.md");

var _tutorial12 = _interopRequireDefault(_tutorial11);

var _tutorial13 = require("./tutorial7.md");

var _tutorial14 = _interopRequireDefault(_tutorial13);

var _tutorial15 = require("./tutorial8.md");

var _tutorial16 = _interopRequireDefault(_tutorial15);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var swapiOptions = function swapiOptions(fieldId, fields, parentContext) {
  return (0, _SwapiOptionsHandler.getOptions)();
};

var Tutorial = function (_Component) {
  _inherits(Tutorial, _Component);

  function Tutorial() {
    _classCallCheck(this, Tutorial);

    return _possibleConstructorReturn(this, (Tutorial.__proto__ || Object.getPrototypeOf(Tutorial)).apply(this, arguments));
  }

  _createClass(Tutorial, [{
    key: "render",
    value: function render() {
      var renderer = this.props.renderer;

      return _react2.default.createElement(
        "article",
        null,
        _react2.default.createElement(
          "h2",
          null,
          "Step-by-Step Examples"
        ),
        _react2.default.createElement(
          "p",
          null,
          "Read through the examples below to understand how to create complex form definitions"
        ),
        _react2.default.createElement(_LiveEditor2.default, {
          defaultDefinition: JSON.stringify(_definitions.singleField),
          editorTitle: "A single field",
          editorDescription: _tutorial2.default,
          renderer: renderer
        }),
        _react2.default.createElement(_LiveEditor2.default, {
          defaultDefinition: JSON.stringify(_definitions.visibility),
          editorTitle: "Making one field control the visibility of another",
          editorDescription: _tutorial4.default,
          renderer: renderer
        }),
        _react2.default.createElement(_LiveEditor2.default, {
          defaultDefinition: JSON.stringify(_definitions.requiredAndDisabledRules),
          editorTitle: "Requirement and disablement rules",
          editorDescription: _tutorial6.default,
          renderer: renderer
        }),
        _react2.default.createElement(_LiveEditor2.default, {
          defaultDefinition: JSON.stringify(_definitions.fieldsWithOptions),
          editorTitle: "Fields with options",
          editorDescription: _tutorial8.default,
          optionsHandler: swapiOptions,
          renderer: renderer
        }),
        _react2.default.createElement(_LiveEditor2.default, {
          defaultDefinition: JSON.stringify(_definitions.manipulateOptions),
          editorTitle: "Handling multi-value fields",
          editorDescription: _tutorial10.default,
          renderer: renderer
        }),
        _react2.default.createElement(_LiveEditor2.default, {
          defaultDefinition: JSON.stringify(_definitions.duplicateNames),
          editorTitle: "Using the multiple fields to control the same value",
          editorDescription: _tutorial12.default,
          renderer: renderer
        }),
        _react2.default.createElement(_LiveEditor2.default, {
          defaultDefinition: JSON.stringify(_definitions.validation),
          editorTitle: "Validating fields",
          editorDescription: _tutorial14.default,
          renderer: renderer
        }),
        _react2.default.createElement(_LiveEditor2.default, {
          defaultDefinition: JSON.stringify(_definitions.comparisonValidation),
          editorTitle: "Validating against other fields",
          editorDescription: _tutorial16.default,
          renderer: renderer
        })
      );
    }
  }]);

  return Tutorial;
}(_react.Component);

exports.default = Tutorial;