
import React from "react";
import ModalToast from "./ModalToast";
import ModalBindFingerprint from "./ModalBindFingerprint";
import ModalOverrideAttendance from "./ModalOverrideAttendance";
import ModalStudentForm from "./ModalStudentForm";
import ModalParentForm from "./ModalParentForm";


export default function ModalHost({ modal, onClose, onAudit, onMutate }) {
  switch (modal.type) {
    case "toast":
      return <ModalToast modal={modal} onClose={onClose} />;
    case "bindFingerprint":
      return <ModalBindFingerprint modal={modal} onClose={onClose} onAudit={onAudit} onMutate={onMutate} />;
    case "overrideAttendance":
      return <ModalOverrideAttendance modal={modal} onClose={onClose} onAudit={onAudit} onMutate={onMutate} />;
    case "editStudent":
    case "addStudent":
      return <ModalStudentForm modal={modal} onClose={onClose} onAudit={onAudit} onMutate={onMutate} />;
    case "editParent":
      return <ModalParentForm modal={modal} onClose={onClose} onAudit={onAudit} onMutate={onMutate} />;

    default:
      return null;
  }
}


