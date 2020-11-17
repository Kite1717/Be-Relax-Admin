import React, { useMemo, useState, useEffect } from "react";
import "./style.css"
import { storage, firestore } from "../../../firebase";
import objectPath from "object-path";
import { useHtmlClassService } from "../../../_metronic/layout";
import { Card, CardHeader, Select, Button, CircularProgress, Input } from "@material-ui/core";
import { CardBody, CardFooter } from "../../../_metronic/_partials/controls";
import { Row } from "react-bootstrap";
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from "../../../_metronic/_helpers";
import { v4 as uuidv4 } from 'uuid';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import Marquee from "react-double-marquee";
import { CreateSub } from "./CreateSub"
import Swal from "sweetalert2"
import { SoundUploadModal } from "./SoundUploadModal"
import { UploadModal } from "./UploadModal"
import { AlbumDeleteWarning } from "./AlbumDeleteWarning"
import { CategoryDeleteWarning } from "./CategoryDeleteWarning"



export function Meditation() {
    const uiService = useHtmlClassService();
    const layoutProps = useMemo(() => {
        return {
            demo: objectPath.get(
                uiService.config,
                "demo"
            )
        };
    }, [uiService]);

    const [display, setDisplay] = useState(null);
    const [subOption, setSubOption] = useState(null);
    const [albumOption, setAlbumOption] = useState(null);
    const [albums, setAlbums] = useState(null);
    const [subs, setSubs] = useState(null);
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadOk, setIsUploadOk] = useState(false);
    const [images, setImages] = useState([]);
    const [sounds, setSounds] = useState([]);
    const [isImageFive, setIsImageFive] = useState(true);
    const [showSubCreate, setShowSubCreate] = useState(false);
    const [showSoundUpload, setShowSoundUpload] = useState(false);
    const [showUpload, setShowUpload] = useState(null);
    const [showAlbumDelete, setShowAlbumDelete] = useState(false)
    const [showSubDelete, setShowSubDelete] = useState(false)

    useEffect(() => {
        let temp = [];
        firestore.collection("meditationCategories").get().then(querySnapshots => {
            querySnapshots.docs.map(doc => {
                if (doc.data().blob) {
                    console.log(doc.data().blob)
                } else {
                    let obj = {};
                    obj = doc.data();
                    temp.push(obj);
                    console.log(doc.data());
                }
            })
        }).then(e => {
            setSubs(temp)
        });

    }, [])

    useEffect(() => {
        uploadControl();
    }, [subOption])

    const onSoundUpload = () => {
        setShowSoundUpload(!showSoundUpload);
    }

    const handleShowUpload = () => {
        setShowUpload(!showUpload)
    }

    const uploadControl = () => {

        let tempImages = []
        let tempSounds = []
        images.forEach((item) => {
            if (!item.deleted) {
                tempImages.push(item)
            }

        })
        sounds.forEach((item) => {
            if (!item.deleted) {
                tempSounds.push(item)
            }

        })
        let imageCount = tempImages.length;
        let soundCount = tempSounds.length;


        if (imageCount === 5) {
            setIsImageFive(false);
        } else {
            setIsImageFive(true);
        }

        if (imageCount === 5 && soundCount > 0 && subOption !== null) {
            setIsUploadOk(true);
        } else {
            setIsUploadOk(false);
        }

    }

    const handleSoundChange = e => {
        let key = uuidv4();
        let tempSounds = sounds;
        let url = URL.createObjectURL(e.target.files[0])
        console.log(e.target.files[0])

        var tempFile = {
            displayUrl: url,
            file: e.target.files[0],
            deleted: false,
            key: key,
        }

        tempSounds.push(tempFile);
        setSounds(tempSounds);


        if (e.target.files[0]) {
            setDisplay(url)
        }
        uploadControl();
    }

    const handleImageChange = e => {

        let key = uuidv4();
        let tempImages = images;
        let url = URL.createObjectURL(e.target.files[0])

        var tempFile = {
            displayUrl: url,
            file: e.target.files[0],
            deleted: false,
            key: key,
        }

        tempImages.push(tempFile);
        setImages(tempImages);


        if (e.target.files[0]) {
            setDisplay(url)
        }


        uploadControl();

    }

    const onSubChange = e => {

        let sub = e.target.value;

        setSubOption(sub);
        uploadControl();
        let temp = [];
        firestore.collection("meditationAlbums").get().then(querySnapshots => {
            querySnapshots.docs.map(doc => {
                if (doc.data().blob) {
                    console.log(doc.data().blob)
                } else {
                    let obj = {};
                    obj = doc.data();
                    if (obj.categoryId === sub.id) {
                        temp.push(obj);
                        console.log(doc.data());
                    }
                }

            })
        }).then(e => {
            setAlbums(temp)
        });
    }

    const onImageDeleteClicked = (ind) => {
        let temp = [...images];
        temp.forEach((item, index) => {


            if (ind === index) {

                temp[index].deleted = true;
            }
        })
        setImages(temp);
        uploadControl();
    }

    const onSoundDeleteClicked = (ind) => {

        let temp = [...sounds]
        temp.forEach((item, index) => {


            if (ind === index) {

                temp[index].deleted = true;
            }
        })
        setSounds(temp)
        uploadControl();
    }

    const onAlbumChange = e => {
        let album = e.target.value;
        setAlbumOption(album);
    }

    const handleAlbumDelete = (albumOption) => {
        setIsLoading(true);

        firestore.collection("meditationAlbums").where("albumId", "==", albumOption).get().then(querySnapshots => {
            querySnapshots.docs[0].ref.delete();
        })

        let folder1 = "";
        let folder2 = "";
        let folder3 = "";
        let folder4 = "";

        folder1 = "meditation" + "/" + subOption.id + "/" + albumOption + "/" + "images"
        folder2 = "meditation" + "/" + subOption.id + "/" + albumOption + "/" + "sounds"
        folder3 = "meditation" + "/" + subOption.id + "/" + albumOption
        folder4 = "meditation" + "/" + subOption.id


        var deleteRef1 = storage.ref(folder1)
        deleteRef1.listAll().then(list => {
            setIsLoading(true);
            list.items.map(e => {
                let ref = storage.ref(e.location.path_)
                ref.delete().then(e => {
                    let temp = [];
                    firestore.collection("meditationAlbums").get().then(querySnapshots => {
                        querySnapshots.docs.map(doc => {
                            if (doc.data().blob) {
                            } else {
                                if (doc.data().categoryId === subOption.id) {
                                    temp.push(doc.data())
                                }
                            }
                        })
                    }).then(() => {
                        setAlbums(temp);
                        setAlbumOption(null);
                        setIsLoading(false);
                        setShowAlbumDelete(false)
                    })

                })
            })
        })

        var deleteRef2 = storage.ref(folder2)
        deleteRef2.listAll().then(list => {
            setIsLoading(true);
            list.items.map(e => {
                let ref = storage.ref(e.location.path_)
                ref.delete().then(e => {
                    let temp = [];
                    firestore.collection("meditationAlbums").get().then(querySnapshots => {
                        querySnapshots.docs.map(doc => {
                            if (doc.data().blob) {
                            } else {
                                if (doc.data().categoryId === subOption.id) {
                                    temp.push(doc.data())
                                }
                            }
                        })
                    }).then(() => {
                        setAlbums(temp);
                        setAlbumOption(null);
                        setIsLoading(false);
                        setShowAlbumDelete(false)
                    })
                })
            })
        })

        var deleteRef3 = storage.ref(folder3)
        deleteRef3.listAll().then(list => {
            setIsLoading(true);
            list.items.map(e => {
                let ref = storage.ref(e.location.path_)
                ref.delete().then(e => {
                    let temp = [];
                    firestore.collection("meditationAlbums").get().then(querySnapshots => {
                        querySnapshots.docs.map(doc => {
                            if (doc.data().blob) {
                            } else {
                                if (doc.data().categoryId === subOption.id) {
                                    temp.push(doc.data())
                                }
                            }
                        })
                    }).then(() => {
                        setAlbums(temp);
                        setAlbumOption(null);
                        setIsLoading(false);
                        setShowAlbumDelete(false)
                    })
                })

            })
        })

    }

    const onSubCreate = () => {
        setShowSubCreate(!showSubCreate);
    }

    const handleSubDelete = () => {
        let deleteRef1 = storage.ref(`meditation/${subOption.id}`)

        storage.ref(`meditation/${subOption.id}`).listAll().then(list => {
            setIsLoading(true);
            list.prefixes.map(e => {
                handleAlbumDelete(e.name)
            })
        }).then(obj => {
            deleteRef1.listAll().then(list => {
                list.items.map(e => {
                    let ref = storage.ref(e.location.path_)
                    ref.delete().then(obj => {
                        let temp = [];
                        storage.ref("meditation").listAll().then(list => {
                            list.prefixes.map(e => {
                                temp.push(e.name)
                            })
                        }).then(obj => {
                            firestore.collection("meditationCategories").where("id", "==", subOption.id).get().then(querySnapshots => {
                                querySnapshots.docs[0].ref.delete();
                            }).then(res => {
                                console.log(res, "responseeeeeee");
                            })
                        }).then(obj => {
                            setSubs(temp)
                            setSubOption(null)
                            setIsLoading(false)
                        })
                    })
                })
            })
        })

    }

    const handleShowAlbumDelete = () => {
        setShowAlbumDelete(!showAlbumDelete)
    }

    const handleShowSubDelete = () => {
        setShowSubDelete(!showSubDelete)
    }

    return (
        <>
            <Card>
                <CardHeader style={{ justifyContent: "center" }} title="Meditasyon">
                </CardHeader>
            </Card>
            <br />
            <Row style={{ display: "flex", justifyContent: "space-between" }} >

                <Card className="mr-auto" style={{ flex: "0.4" }}>
                    <CardHeader title="Albüm Seçin">

                    </CardHeader>
                    <CardBody>
                        <label> Kategoriler : </label>
                        <Select id="sub" onChange={onSubChange} style={{ width: "250px" }} required={true} >
                            {
                                subs !== null &&
                                subs !== undefined &&
                                subs.map((e, index) => {
                                    return <option key={index} id={e.id} obj={e} value={e}>{e.name}</option>
                                })
                            }
                        </Select>
                        <span className="svg-icon" style={{ alignSelf: "center", cursor: "pointer"}} onClick={onSubCreate}>
                            <SVG style={{ height: "20px", width: "20px"}}
                                src={toAbsoluteUrl("/media/svg/icons/Navigation/Plus.svg")}
                            />
                        </span>
                        

                        <br />
                        <br />
                        {
                            subOption !== null &&
                            subOption !== undefined &&
                            <>
                                <label> Albümler : </label>
                                <Select id="albums" onChange={onAlbumChange} style={{ width: "250px" }} required={true}>
                                    {
                                        albums !== null &&
                                        albums !== undefined &&
                                        albums.map((e, index) => {
                                            return <option key={index} id={index} value={e}>{e.name}</option>
                                        })
                                    }
                                </Select>
                            </>
                        }
                            <br/>
                            <br/>
                        {
                            albumOption ?
                                <Button onClick={handleShowAlbumDelete} style={{ background: "red" }} variant="contained" component="span" className="mr-2"> Albümü Sil </Button>
                                :
                                <Button disabled color="primary" variant="contained" component="span" className="mr-2"> Albümü Sil </Button>
                        }
                        {
                            subOption !== null &&
                                subOption !== undefined ?
                                <Button onClick={handleShowSubDelete} style={{ background: "red" }} variant="contained" component="span" className="mr-2"> Kategoriyi Sil </Button>
                                :
                                <Button disabled color="primary" variant="contained" component="span" className="mr-2"> Kategoriyi Sil </Button>
                        }
                        <br />
                        {
                            isLoading &&
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <CircularProgress color="secondary" style={{ marginTop: "50px" }} />
                            </div>
                        }
                    </CardBody>
                </Card>
                <div style={{ flex: "0.59" }}>
                    <Card>
                        <CardHeader title="Fotoğraf Yükleyin" />
                        <CardBody>
                            <br />
                            <Row style={{ display: "flex", justifyContent: "space-between" }}>
                                <h4 style={{ flex: "0.2", textAlign: "center" }}>Author</h4>
                                <h4 style={{ flex: "0.2", textAlign: "center" }}>Banner</h4>
                                <h4 style={{ flex: "0.2", textAlign: "center" }}>Header</h4>
                                <h4 style={{ flex: "0.2", textAlign: "center" }}>Modal</h4>
                                <h4 style={{ flex: "0.2", textAlign: "center" }}>Teller</h4>
                            </Row>
                            <Row>
                                {
                                    images !== null &&
                                    images !== undefined &&
                                    images.map((image, index) => {
                                        if (!image.deleted) {
                                            return (
                                                <div className="col-md-5-cols" >
                                                    <img src={image.displayUrl} key={image.key} style={{ height: "122px", width: "100%", borderStyle: "none" }} />
                                                    <br />
                                                    <Button key={index} onClick={() => onImageDeleteClicked(index)} >Delete</Button>
                                                </div>
                                            )
                                        }

                                    })

                                }
                                {
                                    isImageFive &&

                                    <label htmlFor="image-upload" className="col-md-5-cols" style={{ borderStyle: "dotted", height: "122px", cursor: "pointer", display: "flex", justifyContent: "center" }}>
                                        <span className="svg-icon" style={{ alignSelf: "center" }}>
                                            <SVG style={{ height: "50px", width: "50px" }}
                                                src={toAbsoluteUrl("/media/svg/icons/Navigation/Plus.svg")}
                                            />
                                        </span>
                                        <input style={{ display: "none" }} id="image-upload" type="file" accept="image/*" onChange={handleImageChange} onClick={e => (e.target.value = null)} />
                                    </label>
                                }

                            </Row>

                        </CardBody>
                    </Card>
                    <Card>
                        <CardHeader title="Müzik Yükleyin" />
                        <CardBody>
                            <Row>
                                {
                                    sounds !== null &&
                                    sounds !== undefined &&
                                    sounds.map((sound, index) => {
                                        if (!sound.deleted) {
                                            return (
                                                <div>
                                                    <label style={{ borderStyle: "solid", height: "100px", width: "100px", display: "flex", justifyContent: "center", marginRight: "5px" }}>
                                                        <LibraryMusicIcon style={{ alignSelf: "center" }} />

                                                    </label>
                                                    <div style={{
                                                        width: '100px',
                                                        whiteSpace: 'nowrap',
                                                    }}>
                                                        <Marquee
                                                            direction="left"
                                                        >
                                                            {sound.name}
                                                        </Marquee>
                                                    </div>


                                                    <br />
                                                    <Button key={index} onClick={() => onSoundDeleteClicked(index)} >Delete</Button>
                                                </div>
                                            )
                                        }

                                    })

                                }
                                <label htmlFor="soundUploadButton" style={{ borderStyle: "dotted", height: "100px", width: "100px", cursor: "pointer", display: "flex", justifyContent: "center", marginRight: "5px" }}>
                                    <span className="svg-icon" style={{ alignSelf: "center" }}>
                                        <SVG style={{ height: "50px", width: "50px" }}
                                            src={toAbsoluteUrl("/media/svg/icons/Navigation/Plus.svg")}
                                        />
                                    </span>
                                    <button style={{ display: "none" }} onClick={onSoundUpload} id="soundUploadButton"></button>
                                </label>
                            </Row>
                        </CardBody>
                        <CardFooter>
                            {
                                isUploadOk ?
                                    <Button onClick={handleShowUpload} color="secondary" variant="contained" component="span" className="mr-2"> Upload </Button>
                                    :
                                    <Button disabled color="secondary" variant="contained" component="span" className="mr-2"> Upload </Button>
                            }
                        </CardFooter>

                    </Card>
                </div>
            </Row>
            {
                showUpload &&
                <UploadModal setIsImageFive={setIsImageFive} show={showUpload} onClose={handleShowUpload} setSounds={setSounds} sounds={sounds} images={images} setImages={setImages} subOption={subOption} setAlbums={setAlbums} setIsUploadOk={setIsUploadOk} />
            }


            {
                showSubCreate &&
                <CreateSub show={showSubCreate} onClose={onSubCreate} setSubs={setSubs} />
            }
            {
                showSoundUpload &&
                <SoundUploadModal show={showSoundUpload} onClose={onSoundUpload} setSounds={setSounds} sounds={sounds} uploadControl={uploadControl} />
            }
            {
                showAlbumDelete &&
                <AlbumDeleteWarning show={showAlbumDelete} onClose={handleShowAlbumDelete} handleAlbumDelete={handleAlbumDelete} albumOption={albumOption} />
            }
            {
                showSubDelete &&
                <CategoryDeleteWarning show={showSubDelete} onClose={handleShowSubDelete} handleSubDelete={handleSubDelete} />
            }
        </>
    );
}
