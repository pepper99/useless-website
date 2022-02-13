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
            className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none transition-all"
            onClick={() => setShowModal(false)}
          >
            <div className="relative my-6 mx-auto max-w-3xl w-64">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full h-fit bg-white dark:bg-zinc-800 outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-center justify-between px-4 py-2 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="dark:text-white text-2xl font-semibold">
                    {title}
                  </h3>
                  <button
                    className="ml-auto bg-transparent border-0 text-black dark:text-white opacity-60 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="bg-transparent opacity-60 h-6 w-6 text-lg block outline-none focus:outline-none">
                      X
                    </span>
                  </button>
                </div>
                {/*body*/}
                {children}
                {/*footer*/}
                {showCloseBtn && (
                  <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b">
                    <button
                      className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                      type="button"
                      onClick={() => setShowModal(false)}
                    >
                      {closeBtnMsg}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      )}
    </>
  );
}

export default Modal;
