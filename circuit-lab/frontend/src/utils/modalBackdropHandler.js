/**
 * Modal Backdrop Click & Event StopPropagation Utility
 */
export function handleBackdropClick(e, onClose) {
  if (e.target === e.currentTarget) {
    onClose();
  }
}
