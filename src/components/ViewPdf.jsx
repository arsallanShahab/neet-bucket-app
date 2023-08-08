import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";

const WORKER_PATH =
  process.env.NODE_ENV === "production"
    ? `${process.env.PUBLIC_URL}/pdf.worker.min.js}`
    : "/pdf.worker.min.js";
const ViewPdf = (props) => {
  const { url } = props;
  const [numPages, setNumPages] = useState();
  const [pageNumber, setPageNumber] = useState(1);
  const canvasRef = useRef(null);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleNextPage = () => {
    if (pageNumber < numPages) {
      setPageNumber((prevPage) => prevPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prevPage) => prevPage - 1);
    }
  };

  useEffect(() => {
    // Set the workerSrc using process.env.PUBLIC_URL
    pdfjs.GlobalWorkerOptions.workerSrc = `${WORKER_PATH}`;
  }, []);

  return (
    <div className="flex w-full flex-col overflow-hidden">
      <Document
        file={url}
        onLoadSuccess={onDocumentLoadSuccess}
        className={"relative flex h-auto max-h-[550px] w-full"}
      >
        <Page
          pageNumber={pageNumber}
          className={"w-full overflow-hidden rounded-3xl border object-cover"}
          canvasRef={canvasRef}
          loading={
            <div className="w-full rounded-3xl bg-slate-100 px-10 py-20 text-xl font-semibold">
              Loading...
            </div>
          }
        />
        <div className="absolute bottom-0 flex w-full items-center justify-center gap-3 p-5">
          <button className="rounded-3xl border bg-white p-2 drop-shadow-md">
            <ChevronLeft className="h-5 w-5" onClick={handlePreviousPage} />
          </button>
          <button className="rounded-3xl border bg-white p-2 drop-shadow-md">
            <ChevronRight className="h-5 w-5" onClick={handleNextPage} />
          </button>
        </div>
      </Document>
      {/* <p>
        Page {pageNumber} of {numPages}
      </p> */}
    </div>
  );
};

export default ViewPdf;
