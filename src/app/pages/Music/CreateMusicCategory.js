import React, { useMemo, useState, useEffect } from "react";
import { storage, firestore } from "../../../firebase/index";
import { v4 as uuidv4 } from 'uuid';
import { Modal, Button } from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import { Input } from "@material-ui/core";
import Swal from "sweetalert2";

export function CreateMusicCategory({ show, onClose, setSubs }) {

    const [subName, setSubName] = useState(null);


    const handleSubName = (e) => {
        setSubName(e.target.value);
    }

    const onAlbumCreate = () => {
        let id = uuidv4();

        if (subName !== null && subName !== undefined && subName !== "") {
            let blob = new Blob(["<html>…</html>"], { type: 'image/jpeg' });



            var ref = storage.ref(`music/${id}/fakeBlob`).put(blob);


            ref.on(
                "state_changed",
                snapshot => { },
                error => {
                    console.log(error);
                },
                () => {
                    storage.ref(`music/${id}`)
                        .child("fakeBlob")
                        .getDownloadURL()
                        .then(url => {
                            console.log(url, "fakeBlob");
                            onClose();
                        }).then(obj => {
                            firestore.collection("musicCategories").add({
                                id: id,
                                name: subName
                            }).then(res => {
                                res.get().then(querySnapshots=>{
                                    console.log(querySnapshots.data())
                                })
                                firestore.collection("musicCategories").get().then(querySnapshots => {

                                    let temp = [];
                                    querySnapshots.docs.map(doc => {
                                        if (doc.data().blob) {
                                        } else {
                                            temp.push(doc.data())
                                        }
                                    })
                                    setSubs(temp)
                                })
                            })
                        })
                })
        } else {
            Swal.fire({
                icon: "warning",
                text:
                    "Lütfen tüm alanları doldurunuz!!!",
                showConfirmButton: false,
                timer: 1500,
            })
        }

    }

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Albüm Oluşturun</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <label>Kategoriye İsim Verin :</label>
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