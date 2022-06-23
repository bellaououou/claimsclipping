import React, { useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import Dropzone from "react-dropzone";
import FeatherIcon from "feather-icons-react";
import { PDFDocument } from "pdf-lib";

import { Button, Alert } from "@mui/material";

import fileToArrayBuffer from "../functions/FileToArrayBuffer";

// DEMO DATA
import DemoPDF from "../docs/demo.pdf";
import DemoPDF2 from "../docs/sample.pdf";
import { act } from "react-dom/test-utils";
import { upload } from "@testing-library/user-event/dist/upload";

const DataArray = [
  {
    file: DemoPDF,
    num: 2,
    name: "demo.pdf",
  },
  {
    file: DemoPDF2,
    num: 2,
    name: "demo2.pdf",
  },
  {
    file: DemoPDF,
    num: 1,
    name: "demo3.pdf",
  },
];
// END DEMO

const TagFiles = () => {
  const [uploadFiles, setUploadFiles] = useState(DataArray);
  const [activeFile, setActiveFile] = useState({
    fileIndex: 0,
    pageIndex: 0,
  });

  function onDocumentLoadSuccess(pdf, index) {
    // console.log(index);
    // setNumPages(pdf.numPages);
  }

  const FileNameClick = (index) => {
    setActiveFile({ fileIndex: index, pageIndex: 0 });
  };

  const PageClick = (index) => {
    setActiveFile({ ...activeFile, pageIndex: index });
  };

  return (
    <>
      <div className="grid grid-cols-[minmax(0,25fr)_minmax(0,45fr)_minmax(0,30fr)] h-[100vh]">
        <div className="bg-light_grey ">
          {/* documents */}
          <div className="px-9 pt-9 pb-2 border-b border-b-border_grey h-[30vh]">
            <p className="label flex items-center gap-x-2">
              Documents <span className="small-tag">6</span>
            </p>
            <div className="mt-5  max-h-[20vh] overflow-y-scroll">
              {uploadFiles &&
                uploadFiles.map((file, index) => {
                  return (
                    <p
                      className={`py-1 px-4  rounded hover:bg-primary_light transition-all cursor-pointer my-1 ${
                        index === activeFile.fileIndex && `bg-primary_light`
                      }`}
                      onClick={() => {
                        FileNameClick(index);
                      }}
                    >
                      {file.name}
                    </p>
                  );
                })}
            </div>
          </div>
          {/* end documents */}

          {/* pages */}
          <div className="px-9 py-9 h-[70vh]">
            <p className="label flex items-center gap-x-2">
              Pages <span className="small-tag">10</span>
            </p>
            <div className="mt-5 grid grid-cols-[minmax(0,5fr)_minmax(0,5fr)]  justify-items-center h-[60vh] items-start overflow-y-scroll">
              {[...Array(uploadFiles[activeFile.fileIndex].num)].map(
                (_, index) => {
                  return (
                    <div
                      className={`hover:bg-primary_light rounded pt-4 pb-3 px-2 cursor-pointer ${
                        index === activeFile.pageIndex && `bg-primary_light`
                      }`}
                      key={index}
                      onClick={() => {
                        PageClick(index);
                      }}
                    >
                      <Document
                        file={uploadFiles[activeFile.fileIndex].file}
                        onLoadSuccess={onDocumentLoadSuccess}
                        className="relative mx-auto"
                      >
                        <Page pageIndex={index} width={140} />
                        <span className="small-tag absolute right-3 bottom-3">
                          6
                        </span>
                      </Document>

                      <p className="text-center mt-1">Page {index + 1}</p>
                    </div>
                  );
                }
              )}
            </div>
          </div>
          {/* end pages */}
        </div>
        <div className="bg-white py-9 px-9 ">
          <div className="">
            <p className="label mb-10">
              {uploadFiles[activeFile.fileIndex].name} / Page{" "}
              {activeFile.pageIndex + 1}
            </p>
            <div className="w-[70%] mx-auto">
              <Document
                file={uploadFiles[activeFile.fileIndex].file}
                onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page
                  pageIndex={activeFile.pageIndex}
                  width={500}
                  renderMode="svg"
                />
              </Document>
            </div>
          </div>
        </div>
        <div className="bg-light_grey "></div>
      </div>
    </>
  );
};

export default TagFiles;
