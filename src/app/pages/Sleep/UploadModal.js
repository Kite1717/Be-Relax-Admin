import React, { useMemo, useState, useEffect } from "react";
import { storage, firestore } from "../../../firebase/index";
import { v4 as uuidv4 } from 'uuid';
import { Modal, Row } from "react-bootstrap";
import ModalHeader from "react-bootstrap/ModalHeader";
import Swal from "sweetalert2";
import { Card, CardHeader, Button, CircularProgress, Input } from "@material-ui/core";
import { CardBody, CardFooter } from "../../../_metronic/_partials/controls";
import moment from "moment"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import bg1 from "./images/screenShot1.png"
import bg2 from "./images/screenShot22.png"
import bg3 from "./images/screenShot33.png"


export function UploadModal({ setIsUploadOk, setIsImageFive, show, onClose, setSounds, sounds, images, setImages, subOption, setAlbums }) {

    const [albumName, setAlbumName] = useState("");
    const [authorName, setAuthorName] = useState("");
    const [description, setDescription] = useState("");
    const [duration, setDuration] = useState(0);
    const [teller, setTeller] = useState("");
    let authorUrl = ""
    let bannerUrl = ""
    let headerUrl = ""
    let modalUrl = ""
    let tellerUrl = ""
    let musics = []
    let musicsLength = 0
    const [albumId, setAlbumId] = useState(uuidv4())
    const [loading, setLoading] = useState(false)
    const [isPremium, setIsPremium] = useState(false)
    const [isChained, setIsChained] = useState(false)
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        centerPadding: "150px"
    }

    const [firestoreObj, setFirestoreObj] = useState(null)

    useEffect(() => {
        setFirestoreObj({
            albumId: albumId,
            author: authorName,
            categoryId: subOption.id,
            desc: description,
            duration: duration,
            name: albumName,
            teller: teller,
            isPremium: isPremium,
            isChained : isChained,

        })

    }, [albumName, authorName, description, duration, teller, isPremium, isChained])

    useEffect(() => {
        let temp = [];
        images.map(image => {
            if (!image.deleted) {
                temp.push(image)

            }
        })
        setImages(temp);
    }, [])

    // URL LERİ USE EFECTTE CONTROL ET AZKHDFASJKLUDFYAWRTAILSFLASIDFGL
    const firestoreUpload = () => {
        let month = moment().month() + "-" + moment().year()
        let firestoreObjTemp = { ...firestoreObj }
        firestoreObjTemp.createdAt = moment().format()
        firestoreObjTemp.images = {};
        firestoreObjTemp.images.author = ""
        firestoreObjTemp.images.banner = ""
        firestoreObjTemp.images.header = ""
        firestoreObjTemp.images.modal = ""
        firestoreObjTemp.images.teller = ""

        console.log(firestoreObj, "yükelemeden önce")
        console.log(authorUrl)
        console.log(bannerUrl)
        console.log(authorUrl)
        console.log(headerUrl)
        console.log(modalUrl)
        firestoreObjTemp.images.author = authorUrl
        firestoreObjTemp.images.banner = bannerUrl
        firestoreObjTemp.images.header = headerUrl
        firestoreObjTemp.images.modal = modalUrl
        firestoreObjTemp.images.teller = tellerUrl

        firestoreObjTemp.musics = musics

        console.log(firestoreObjTemp, "yükelemden önce temp")

        firestore.collection("sleepAlbums").add((firestoreObjTemp)).then(res => {

            console.log(res, "responseeeeeee");
        }).catch(err => {
            console.log(err);
        })

        firestore.collection("albumListenCount").doc(albumId).set({
            [month] : 0
        })
    }

    const handleUpload = async () => {


        setLoading(true)
        const firestoreObjTemp = { ...firestoreObj }

        firestoreObjTemp.images = {};
        firestoreObjTemp.images.author = "";
        firestoreObjTemp.images.banner = ""
        firestoreObjTemp.images.header = ""
        firestoreObjTemp.images.modal = ""
        firestoreObjTemp.images.teller = ""

        firestoreObjTemp.musics = [];

        if (albumName !== "" && authorName !== "" && description !== "" && duration !== 0 && teller !== "") {
            let temp1 = [...images, ...sounds]
            let temp = [];
            temp1.forEach((item) => {
                if (!item.deleted) {
                    temp.push(item)
                }

            })
            console.log(temp.length)
            musicsLength = temp.length - 5
            for(let i=0 ; i<musicsLength;i++){
                musics[i] = -1
            }
            let fileIndex = 0;
            let promises = [];
            temp.map((obj,index) => {
                let fileName = "";
                var fileType = "";
                if (obj.file.type.split("/")[0] === "audio") {
                    fileType = "sounds"
                } else if (obj.file.type.split("/")[0] === "image") {
                    fileType = "images"
                }

                if (fileIndex === 0) {
                    fileName = "Author"
                } else if (fileIndex === 1) {
                    fileName = "Banner"
                } else if (fileIndex === 2) {
                    fileName = "Header"
                } else if (fileIndex === 3) {
                    fileName = "Modal"
                } else if (fileIndex === 4) {
                    fileName = "Teller"
                } else {
                    fileName = obj.name;
                }

                var folder = "";
                folder = "sleep" + "/" + subOption.id + "/" + albumId + "/" + fileType;


                const uploadTask = storage.ref(`${folder}/${fileName}`).put(obj.file)
                promises.push(uploadTask);
                uploadTask.on(
                    "state_changed",
                    snapshot => { },
                    error => { },
                    async () => {
                        await storage.ref(folder).child(fileName).getDownloadURL().then(url => {
                            console.log(authorUrl, bannerUrl, headerUrl, modalUrl, tellerUrl, musics)
                            console.log(url)
                            if (fileName === "Author") {
                                authorUrl = url
                            } else if (fileName === "Banner") {
                                bannerUrl = url
                            } else if (fileName === "Header") {
                                headerUrl = url
                            } else if (fileName === "Modal") {
                                modalUrl = url
                            } else if (fileName === "Teller") {
                                tellerUrl = url
                            } else {
                                musics[index - 5] = { name: fileName, url: url }
                            }
                        }).then(() => {
                            console.log(musicsLength)
                            console.log(musics.length)
                            if (authorUrl !== "" && bannerUrl !== "" && headerUrl !== "" && tellerUrl !== "" && modalUrl !== "" && musics.indexOf(-1) === -1) {
                                Promise.all(promises)
                                    .then(() => {
                                        firestoreUpload();
                                    }).then(() => {
                                        firestore.collection("sleepAlbums").get().then(queryParams => {
                                            let temp = [];
                                            queryParams.docs.map(doc => {
                                                if (doc.data().categoryId === subOption.id) {
                                                    temp.push(doc.data())
                                                }
                                            })
                                            onClose()
                                            setLoading(false)
                                            setIsImageFive(true)
                                            setAlbums(temp)
                                            setSounds([])
                                            setImages([])
                                            setIsUploadOk(false)
                                        })
                                    })
                                    .catch(err => console.log(err.code));
                            }
                        })
                    })
                fileIndex++;
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
        <Modal size="xl" show={show} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Albüm Yükleyin</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row style={{ display: "flex", justifyContent: "space-between" }}>
                    <Card style={{ flex: "0.4" }}>
                        <CardHeader title="Albüm Bilgileri" />
                        <CardBody>
                            <label>Albüme İsim Verin : <Input type="text" onChange={(e) => {
                                setAlbumName(e.target.value)
                                console.log(albumName)
                                console.log(subOption)
                                console.log([...images, ...sounds]);
                            }} /> </label>
                            <br />
                            <label>Yazarın İsmini Girin : <Input type="text" onChange={(e) => {
                                setAuthorName(e.target.value)
                                console.log(authorName)
                            }} /></label>
                            <br />
                            <label>Anlatıcı İsmini Girin : <Input type="text" onChange={(e) => {
                                setTeller(e.target.value)
                                console.log(teller)
                            }} /></label>
                            <br />
                            <label>Toplam Süreyi Girin : <Input type="number" onChange={(e) => {
                                setDuration(e.target.value)
                                console.log(duration)
                            }} /></label>
                            <br />
                            <label style={{ marginRight: "12px" }}>Premium Albüm ise İşaretleyin</label>
                            <input type="checkbox" name="premium-checkbox" checked={isPremium} onChange={(e) => {
                                setIsPremium(e.target.checked)
                                console.log(e.target.checked)
                            }} />
                            <br />
                            <label style={{ marginRight: "12px" }}>Zincirleme Albüm İse İşaretleyin</label>
                            <input type="checkbox" name="premium-checkbox" checked={isChained} onChange={(e) => {
                                setIsChained(e.target.checked)
                                console.log(e.target.checked)
                            }} />
                            <br />
                            <label>Açıklama Ekleyin : </label>
                            <br />
                            <textarea type="text-area" style={{ width: "370px", height: "300px" }} onChange={(e) => {
                                setDescription(e.target.value)
                                console.log(description)
                            }} />
                        </CardBody>
                    </Card>
                    <Card style={{ flex: "0.59" }}>
                        <CardHeader title="Canlı Görünüm" />
                        <CardBody>
                            <Slider {...settings} >
                                <div>
                                    <h3 style={{ textAlign: "center" }} >
                                        <label style={{ backgroundImage: "url(" + bg1 + ")", backgroundSize: "356px 732px", width: "356px", height: "732px", marginRight: "3px", alignSelf: "center" }}>
                                            {/*Banner*/}
                                            <img
                                                style={{ width: "294px", height: "196px", marginLeft: "30px", marginTop: "110px", borderRadius: "30px" }}
                                                src={images[1].displayUrl} />
                                            {/*Banner*/}
                                            <img
                                                style={{ width: "40px", height: "40px", marginTop: "280px", marginLeft: "284px", borderRadius: "50%" }}
                                                src={images[1].displayUrl} />

                                        </label>
                                    </h3>
                                </div>
                                <div >
                                    <h3 style={{ textAlign: "center" }} >
                                        <label style={{ backgroundImage: "url(" + images[2].displayUrl + ")", backgroundSize: "325px 175px", width: "325px", marginTop: "18px", height: "175px" }}>

                                            {/*Banner*/}
                                            <img
                                                style={{ width: "356px", height: "732px", marginLeft: "-16px", marginTop: "-17px" }}
                                                src={bg3} />
                                            {/*Banner*/}
                                            <img
                                                style={{ width: "45px", height: "45px", marginTop: "-505px", marginLeft: "14px", borderRadius: "50%" }}
                                                src={images[4].displayUrl} />

                                        </label>
                                    </h3>
                                </div>
                                <div >
                                    <h3 style={{ textAlign: "center" }} >
                                        <label style={{ backgroundImage: "url(" + images[3].displayUrl + ")", backgroundSize: "325px 732px", width: "325px", marginTop: "18px", height: "700px" }}>

                                            {/*Banner*/}
                                            <img
                                                style={{ width: "356px", height: "732px", marginLeft: "-16px", marginTop: "-17px" }}
                                                src={bg2} />
                                            {/*Banner*/}
                                            <img
                                                style={{ width: "57px", height: "57px", marginTop: "-321px", marginLeft: "131px", borderRadius: "50%" }}
                                                src={images[0].displayUrl} />

                                        </label>
                                    </h3>
                                </div>
                            </Slider>
                        </CardBody>
                    </Card>
                </Row>
            </Modal.Body>
            <Modal.Footer>
                {loading &&
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        <CircularProgress color="secondary" style={{ marginTop: "50px" }} />
                    </div>
                }
                <Button onClick={() => handleUpload()} color="secondary" variant="contained" component="span">Albümü Yükleyin</Button>
                <Button color="primary" onClick={onClose}>
                    close
                </Button>
            </Modal.Footer>
        </Modal>
    )
} 