import UI from "./ui";

import uniqid from "uniqid";
import DemoPDF from "../docs/demo.pdf";
import DemoPDF2 from "../docs/sample.pdf";

describe("UI", () => {
  let ui;
  beforeEach(() => {
    ui = new UI();
  });

  test("starts in upload screen", () => {
    expect(ui.screen).toEqual("uploads");
  });

  test("starts with empty files array", () => {
    expect(ui.files).toEqual([]);
  });

  test("ingest file uploads", () => {
    expect(() => ui.ingestFiles()).not.toThrow();
  });

  test("returns previously ingested files", () => {
    ui.ingestFiles({
      file: DemoPDF2,
      num: 2,
      name: "demo.pdf",
      id: "sktwitzel4z7h0v1",
      conditions: [],
      // pagesConditions: new Array(2).fill([]),
      pagesConditions: [
        {
          pageId: "sktwitzel4z7h0v2",
          conditions: [],
        },
        {
          pageId: "sktwitzel4z7h0v3",
          conditions: [],
        },
      ],
    });

    expect(ui.files).toStrictEqual([
      {
        file: DemoPDF2,
        num: 2,
        name: "demo.pdf",
        id: "sktwitzel4z7h0v1",
        conditions: [],
        // pagesConditions: new Array(2).fill([]),
        pagesConditions: [
          {
            pageId: "sktwitzel4z7h0v2",
            conditions: [],
          },
          {
            pageId: "sktwitzel4z7h0v3",
            conditions: [],
          },
        ],
      },
    ]);
  });

  test("user can advance from uploads to tagging", () => {
    ui.goToNextScreen();
    expect(ui.screen).toEqual("tagging");
  });

  describe("two files ingested for tagging", () => {
    beforeEach(() => {
      ui.ingestFiles(
        {
          file: DemoPDF2,
          num: 2,
          name: "demo.pdf",
          id: "sktwitzel4z7h0v1",
          conditions: [],
          // pagesConditions: new Array(2).fill([]),
          pagesConditions: [
            {
              pageId: "sktwitzel4z7h0v2",
              conditions: [],
            },
            {
              pageId: "sktwitzel4z7h0v3",
              conditions: [],
            },
          ],
        },
        {
          file: DemoPDF2,
          num: 2,
          name: "demo.pdf",
          id: "sktwitzel4z7h0v2",
          conditions: [],
          // pagesConditions: new Array(2).fill([]),
          pagesConditions: [
            {
              pageId: "sktwitzel4z7h0v3",
              conditions: [],
            },
            {
              pageId: "sktwitzel4z7h0v4",
              conditions: [],
            },
          ],
        }
      );

      ui.goToNextScreen();
    });

    test("active file index should be set when reaching tagging", () => {
      expect(ui.activeFileIndex).toEqual(0);
    });

    test("active file index can be updated", () => {
      ui.setActiveFileIndex(1);
      expect(ui.activeFileIndex).toEqual(1);
    });

    test("active file can be accessed directly", () => {
      expect(ui.activeFile).toEqual(ui.files[0]);
    });

    test("pages can be accessed directly", () => {
      expect(ui.pages).toEqual(ui.activeFile.pagesConditions);
    });

    test("active page index can be updated", () => {
      ui.setActivePageIndex(1);
      expect(ui.activePageIndex).toEqual(1);
    });

    test("active page index should be reset when changing files", () => {
      ui.setActivePageIndex(1);
      ui.setActiveFileIndex(1);
      expect(ui.activePageIndex).toEqual(0);
    });

    test("active page can be accessed directly", () => {
      expect(ui.activePage).toEqual({
        pageId: "sktwitzel4z7h0v2",
        conditions: [],
      });
    });
  });
});
