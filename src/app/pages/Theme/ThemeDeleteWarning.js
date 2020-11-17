import React from "react";
import { Modal } from "react-bootstrap";
import { Button } from "@material-ui/core"

export function ThemeDeleteWarning({ show, onClose, handleThemeDelete, themeOption }) {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Dikkat Temayı Silmek Üzeresiniz</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button color="primary" onClick={() => handleThemeDelete(themeOption)}>Evet Onaylıyorum</Button>
                <Button color="primary" onClick={onClose}>
                    close
                </Button>
            </Modal.Footer>
        </Modal>

    )
}