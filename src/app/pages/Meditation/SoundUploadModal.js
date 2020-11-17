import React, { useMemo, useState, useEffect } from "react";
import { storage, firestore } from "../../../firebase/index";
import { v4 as uuidv4 } from 'uuid';
import { Modal } from "react-bootstrap";
import { Button } from "@material-ui/core"
import ModalHeader from "react-bootstrap/ModalHeader";
import { Input } from "@material-ui/core";
import Swal from "sweetalert2";

export function SoundUploadModal({ show, onClose, setSounds, sounds, uploadControl }) {

    const [soundName, setSoundName] = useState(null);


    const handleSoundName = (e) => {
        setSoundName(e.target.value);
    }

    const handleSoundChange = (e) => {
        if(soundName !== null && soundName !== undefined){
            let key = uuidv4();
        let tempSounds = sounds;
        let url = URL.createObjectURL(e.target.files[0])
        console.log(e.target.files[0])

        var tempFile = {
            name: soundName,
            displayUrl: url,
            file: e.target.files[0],
            deleted: false,
            key: key,
        }

        tempSounds.push(tempFile);
        setSounds(tempSounds);

        console.log(sounds);
        uploadControl();
        onClose();

        }else{
            Swal.fire({
                icon: "warning",
                text:
                    "Lütfen Müziğe İsim Veriniz",
                showConfirmButton: false,
                timer: 1500,
            })
        }
        
    }

    /*const onAlbumCreate = () => {

        if (subName !== null && subName !== undefined && subName !== "") {
            let blob = new Blob(["<html>…</html>"], { type: 'image/jpeg' });

            var ref = storage.ref(`meditation/${subName}/fakeBlob`).put(blob);


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
                                list.prefixes.map(e => {
                                    temp.push(e.name)
                                })
                                setSubs(temp);
                            })
                        }).then(obj => {
                            firestore.settings({
                                timestampsInSnapshots: true
                            });
                            firestore.collection("meditationCategories").add({
                                id: uuidv4(),
                                name: subName
                            }).then(res => {
                                console.log(res, "responseeeeeee");
                            })
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

    }*/

    return (
        <Modal show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Müzik Yükleyin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <label>Müziğe İsim Verin :</label>
                <Input type="text" onChange={handleSoundName} />
            </Modal.Body>
            <Modal.Footer>
                <label htmlFor="sound-upload">
                    <input style={{ display: "none" }} id="sound-upload" type="file" accept="audio/mpeg" onChange={handleSoundChange} onClick={e => (e.target.value = null)} />

                    <Button color="secondary" variant="contained" component="span">Müzik Seçin</Button>
                </label>
                <Button color="primary" onClick={onClose}>
                    close
                </Button>
            </Modal.Footer>
        </Modal>
    )
} 