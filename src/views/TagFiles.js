import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import Dropzone from "react-dropzone";
import FeatherIcon from "feather-icons-react";
import { PDFDocument } from "pdf-lib";

import { Button, Alert } from "@mui/material";

import FileToArrayBuffer from "../functions/FileToArrayBuffer";

import uniqid from "uniqid";

// mobx
import { toJS } from "mobx";
import { files } from "../mobx/files";
import { conditions } from "../mobx/conditions";
import { observer } from "mobx-react";

// select
import Select from "react-select";
import Creatable, { useCreatable } from "react-select/creatable";
import CreatableSelect from "react-select/creatable";

const TagFiles = observer(({ ChangeStep }) => {
  const [selectConditionOptions, setSelectConditionOptions] = useState(
    files.getCurrentPageConditions
  );
  const [newConditions, setNewConditions] = useState([]);

  // test
  const [test, setTest] = useState("");
  // end test
  useEffect(() => {}, []);

  // function onDocumentLoadSuccess(pdf, index) {
  //   // console.log(index);
  //   // setNumPages(pdf.numPages);
  // }

  const FileNameClick = (fileId, pageId) => {
    files.updateActiveFile({ fileId: fileId, pageId: pageId });
    ResetConditions();
  };

  const PageClick = (pageId) => {
    files.updateActiveFile({
      ...files.activeFileIndex,
      pageId: pageId,
    });
    ResetConditions();
  };

  const ResetConditions = () => {
    if (files.getCurrentPageConditions.length > 0) {
      setSelectConditionOptions(files.getCurrentPageConditions);
    } else {
      setSelectConditionOptions([]);
    }
    setNewConditions([]);
  };

  const DownloadPdfs = async () => {
    let pdfOutputs = [];

    await Promise.all(
      files.getExportFilesArray.map(async (condition) => {
        // final output pdf
        const pdfOutput = await PDFDocument.create();
        pdfOutput.setTitle(condition.conditionName);
        await Promise.all(
          condition.includedFiles.map(async (file) => {
            // input pdfs
            const existingPdfBytes = await FileToArrayBuffer(file.file);
            const pdfDoc = await PDFDocument.load(existingPdfBytes, {
              ignoreEncryption: true,
            });
            await Promise.all(
              file.pages.map(async (page) => {
                const [existingPage] = await pdfOutput.copyPages(pdfDoc, [
                  files.getPageByPageAndFileId(file.fileId, page),
                ]);
                pdfOutput.addPage(existingPage);
              })
            );
          })
        );

        const pdfOutputUri = await pdfOutput.saveAsBase64({ dataUri: true });
        setTest(pdfOutputUri);
        pdfOutputs = [...pdfOutputs, pdfOutputUri];
      })
    );
    console.log(pdfOutputs);
  };

  return (
    <>
      <div className="grid grid-cols-[minmax(0,25fr)_minmax(0,45fr)_minmax(0,30fr)] h-[100vh]">
        <div className="bg-light_grey ">
          {/* documents */}
          <div className="px-9 pt-5 pb-2 border-b border-b-border_grey h-[30vh] ">
            <p className="label flex items-center gap-x-2">
              Documents{" "}
              <span className="small-tag">{files.getFiles.length}</span>
            </p>
            <div className="mt-5  max-h-[20vh] overflow-y-scroll">
              {files.getFiles &&
                files.getFiles.map((file, index) => {
                  return (
                    <p
                      className={`py-1 px-4  rounded hover:bg-primary_light transition-all cursor-pointer my-1 ${
                        file.id === files.getActiveFile.id && `bg-primary_light`
                      }`}
                      onClick={() => {
                        FileNameClick(file.id, file.pagesConditions[0].pageId);
                      }}
                      key={index}
                    >
                      {file.name}
                    </p>
                  );
                })}
            </div>
          </div>
          {/* end documents */}

          {/* pages */}
          <div className="px-9 py-5 h-[70vh]">
            <p className="label flex items-center gap-x-2">
              Pages{" "}
              <span className="small-tag">{files.getActiveFilePageCount}</span>
            </p>
            <div className="mt-5 grid grid-cols-[minmax(0,5fr)_minmax(0,5fr)]  justify-items-center h-[60vh] items-start overflow-y-scroll">
              {files.getActiveFile.pagesConditions.map((page, index) => {
                return (
                  <div
                    className={`hover:bg-primary_light rounded pt-4 pb-3 px-2 cursor-pointer ${
                      page.pageId === files.getActivePageId &&
                      `bg-primary_light`
                    }`}
                    key={index}
                    onClick={() => {
                      PageClick(page.pageId);
                      console.log(page.pageId);
                    }}
                  >
                    <Document
                      file={files.getActiveFile.file}
                      // onLoadSuccess={onDocumentLoadSuccess}
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
              })}
            </div>
          </div>
          {/* end pages */}
        </div>
        <div className="bg-white px-9 pt-6 pb-9">
          <div className="">
            <div
              className="flex items-center cursor-pointer mb-10"
              onClick={() => {
                ChangeStep(0);
              }}
            >
              <FeatherIcon
                icon="chevron-left"
                size={20}
                className="text-body_grey pr-1"
              />
              <p className="label">Back to upload</p>
            </div>
            {/* <p className="label mb-5 text-center">
              {files.getActiveFile.name} / Page{" "}
              {files.getActivePageArrayIndex + 1}
            </p> */}
            <div className="w-[70%] mx-auto">
              <Document
                file={files.getActiveFile.file}
                className="relative"
                // onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page
                  pageIndex={files.getActivePageArrayIndex}
                  width={500}
                  renderMode="svg"
                />

                <div className="absolute left-[50%] bottom-5 translate-x-[-50%] drop-shadow rounded overflow-hidden bg-white flex items-center">
                  <button
                    type="button"
                    disabled={files.getActivePageArrayIndex <= 0}
                    onClick={() => {
                      PageClick(
                        files.getActiveFile.pagesConditions[
                          files.getActivePageArrayIndex - 1
                        ].pageId
                      );
                    }}
                    className="p-3 cursor-pointer disabled:opacity-30 "
                  >
                    <FeatherIcon icon="chevron-left" size={18} />
                  </button>
                  <p className="border-l border-border_grey border-r px-3 py-2">
                    {files.getActivePageArrayIndex + 1} of{" "}
                    {files.getActiveFilePageCount || "--"}
                  </p>
                  <button
                    type="button"
                    disabled={
                      files.getActivePageArrayIndex >=
                      files.getActiveFilePageCount - 1
                    }
                    onClick={() => {
                      PageClick(
                        files.getActiveFile.pagesConditions[
                          files.getActivePageArrayIndex + 1
                        ].pageId
                      );
                    }}
                    className="p-3 cursor-pointer disabled:opacity-30"
                  >
                    <FeatherIcon icon="chevron-right" size={18} />
                  </button>
                </div>
              </Document>
            </div>
          </div>
        </div>
        <div className="bg-light_grey py-9 relative ">
          <div className="max-h-[90vh] overflow-y-scroll pb-[80px] h-full">
            <div className="px-9">
              <CreatableSelect
                isClearable={false}
                placeholder="Select Conditions"
                options={conditions.getConditions}
                isMulti={true}
                value={selectConditionOptions}
                onCreateOption={(value) => {
                  setSelectConditionOptions((selectConditionOptions) => [
                    ...selectConditionOptions,
                    {
                      value: uniqid(),
                      label: value,
                    },
                  ]);
                  setNewConditions((newConditions) => [
                    ...newConditions,
                    {
                      value: uniqid(),
                      label: value,
                    },
                  ]);
                }}
                onChange={(value) => {
                  // conditions.updateConditions([
                  //   ...conditions.getConditions,
                  //   { value: uniqid(), label: value },
                  // ]);
                  setSelectConditionOptions(value);
                  // setSelectConditionOptions({
                  //   value: "werwer",
                  //   label: value,
                  // });
                  console.log(value);
                }}
              />
            </div>
            {/* list */}
            <div className="mt-8  pl-9 pr-6">
              <p className="label">Conditions</p>
              {selectConditionOptions.length > 0 ? (
                selectConditionOptions.map((condition, index) => {
                  return (
                    <div
                      key={index}
                      className="flex justify-between items-center border-b-border_grey border-b py-3"
                    >
                      <p className="max-w-[calc(100%_-_3rem)]">
                        {condition.label}
                      </p>
                      <div
                        className="bg-primary_light rounded-full w-[2rem] h-[2rem] flex justify-center items-center cursor-pointer"
                        onClick={() => {
                          setSelectConditionOptions(
                            selectConditionOptions.filter(
                              (x) => x.value !== condition.value
                            )
                          );
                        }}
                      >
                        <FeatherIcon
                          icon="x"
                          size={14}
                          className="text-primary"
                        />
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="mt-3">Select condtion from the field on top.</p>
              )}
            </div>
            {/* end list */}
            <iframe src={test}></iframe>
            <a href={test} download>
              download
            </a>
          </div>

          <div className="absolute left-9 bottom-7 w-[calc(100%_-_4.5rem)]">
            <div>
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => {
                  conditions.updateConditions([
                    ...conditions.getConditions,
                    ...newConditions,
                  ]);
                  files.updateActiveFileConditions(selectConditionOptions);
                  ResetConditions();
                }}
              >
                Save Conditions
              </Button>
            </div>

            <div className="mt-2">
              <Button
                variant="contained"
                fullWidth
                size="large"
                onClick={() => {
                  console.log(toJS(files.getFiles));
                  console.log(files.getExportFilesArray);
                  DownloadPdfs();
                }}
              >
                Export Documents
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
});

export default TagFiles;
