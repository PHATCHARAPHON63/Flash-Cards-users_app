import Swal from 'sweetalert2';

const show_dialog = async ({ title, text, icon, confirmButtonText }) => {
  return Swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
    didOpen: () => {
      const confirmButton = Swal.getConfirmButton();
      if (confirmButton) {
        confirmButton.style.backgroundColor = '#65C4B6';
        confirmButton.style.color = 'white';
      }
    }
  });
};

export { show_dialog };
