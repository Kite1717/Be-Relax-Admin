import React, { useMemo, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Button } from "@material-ui/core"
import ModalHeader from "react-bootstrap/ModalHeader";

export function AlbumDeleteWarning({ show, onClose, handleAlbumDelete, albumOption }) {
    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Dikkat Albümü Silmek Üzeresiniz</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button color="primary" onClick={() => handleAlbumDelete(albumOption.albumId)}>Evet Onaylıyorum</Button>
                <Button color="primary" onClick={onClose}>
                    close
                </Button>
            </Modal.Footer>
        </Modal>

    )
}