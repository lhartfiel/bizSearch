import { useContext, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { ModalContext, ModalDispatchContext } from "../contexts/ModalContext";
import { FocusTrap } from "focus-trap-react";

const iconClose = (
  <FontAwesomeIcon icon={faClose} className="text-[28px] text-salmon" />
);

const Modal = ({ showModal }: { showModal: boolean }) => {
  const modal = useContext(ModalContext);
  const dispatch = useContext(ModalDispatchContext);

  return (
    <div
      className={`${showModal ? "z-40 opacity-100 scale-100" : "-z-1 opacity-0 scale-0"} transition-all transition-discrete ease-out duration-500 absolute mx-auto left-0 right-0 bottom-0 top-0 bg-gray-900/95 overflow-hidden`}
    >
      <span className="flex justify-center lg:mx-auto lg:max-w-7xl xxl:max-w-[1440px] h-full w-full px-6 py-8 ">
        <span className="grid grid-cols-12 items-center">
          <FocusTrap
            active={showModal}
            focusTrapOptions={{
              escapeDeactivates: false,
              clickOutsideDeactivates: false,
            }}
          >
            <span
              id="modal-dialog"
              className={`${showModal ? "opacity-100 scale-100 translate-y-0" : "opacity-95 scale-0 translate-y-2"} transition-all transition-discrete delay-50 transform duration-600 ease-in-out flex flex-wrap relative items-center col-start-1 col-span-12 col-start-1 col-span-12 sm:col-span-8 sm:col-start-3 md:col-span-6 md:col-start-4 lg:col-span-4 lg:col-start-5 bg-white/90 rounded-md shadow-card  px-6 py-8`}
            >
              <button
                className="absolute right-5 top-5 cursor-pointer"
                onClick={dispatch ? () => dispatch(modal) : undefined}
                role="button"
                tabIndex={0}
              >
                {iconClose}
              </button>
              <h1 className="block border-b-1 border-gray-300 mb-4 pb-4 text-h2 font-semibold text-center w-full">
                What is "Scout it out?"
              </h1>
              <p className="mb-4">
                Scout it out is a business search application. It combines
                results from Google and Foursquare to give you a quick way to
                search for businesses (coffee shops, gyms, restaurants, etc.)
                based on a specific geographic location. Please note that
                ratings are only provided for Google results.
              </p>
              <p>
                For additional info about a place, click on the web link
                provided. Enjoy!
              </p>
            </span>
          </FocusTrap>
        </span>
      </span>
    </div>
  );
};

export { Modal };
