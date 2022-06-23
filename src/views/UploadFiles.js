import React, { useCallback, useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import Dropzone from "react-dropzone";
import FeatherIcon from "feather-icons-react";
import { PDFDocument } from "pdf-lib";

import { Button, Alert } from "@mui/material";

import FileToArrayBuffer from "../functions/FileToArrayBuffer";

// const RemoveCurrentList = (currentFile, uploadFiles, setUploadFiles) => {
//   setUploadFiles(uploadFiles.filter((file) => file.file !== currentFile));
// };

const UploadFiles = () => {
  const [uploadFiles, setUploadFiles] = useState([]);
  const [duplicateFile, setDuplicateFile] = useState({
    duplicate: false,
    name: "",
  });

  const GetPdfPageNum = async (pdfFile) => {
    const existingPdfBytes = await FileToArrayBuffer(pdfFile);

    const pdfDoc = await PDFDocument.load(existingPdfBytes, {
      ignoreEncryption: true,
    });
    const pages = pdfDoc.getPages();
    return pages.length;
  };

  //   const [openSnackbar, setOpenSnackbar] = useState(false);
  const DisplayPdfList = useCallback(
    (acceptedFiles) => {
      acceptedFiles.forEach(async (file, index) => {
        if (uploadFiles.some((e) => e.name === file.name)) {
          setDuplicateFile({ name: file.name, duplicate: true });
          setTimeout(() => {
            setDuplicateFile({ ...duplicateFile, duplicate: false });
          }, 5000);
        } else {
          const num = await GetPdfPageNum(file);
          setUploadFiles((uploadFiles) => [
            ...uploadFiles,
            {
              file: file,
              num: num,
              name: file.name,
            },
          ]);
        }
      });
    },
    [uploadFiles, setDuplicateFile, GetPdfPageNum, setUploadFiles]
  );

  const RemoveCurrentList = (currentFile) => {
    setUploadFiles(uploadFiles.filter((file) => file.file !== currentFile));
  };

  const CloseDuplicateMessage = () => {
    setDuplicateFile({ ...duplicateFile, duplicate: false });
  };

  return (
    <>
      <div className="grid grid-cols-[minmax(0,7fr)_minmax(0,3fr)] h-[100vh]">
        <div className="bg-light_grey flex justify-center items-center relative">
          {duplicateFile.duplicate && (
            <div className="absolute top-10 w-[70%]">
              <Alert
                severity="error"
                onClose={() => {
                  CloseDuplicateMessage();
                }}
                className="my-3"
              >
                {duplicateFile.name} has already been uploaded.
              </Alert>
            </div>
          )}

          <Dropzone
            onDrop={DisplayPdfList}
            accept={{ "application/pdf": [".pdf"] }}
          >
            {({ getRootProps, getInputProps }) => (
              <div
                {...getRootProps()}
                className="w-[350px] h-[350px] bg-primary_light text-primary cursor-pointer flex justify-center items-center"
              >
                <div className="text-center m-auto">
                  <input {...getInputProps()} />
                  <FeatherIcon
                    icon="upload-cloud"
                    className="mx-auto mb-1"
                    size={30}
                  />
                  <p className="label text-primary">File Upload</p>
                </div>
              </div>
            )}
          </Dropzone>
        </div>
        <div className="px-9 py-9 relative pb-20">
          <p className="label">Documents</p>
          <div className="mt-6">
            {uploadFiles.length > 0 ? (
              uploadFiles.map((file, index) => {
                return (
                  <div
                    key={index}
                    className="flex justify-between items-center border-b-border_grey border-b py-3"
                  >
                    {/* last:border-b-0 */}
                    <p className="max-w-[calc(100%_-_3rem)]">{file.name}</p>
                    <div
                      className="bg-primary_light rounded-full w-[2.2rem] h-[2.2rem] flex justify-center items-center cursor-pointer"
                      onClick={() => {
                        RemoveCurrentList(file.file);
                      }}
                    >
                      <FeatherIcon
                        icon="x"
                        size={16}
                        className="text-primary"
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p>Upload some files to start.</p>
            )}
          </div>

          <div className="absolute bottom-7 w-[calc(100%_-_4.5rem)]">
            <Button variant="contained" fullWidth size="large">
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UploadFiles;
