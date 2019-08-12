"use strict";

const collectDependents = require("./collect-dependents");

module.exports = collectPackages;

function collectPackages(packages, { isCandidate = () => true, onInclude, excludeDepdendents = false } = {}) {
  const candidates = new Set();

  packages.forEach((node, name) => {
    if (isCandidate(node, name)) {
      candidates.add(node);
    }
  });

  // An --exclude-dependents command line flag enables a user
  // to opt out of including dependents (which is the default behavior)
  if (!excludeDepdendents) {
    const dependents = collectDependents(candidates);
    dependents.forEach(node => candidates.add(node));
  }

  // The result should always be in the same order as the input
  const updates = [];

  packages.forEach((node, name) => {
    if (candidates.has(node)) {
      if (onInclude) {
        onInclude(name);
      }
      updates.push(node);
    }
  });

  return updates;
}
