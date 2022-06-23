import React, { useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";

import DemoPDF from "../docs/sample.pdf";

import UploadFiles from "../views/UploadFiles";
import TagFiles from "../views/TagFiles";

const Home = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(2);

  function onDocumentLoadSuccess(pdf) {
    console.log(pdf);
    setNumPages(pdf.numPages);
  }

  return (
    <>
      {/* <UploadFiles /> */}
      <TagFiles />
    </>
  );
};

export default Home;
