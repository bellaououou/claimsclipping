import { makeAutoObservable } from "mobx";
import { computedFn } from "mobx-utils";

// DEMO DATA
import uniqid from "uniqid";
import DemoPDF from "../docs/demo.pdf";
import DemoPDF2 from "../docs/sample.pdf";

const DataArray = [
  {
    file: DemoPDF2,
    num: 2,
    name: "demo.pdf",
    id: uniqid(),
    conditions: [],
    // pagesConditions: [[], []],
    pagesConditions: new Array(2).fill([]),
  },
  {
    file: DemoPDF,
    num: 2,
    name: "demo2.pdf",
    id: uniqid(),
    conditions: [],
    pagesConditions: new Array(2).fill([]),
  },
];

class Files {
  constructor() {
    this.files = DataArray;
    this.activeFileIndex = {
      fileId: this.files[0].id,
      pageIndex: 0,
    };
    makeAutoObservable(this);
  }

  updateActiveFile(activeFile) {
    this.activeFileIndex = activeFile;
  }

  updateFiles(files) {
    this.files = files;
  }

  updateActiveFileConditions(conditions) {
    this.getActiveFile.pagesConditions[this.getActiveFileIndex("pageIndex")] =
      conditions;
  }

  get getCurrentPageConditions() {
    // return this.files[this.getActiveFileArrayIndex].pagesConditions[
    //   this.getActiveFileIndex["pageIndex"]
    // ];
    // return this.files[0].pagesConditions[0];
    return this.getActiveFile.pagesConditions[
      this.getActiveFileIndex("pageIndex")
    ];
  }

  get getFiles() {
    return this.files;
  }

  get getActiveFileArrayIndex() {
    return this.files
      .map((file) => file.id)
      .indexOf(this.getActiveFileIndex("fileId"));
  }

  get getActiveFile() {
    return this.files.find((file) => file.id === this.activeFileIndex.fileId);
  }

  getActiveFileIndex = computedFn((type) => {
    return this.activeFileIndex[type];
  });
}

// Files
export const files = new Files();
