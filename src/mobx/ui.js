import { makeAutoObservable } from "mobx";

const screenOrder = ["uploads", "tagging"];

export default class UI {
  screen = "uploads";
  files = [];
  activeFileIndex = 0;
  activePageIndex = 0;

  constructor() {
    // this.files = DataArray;
    // this.activeFileIndex = {
    //   fileId: this.files[0].id,
    //   pageId: this.files[0].pagesConditions[0].pageId,
    // };
    // this.exportFiles = [];
    // this.exportFilesInfo = [];

    makeAutoObservable(this);
  }

  ingestFiles(files) {
    this.files.push(...(files?.count ? files : [files]));
  }

  goToNextScreen() {
    const oldScreenIndex = screenOrder.indexOf(this.screen);
    this.screen = screenOrder[oldScreenIndex + 1];
  }

  setActiveFileIndex(index) {
    this.activeFileIndex = index;
    this.activePageIndex = 0;
  }

  get activeFile() {
    return this.files[this.activeFileIndex];
  }

  setActivePageIndex(index) {
    this.activePageIndex = index;
  }

  get pages() {
    return this.activeFile.pagesConditions;
  }

  get activePage() {
    return this.pages[this.activePageIndex];
  }
}
