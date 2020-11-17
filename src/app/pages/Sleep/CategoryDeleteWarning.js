import React, { useMemo, useState, useEffect } from "react";
import { Modal } from "react-bootstrap";
import { Button } from "@material-ui/core"
import ModalHeader from "react-bootstrap/ModalHeader";

export function CategoryDeleteWarning({ show, onClose, handleSubDelete }) {

    const [count,setCount] = useState(3)

    const deleteCount = () => {
        if(count > 0){
            setCount(count-1)
        }else{
            handleSubDelete();
            onClose();
        }
    }

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Dikkat Kategoriyi ve İçinde Bulunan Bütün Albümleri Silmek Üzeresiniz</Modal.Title>
            </Modal.Header>
            <Modal.Footer>
                <Button color="primary" onClick={deleteCount}>Evet Onaylıyorum({count})</Button>
                <Button color="primary" onClick={onClose}>
                    close
                </Button>
            </Modal.Footer>
        </Modal>

    )
}