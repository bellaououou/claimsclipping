import { makeAutoObservable } from "mobx";
import { computedFn } from "mobx-utils";
import uniqid from "uniqid";

const options = [
  { value: uniqid(), label: "Achilles tendinopathy and bursitis" },
  { value: uniqid(), label: "Chondromalacia patella" },
  { value: uniqid(), label: "Cut, stab, abrasion and laceration" },
  { value: uniqid(), label: "Dislocation" },
  { value: uniqid(), label: "Fracture" },
  { value: uniqid(), label: "Internal derangement of the knee" },
  { value: uniqid(), label: "Intervertebral disc prolapse" },
  { value: uniqid(), label: "Joint instability" },
  { value: uniqid(), label: "Labral tear" },
  { value: uniqid(), label: "Lumbar spondylosis" },
  { value: uniqid(), label: "Non-melanotic malignant neoplasm of the skin" },
  { value: uniqid(), label: "Osteoarthritis" },
  { value: uniqid(), label: "Plantar fasciitis" },
  { value: uniqid(), label: "Rotator cuff syndrome" },
  { value: uniqid(), label: "Sensorineural hearing loss" },
  { value: uniqid(), label: "Shin splints" },
  { value: uniqid(), label: "Solar keratosis" },
  { value: uniqid(), label: "Sprain and strain" },
  { value: uniqid(), label: "Thoracic spondylosis" },
  { value: uniqid(), label: "Tinnitus" },
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
