import React, { useState } from "react";
import { Document, Page } from "react-pdf/dist/esm/entry.webpack5";

import DemoPDF from "../docs/sample.pdf";

import UploadFiles from "../views/UploadFiles";
import TagFiles from "../views/TagFiles";

// mobx
import { toJS } from "mobx";
import { files } from "../mobx/files";
import { observer } from "mobx-react";

const Home = () => {
  const [step, setStep] = useState(0);

  const ChangeStep = (step) => {
    setStep(step);
  };

  return (
    <>
      {step == 0 && <UploadFiles ChangeStep={ChangeStep} />}
      {step == 1 && <TagFiles ChangeStep={ChangeStep} />}
    </>
  );
};
export default Home;
