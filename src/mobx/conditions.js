import { makeAutoObservable } from "mobx";
import { computedFn } from "mobx-utils";
import uniqid from "uniqid";

const options = [
  { value: uniqid(), label: "Chocolate" },
  { value: uniqid(), label: "Strawberry" },
  { value: uniqid(), label: "Vanilla" },
  { value: uniqid(), label: "22" },
];

class Conditionss {
  constructor() {
    this.conditions = options;
    makeAutoObservable(this);
  }

  updateConditions(conditions) {
    this.conditions = conditions;
  }

  get getConditions() {
    return this.conditions;
  }

  getConditionById = computedFn((id) => {
    return this.conditions.find((condition) => condition.value === id);
  });
}

// Conditions
export const conditions = new Conditionss();
