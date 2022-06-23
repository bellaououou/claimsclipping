import React, { useState, useEffect } from "react";

import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

import DemoPDF from "../docs/sample.pdf";
import Dropzone from "react-dropzone";
import FeatherIcon from "feather-icons-react";
import { upload } from "@testing-library/user-event/dist/upload";

import fileToArrayBuffer from "../functions/FileToArrayBuffer";

const Test = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(2);

  function onDocumentLoadSuccess(pdf, index) {
    // console.log(pdf);
    // console.log(index);
    // setNumPages(pdf.numPages);
  }

  //   drag and drop
  const [uploadFiles, setUploadFiles] = useState([]);
  const displayPdfList = (acceptedFiles) => {
    //   Get number of pages
    // let reader = new FileReader();
    // let num = 1;
    // reader.readAsBinaryString(acceptedFiles[0]);
    // reader.onloadend = function () {
    //   num = reader.result.match(/\/Type[\s]*\/Page[^s]/g).length;
    // };
    // end get number of pages

    acceptedFiles.forEach((file) => {
      (async () => {
        // console.log(
        //   uploadFiles.filter((fileObject) => {
        //     return fileObject.name !== file.name;
        //   })
        // );
        setUploadFiles([
          ...uploadFiles,
          {
            file: file,
            name: file.name,
            // num: await getPdfPageNum(file),
          },
        ]);
      })();
    });
  };
  // end drag and drop

  //   pdf
  const [pdfInfo, setPdfInfo] = useState([]);
  useEffect(() => {
    modifyPdf(DemoPDF);
  }, []);

  const getPdfPageNum = async (pdfFile) => {
    const existingPdfBytes = await fileToArrayBuffer(pdfFile);

    const pdfDoc = await PDFDocument.load(existingPdfBytes, {
      ignoreEncryption: true,
    });
    const pages = pdfDoc.getPages();
    return pages.length;
  };

  const modifyPdf = async (pdfFile) => {
    const existingPdfBytes = await fetch(pdfFile).then((res) =>
      res.arrayBuffer()
    );
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];

    // Get the width and height of the first page
    const { width, height } = firstPage.getSize();
    firstPage.drawText("This text was added with JavaScript!", {
      x: 5,
      y: height / 2 + 300,
      size: 50,
      color: rgb(0.95, 0.1, 0.1),
    });

    const pdfBytes = await pdfDoc.save();

    const bytes = new Uint8Array(pdfBytes);
    const blob = new Blob([bytes], { type: "application/pdf" });
    const docUrl = URL.createObjectURL(blob);
    setPdfInfo(docUrl);
  };

  // end pdf
  return (
    <>
      <button
        onClick={() => {
          console.log(uploadFiles);
        }}
      >
        click
      </button>

      <Dropzone
        onDrop={displayPdfList}
        accept={{ "application/pdf": [".pdf"] }}
      >
        {({ getRootProps, getInputProps }) => (
          <div
            {...getRootProps()}
            className="w-[350px] h-[350px] bg-light_grey text-primary cursor-pointer flex justify-center items-center"
          >
            <div className="text-center m-auto">
              <input {...getInputProps()} />
              <FeatherIcon
                icon="upload-cloud"
                className="mx-auto mb-1"
                size={30}
              />
              <p className="uppercase font-semibold">File Upload</p>
            </div>
          </div>
        )}
      </Dropzone>

      {uploadFiles &&
        uploadFiles.map((file, index) => {
          return (
            <>
              <p key={index}>{file.name}</p>
              <div className="max-w-[300px]">
                <Document file={file.file} onLoadSuccess={(pdf, index) => {}}>
                  <Page pageNumber={1} />
                </Document>
                <p className="text-[30px]">
                  Page {pageNumber} of {numPages}
                </p>
              </div>
            </>
          );
        })}

      {/* <div className="max-w-[300px]">
        <Document file={DemoPDF} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={2} />
        </Document>
        <p className="text-[30px]">
          Page {pageNumber} of {numPages}
        </p>
      </div> */}
    </>
  );
};

export default Test;
