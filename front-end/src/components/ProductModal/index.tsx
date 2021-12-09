import Modal from "@components/Modal";

const ProductModal = ({ product, ...modalProps }: ProductModalProps) => {
  return (
    <Modal className="product-modal" {...modalProps}>
      <div className="product-modal__details">
        Product Modal Product Modal Product Modal Product Modal Product Modal
        Product Modal Product Modal Product Modal Product Modal Product Modal
        Product Modal Product Modal
      </div>
    </Modal>
  );
};

export default ProductModal;
