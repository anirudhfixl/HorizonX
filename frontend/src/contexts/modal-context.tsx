import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type ModalType =
  | "CONNECT_WALLET"
  | "WALLET_DETAILS"
  | "COMMAND_PALETTE"
  | "RISK_WARNING"
  | "QUICK_CREATE";

export interface ModalContextType {
  activeModal: ModalType | null;
  modalProps: Record<string, unknown>;
  openModal: (type: ModalType, props?: Record<string, unknown>) => void;
  closeModal: () => void;
  isOpen: (type: ModalType) => boolean;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalType | null>(null);
  const [modalProps, setModalProps] = useState<Record<string, unknown>>({});

  const openModal = useCallback((type: ModalType, props: Record<string, unknown> = {}) => {
    setActiveModal(type);
    setModalProps(props);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalProps({});
  }, []);

  const isOpen = useCallback(
    (type: ModalType) => activeModal === type,
    [activeModal]
  );

  // Keyboard shortcut: Cmd+K / Ctrl+K opens command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setActiveModal((current) => (current === "COMMAND_PALETTE" ? null : "COMMAND_PALETTE"));
      }
      if (e.key === "Escape" && activeModal) {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModal, closeModal]);

  return (
    <ModalContext.Provider
      value={{
        activeModal,
        modalProps,
        openModal,
        closeModal,
        isOpen,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
}
