import React, { useMemo, useState, useEffect } from "react";
import { storage } from "../../../firebase";
import { useHtmlClassService } from "../../layout";
import { Row, Modal, ModalBody, Button } from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import { Input } from "@material-ui/core";
import Swal from "sweetalert2";

export function CreateSub({ show, onClose, setSubs }) {

    const [subName, setSubName] = useState(null);


    const handleSubName = (e) => {
        setSubName(e.target.value);
    }

    const onAlbumCreate = () => {

        if (subName !== null && subName !== undefined && subName !== "") {
            let blob = new Blob(["<html>…</html>"], { type: 'image/jpeg' });

            var ref = storage.ref(`meditation/${subName}/fakeBlob`).put(blob);

            console.log(blob);


            ref.on(
                "state_changed",
                snapshot => { },
                error => {
                    console.log(error);
                },
                () => {
                    storage.ref(`meditation/${subName}`)
                        .child("fakeBlob")
                        .getDownloadURL()
                        .then(url => {
                            console.log(url, "fakeBlob");
                            onClose();
                        }).then(obj => {
                            let temp = [];
                            storage.ref("meditation").listAll().then(list => {
                                console.log(list);
                                list.prefixes.map(e => {
                                    console.log(e.name);
                                    temp.push(e.name)
                                })
                                setSubs(temp);
                            })
                        }
                        ).catch(err => {
                            console.log(err);
                        })
                })
        } else {
            Swal.fire({
                icon: "warning",
                text:
                  "Lütfen alanları doldurunuz!!!",
                showConfirmButton: false,
                timer: 1500,
              }) 
        }
        console.log(subName);

    }

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Albüm Oluşturun</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <label>Sub Klasöre İsim Verin :</label>
                <Input type="text" onChange={handleSubName} />
            </Modal.Body>
            <Modal.Footer>
                <Button variant="primary" onClick={onAlbumCreate}>
                    Oluştur
                </Button>
                <Button variant="secondary" onClick={onClose}>
                    close
                </Button>
            </Modal.Footer>
        </Modal>
    )
} 