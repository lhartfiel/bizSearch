import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { useContext } from "react";
import { ModalContext, ModalDispatchContext } from "../contexts/ModalContext";

const iconClose = <FontAwesomeIcon icon={faClose} className="text-h2" />;

const Modal = () => {
  const modal = useContext(ModalContext);
  const dispatch = useContext(ModalDispatchContext);
  return (
    <div className="absolute left-0 right-0 top-0 bottom-0 bg-black/70 z-10">
      <span className="flex justify-center lg:mx-auto lg:max-w-7xl xxl:max-w-[1440px] h-full w-full px-6 py-8 ">
        <span className="grid grid-cols-12 items-center">
          <span className="flex flex-wrap relative items-center h-auto col-start-1 col-span-12 col-start-1 col-span-12 sm:col-span-6 sm:col-start-1 md:col-span-4 md:col-start-3 lg:col-span-4 lg:col-start-5 bg-white/90 rounded-md px-6 py-8 shadow-card">
            <button
              role="button"
              onClick={dispatch ? () => dispatch(modal) : undefined}
              className="absolute right-5 top-5 cursor-pointer"
            >
              {iconClose}
            </button>
            <h1 className="block text-h2 font-semibold text-center w-full">
              What is "Scout it out?"
            </h1>
            <p>
              Scout it out is a business search application. It combines results
              from Google and Foursquare to give you a quick way to find
              businesses based on geographic location.
            </p>
          </span>
        </span>
      </span>
    </div>
  );
};

export { Modal };
