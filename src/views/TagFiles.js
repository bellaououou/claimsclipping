import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import Dropzone from "react-dropzone";
import FeatherIcon from "feather-icons-react";
import { PDFDocument } from "pdf-lib";

import { Button, Alert, CircularProgress } from "@mui/material";
import { LoadingButton } from "@mui/lab";

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

// zip
import { saveAs } from "file-saver";

const TagFiles = observer(({ ChangeStep }) => {
  const [downloadLoading, setDownloadLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [canDownload, setcanDownload] = useState(false);

  // function onDocumentLoadSuccess(pdf, index) {
  //   // console.log(index);
  //   // setNumPages(pdf.numPages);
  // }

  useEffect(() => {
    CheckHasConditions();
  }, []);

  const CheckHasConditions = () => {
    let hasConditions = files.getFiles.some((file) => {
      return file.pagesConditions.some((condition) => {
        return condition.conditions.length > 0;
      });
    });
    hasConditions ? setcanDownload(true) : setcanDownload(false);
  };

  const FileNameClick = (fileId, pageId) => {
    files.updateActiveFile({ fileId: fileId, pageId: pageId });
  };

  const PageClick = (pageId) => {
    files.updateActiveFile({
      ...files.activeFileIndex,
      pageId: pageId,
    });
  };

  // QUESTION: should i put this function here?
  const DownloadPdfs = async () => {
    setDownloadLoading(true);

    files.formatExportFilesInfo();
    await Promise.all(
      files.getExportFilesInfo.map(async (condition) => {
        // final output pdf
        const pdfOutput = await PDFDocument.create();
        pdfOutput.setTitle(condition.conditionName);
        await Promise.all(
          condition.includedFiles.map(async (file) => {
            // input pdfs
            const existingPdfBytes = await FileToArrayBuffer(file.file);
            const pdfDoc = await PDFDocument.load(existingPdfBytes, {
              // ignoreEncryption: true,
            });
            await Promise.all(
              file.pages.map(async (page) => {
                // each page inside same file

                const [existingPage] = await pdfOutput.copyPages(pdfDoc, [
                  files.getPageByPageAndFileId(file.fileId, page),
                ]);
                // const [existingPage] = await pdfOutput.copyPages(pdfDoc, [0]);

                pdfOutput.addPage(existingPage);
              })
            );
          })
        );

        const pdfOutputUri = await pdfOutput.saveAsBase64();
        files.updateExportFiles([
          ...files.getExportFiles,
          {
            uri: pdfOutputUri,
            name: condition.conditionName,
          },
        ]);
      })
    )
      .then(() => {
        setErrorMessage("");
        // zip
        const zip = require("jszip")();
        files.getExportFiles.map((file) => {
          zip.file(file.name + ".pdf", file.uri, {
            base64: true,
          });
        });
        zip.generateAsync({ type: "blob" }).then((content) => {
          saveAs(content, "conditions.zip");
          setDownloadLoading(false);
        });
        // end zip
      })
      .catch(function (err) {
        setDownloadLoading(false);
        setErrorMessage(err.message);
      });
  };
  return (
    <div className="">
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
            <div
              className="mt-5 grid grid-cols-[minmax(0,5fr)_minmax(0,5fr)]  justify-items-center h-[60vh] items-start overflow-y-scroll
            gap-y-3 content-start
            "
            >
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
                    }}
                  >
                    <Document
                      file={files.getActiveFile.file}
                      // onLoadSuccess={onDocumentLoadSuccess}
                      className="relative mx-auto w-[140px]"
                      loading={
                        <div className="w-[140px] h-[140px] flex items-center justify-center">
                          <CircularProgress size={20} />
                        </div>
                      }
                    >
                      <Page
                        pageIndex={index}
                        width={140}
                        renderAnnotationLayer={false}
                        renderTextLayer={false}
                        loading={
                          <div className="w-[140px] h-[140px] flex items-center justify-center">
                            <CircularProgress size={20} />
                          </div>
                        }
                      />
                      {files.getActiveFile.pagesConditions[index].conditions
                        .length > 0 && (
                        <span className="small-tag absolute right-3 bottom-3">
                          {
                            files.getActiveFile.pagesConditions[index]
                              .conditions.length
                          }
                        </span>
                      )}
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
            {errorMessage.length > 0 && (
              <div className="mb-5">
                <Alert
                  severity="error"
                  onClose={() => {
                    setErrorMessage("");
                  }}
                  className="my-3"
                >
                  {errorMessage}
                </Alert>
              </div>
            )}

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
                className="relative w-[500px]"
                loading={
                  <div className="w-[500px] h-[250px] flex items-center justify-center">
                    <CircularProgress size={25} />
                  </div>
                }
                // onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page
                  pageIndex={files.getActivePageArrayIndex}
                  width={500}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  loading={
                    <div className="w-[500px] h-[250px] flex items-center justify-center">
                      <CircularProgress size={25} />
                    </div>
                  }
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
                value={files.getActiveConditions}
                onCreateOption={(value) => {
                  let uniqueId = uniqid();
                  conditions.updateConditions([
                    ...conditions.getConditions,
                    {
                      value: uniqueId,
                      label: value,
                    },
                  ]);

                  files.updateActiveFileConditions([
                    ...files.getActiveConditions,
                    {
                      value: uniqueId,
                      label: value,
                    },
                  ]);
                  CheckHasConditions();
                  console.log("on create new");
                }}
                onChange={(value) => {
                  files.updateActiveFileConditions(value);
                  CheckHasConditions();
                }}
              />
            </div>
            {/* list */}
            <div className="mt-8  pl-9 pr-6">
              <p className="label">Conditions</p>
              {files.getActiveConditions.length > 0 ? (
                files.getActiveConditions.map((condition, index) => {
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
                          files.updateActiveFileConditions(
                            files.getActiveConditions.filter(
                              (x) => x.value !== condition.value
                            )
                          );
                          CheckHasConditions();
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
          </div>

          <div className="absolute left-9 bottom-7 w-[calc(100%_-_4.5rem)]">
            <div className="mt-2">
              {downloadLoading ? (
                <LoadingButton
                  loading
                  fullWidth
                  size="large"
                  variant="contained"
                >
                  Downloading
                </LoadingButton>
              ) : (
                <Button
                  variant="contained"
                  fullWidth
                  disabled={!canDownload}
                  size="large"
                  onClick={() => {
                    DownloadPdfs();
                  }}
                >
                  Export Documents
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default TagFiles;
