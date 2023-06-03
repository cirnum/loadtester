import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalProps,
} from "@chakra-ui/react";
import { ReactNode } from "react";

interface CustomModalProps extends ModalProps {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
}
export default function CustomModal({
  children,
  isOpen,
  onClose,
  ...rest
}: CustomModalProps) {
  return (
    <Modal
      isCentered
      onClose={onClose}
      motionPreset="slideInBottom"
      size="3xl"
      {...rest}
      isOpen={isOpen}
    >
      <ModalOverlay />
      <ModalContent minHeight="700px" bg="white">
        {children}
      </ModalContent>
    </Modal>
  );
}

function Body({ children }: { children: ReactNode }) {
  return <ModalBody>{children}</ModalBody>;
}
function Footer({ children }: { children: ReactNode }) {
  return <ModalFooter gap={3}>{children}</ModalFooter>;
}

function Header({ children }: { children: ReactNode }) {
  return <ModalHeader>{children}</ModalHeader>;
}

CustomModal.Footer = Footer;
CustomModal.Header = Header;
CustomModal.Body = Body;
