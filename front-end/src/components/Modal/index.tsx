import Portal from "@components/Portal";
import { MouseEventHandler, useCallback, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import { useGlobalState } from "@contexts/globalStateContext";

import "./styles.scss";

const Modal = ({
  children,
  className,
  visible = false,
  onClose,
}: ModalProps) => {
  const { toggleBodyScroll } = useGlobalState();
  const classNames = [
    "ifind-modal",
    className,
    visible ? "ifind-modal--visible" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const onCloseClick = useCallback<MouseEventHandler>(
    (e) => {
      e.preventDefault();

      if (typeof onClose === "function" && toggleBodyScroll) {
        onClose();
        toggleBodyScroll(true);
      }
    },
    [onClose, toggleBodyScroll]
  );

  useEffect(() => {
    if (toggleBodyScroll) {
      toggleBodyScroll(!visible);
    }
  }, [visible, toggleBodyScroll]);

  return (
    <Portal id="modal-portal">
      <div className={classNames}>
        <div className="ifind-modal__underlay" onClick={onCloseClick}></div>
        <div className="ifind-modal__scrollarea">
          <div className="ifind-modal__dialog">
            <button className="ifind-modal__close" onClick={onCloseClick}>
              <FaTimes />
            </button>
            {children}
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default Modal;
