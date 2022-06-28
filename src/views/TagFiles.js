import React, { useState, useEffect } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import Dropzone from "react-dropzone";
import FeatherIcon from "feather-icons-react";
import { PDFDocument } from "pdf-lib";

import { Button, Alert } from "@mui/material";

import fileToArrayBuffer from "../functions/FileToArrayBuffer";

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
  console.log(toJS(files.getActiveFile));
  useEffect(() => {}, []);

  // function onDocumentLoadSuccess(pdf, index) {
  //   // console.log(index);
  //   // setNumPages(pdf.numPages);
  // }

  const FileNameClick = (id) => {
    files.updateActiveFile({ fileId: id, pageIndex: 0 });
    resetConditions();
  };

  const PageClick = (index) => {
    files.updateActiveFile({ ...files.activeFileIndex, pageIndex: index });
    resetConditions();
  };

  const resetConditions = () => {
    if (files.getCurrentPageConditions.length > 0) {
      setSelectConditionOptions(files.getCurrentPageConditions);
    } else {
      setSelectConditionOptions([]);
    }
    setNewConditions([]);
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
                        FileNameClick(file.id);
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
              Pages <span className="small-tag">{files.getActiveFile.num}</span>
            </p>
            <div className="mt-5 grid grid-cols-[minmax(0,5fr)_minmax(0,5fr)]  justify-items-center h-[60vh] items-start overflow-y-scroll">
              {[...Array(files.getActiveFile.num)].map((_, index) => {
                return (
                  <div
                    className={`hover:bg-primary_light rounded pt-4 pb-3 px-2 cursor-pointer ${
                      index === files.getActiveFileIndex("pageIndex") &&
                      `bg-primary_light`
                    }`}
                    key={index}
                    onClick={() => {
                      PageClick(index);
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
              {files.getActiveFileIndex("pageIndex") + 1}
            </p> */}
            <div className="w-[70%] mx-auto">
              <Document
                file={files.getActiveFile.file}
                className="relative"
                // onLoadSuccess={onDocumentLoadSuccess}
              >
                <Page
                  pageIndex={files.getActiveFileIndex("pageIndex")}
                  width={500}
                  renderMode="svg"
                />

                <div className="absolute left-[50%] bottom-5 translate-x-[-50%] drop-shadow rounded overflow-hidden bg-white flex items-center">
                  <button
                    type="button"
                    disabled={files.getActiveFileIndex("pageIndex") <= 0}
                    onClick={() => {
                      PageClick(files.getActiveFileIndex("pageIndex") - 1);
                    }}
                    className="p-3 cursor-pointer disabled:opacity-30 "
                  >
                    <FeatherIcon icon="chevron-left" size={18} />
                  </button>
                  <p className="border-l border-border_grey border-r px-3 py-2">
                    {files.getActiveFileIndex("pageIndex") + 1} of{" "}
                    {files.getActiveFile.num || "--"}
                  </p>
                  <button
                    type="button"
                    disabled={
                      files.getActiveFileIndex("pageIndex") >=
                      files.getActiveFile.num - 1
                    }
                    onClick={() => {
                      PageClick(files.getActiveFileIndex("pageIndex") + 1);
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
          </div>
          <div className="absolute left-9 bottom-7 w-[calc(100%_-_4.5rem)]">
            <Button
              variant="contained"
              fullWidth
              size="large"
              onClick={() => {
                console.log(selectConditionOptions);
                console.log(newConditions);
                conditions.updateConditions([
                  ...conditions.getConditions,
                  ...newConditions,
                ]);
                files.updateActiveFileConditions(selectConditionOptions);
                resetConditions();
              }}
            >
              Save Conditions
            </Button>
          </div>
        </div>
      </div>
    </>
  );
});

export default TagFiles;
