"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var getOptions = exports.getOptions = function getOptions() {
  return fetch("https://swapi.co/api/people/").then(function (response) {
    return response.json();
  }).then(function (json) {
    var items = json.results.map(function (character) {
      return character.name;
    });
    var options = [{
      items: items
    }];
    return options;
  });
};