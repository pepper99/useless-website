import { useState } from "react";

function Modal({
  condition,
  initial,
  title,
  children,
  showCloseBtn,
  closeBtnMsg,
}) {
  const [showModal, setShowModal] = useState(initial);

  return (
    <>
      {condition && showModal && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black opacity-25"
            onClick={() => setShowModal(false)}
          ></div>
          <div className="fixed z-50 my-6 mx-auto w-64 max-w-3xl">
            {/*content*/}
            <div className="relative flex h-fit w-full flex-col rounded-lg border-0 bg-white shadow-lg outline-none focus:outline-none dark:bg-zinc-800">
              {/*header*/}
              <div className="border-blueGray-200 flex items-center justify-between rounded-t border-b border-solid px-4 py-2">
                <h3 className="text-2xl font-semibold dark:text-white">
                  {title}
                </h3>
                <button
                  className="float-right ml-auto border-0 bg-transparent text-3xl font-semibold leading-none text-black opacity-60 outline-none focus:outline-none dark:text-white"
                  onClick={() => setShowModal(false)}
                >
                  <span className="block h-6 w-6 bg-transparent text-lg opacity-60 outline-none focus:outline-none">
                    X
                  </span>
                </button>
              </div>
              {/*body*/}
              {children}
              {/*footer*/}
              {showCloseBtn && (
                <div className="border-blueGray-200 flex items-center justify-end rounded-b border-t border-solid p-6">
                  <button
                    className="background-transparent mr-1 mb-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                    type="button"
                    onClick={() => setShowModal(false)}
                  >
                    {closeBtnMsg}
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Modal;
