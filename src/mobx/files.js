import { makeAutoObservable } from "mobx";
import { computedFn } from "mobx-utils";

// DEMO DATA
import uniqid from "uniqid";
import DemoPDF from "../docs/demo.pdf";
import DemoPDF2 from "../docs/sample.pdf";

const DataArray = [
  {
    file: DemoPDF,
    num: 2,
    name: "demo.pdf",
    id: uniqid(),
    conditions: [],
    // pagesConditions: new Array(2).fill([]),
    pagesConditions: [
      {
        pageId: uniqid(),
        conditions: [],
      },
      {
        pageId: uniqid(),
        conditions: [],
      },
      {
        pageId: uniqid(),
        conditions: [],
      },
      {
        pageId: uniqid(),
        conditions: [],
      },
    ],
  },
  {
    file: DemoPDF2,
    num: 2,
    name: "demo2.pdf",
    id: uniqid(),
    conditions: [],
    // pagesConditions: new Array(2).fill([]),
    pagesConditions: [
      {
        pageId: uniqid(),
        conditions: [],
      },
      {
        pageId: uniqid(),
        conditions: [],
      },
    ],
  },
];

const ExportFiles = [
  {
    conditionName: "",
    conditionId: "",
    includedFiles: [
      {
        fileId: "",
        file: "",
        pages: ["pageid", "pageid"],
      },
    ],
    includedPages: [
      {
        pageId: "",
        file: "",
      },
    ],
  },
];

class Files {
  constructor() {
    this.files = DataArray;
    this.activeFileIndex = {
      fileId: this.files[0].id,
      pageId: this.files[0].pagesConditions[0].pageId,
    };
    this.exportFiles = [];
    this.exportFilesInfo = [];
    makeAutoObservable(this);
  }

  updateFiles(files) {
    this.files = files;
  }
  updateActiveFile(activeFile) {
    this.activeFileIndex = activeFile;
  }
  updateActiveFileConditions(conditions) {
    this.getActiveFile.pagesConditions[
      this.getActivePageArrayIndex
    ].conditions = conditions;
  }

  updateExportFiles(exportFiles) {
    this.exportFiles = exportFiles;
  }

  get getFiles() {
    return this.files;
  }
  get getActiveFileArrayIndex() {
    return this.files
      .map((file) => file.id)
      .indexOf(this.activeFileIndex.fileId);
  }

  get getActiveFile() {
    return this.files.find((file) => file.id === this.activeFileIndex.fileId);
  }

  get getActivePageArrayIndex() {
    return this.files[this.getActiveFileArrayIndex].pagesConditions
      .map((page) => page.pageId)
      .indexOf(this.activeFileIndex.pageId);
  }

  get getActiveFilePageCount() {
    return this.getActiveFile.pagesConditions.length;
  }

  get getActivePageId() {
    return this.files[this.getActiveFileArrayIndex].pagesConditions[
      this.getActivePageArrayIndex
    ].pageId;
  }

  getFileByFileId = computedFn((fileId) => {
    return this.files.map((file) => file.id).indexOf(fileId);
  });

  getPageByPageAndFileId = computedFn((fileId, pageId) => {
    console.log(this.getFileByFileId(fileId));
    return this.files[this.getFileByFileId(fileId)].pagesConditions
      .map((page) => page.pageId)
      .indexOf(pageId);
  });

  get getCurrentPageConditions() {
    return this.getActiveFile.pagesConditions[this.getActivePageArrayIndex]
      .conditions;
  }

  // getActiveFileIndex = computedFn((type) => {
  //   return this.activeFileIndex[type];
  // });

  get getExportFilesInfo() {
    return this.exportFilesInfo;
  }

  // QUESTION: should i put it here?
  formatExportFilesInfo = computedFn(() => {
    this.files.map((file) => {
      file.pagesConditions.map((page) => {
        page.conditions.map((condition) => {
          //some?
          //If the condition has already existed in filesArray
          if (
            this.exportFilesInfo.filter(
              (file) => file.conditionId === condition.value
            ).length > 0
          ) {
            const targetFileIndex = this.exportFilesInfo
              .map((file) => file.conditionId)
              .indexOf(condition.value);

            // check if file is already in fileArray
            let fileIsInArray = this.exportFilesInfo.some((condition) => {
              return condition.includedFiles.some((eachFile) => {
                return eachFile.fileId === file.id;
              });
            });

            // console.log(fileIsInArray);

            if (fileIsInArray) {
              const targetPageFileIndex = this.exportFilesInfo[
                targetFileIndex
              ].includedFiles
                .map((eachFile) => eachFile.fileId)
                .indexOf(file.id);

              this.exportFilesInfo[targetFileIndex].includedFiles[
                targetPageFileIndex
              ].pages = [
                ...this.exportFilesInfo[targetFileIndex].includedFiles[
                  targetPageFileIndex
                ].pages,
                page.pageId,
              ];
            } else {
              this.exportFilesInfo[targetFileIndex].includedFiles = [
                ...this.exportFilesInfo[targetFileIndex].includedFiles,
                {
                  fileId: file.id,
                  file: file.file,
                  pages: [page.pageId],
                },
              ];
            }
          } else {
            this.exportFilesInfo = [
              ...this.exportFilesInfo,
              {
                conditionName: condition.label,
                conditionId: condition.value,
                includedFiles: [
                  {
                    fileId: file.id,
                    file: file.file,
                    pages: [page.pageId],
                  },
                ],
              },
            ];
          }
        });
      });
    });
    return this.exportFilesInfo;
  });

  get getExportFiles() {
    return this.exportFiles;
  }
}

// Files
export const files = new Files();
