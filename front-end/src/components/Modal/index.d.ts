declare interface ModalProps {
  className?: string;
  children: JSX.Element;
  visible?: boolean;
  onClose?: () => void;
}
