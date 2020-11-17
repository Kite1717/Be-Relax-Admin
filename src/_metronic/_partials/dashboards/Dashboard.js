import React, { useMemo, useState, useEffect } from "react";
import { storage } from "../../../firebase";
import objectPath from "object-path";
import { useHtmlClassService } from "../../layout";
import { Card, CardHeader, Select, Button, CircularProgress, Input } from "@material-ui/core";
import { CardBody, CardFooter } from "../controls";
import { Row } from "react-bootstrap";
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from "../../_helpers";
import { v4 as uuidv4 } from 'uuid';
import LibraryMusicIcon from '@material-ui/icons/LibraryMusic';
import Marquee from "react-double-marquee";
import Swal from "sweetalert2"




export function Dashboard() {
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
    const [albumName, setAlbumName] = useState(null);

    useEffect(() => {
        let temp = [];
        storage.ref("meditation").listAll().then(list => {
            list.prefixes.map(e => {
                console.log(e.name);
                temp.push(e.name)
            })
            setSubs(temp)
        })
    }, [])

    const uploadControl = () => {

        let tempImages = []
        let tempSounds = []
        console.log(images)
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

        console.log(imageCount, "image Couuunnnttttt")
        console.log(soundCount, "sound Counntntntntntntn")

        if (imageCount === 5) {
            setIsImageFive(false);
        } else {
            setIsImageFive(true);
        }

        if (imageCount === 5 && soundCount > 0) {
            setIsUploadOk(true);
        } else {
            setIsUploadOk(false);
        }

    }

    const handleSoundChange = e => {
        let key = uuidv4();
        let tempSounds = sounds;
        let url = URL.createObjectURL(e.target.files[0])

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
        console.log(e.target.files, "targeeeeettttttt")
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
        console.log(e.target.files, "targeeeeettttttt")

    }

    const onMedThemeChange = e => {
    }

    const onSubChange = e => {
        console.log(e.target.value);

        let sub = e.target.value;

        setSubOption(sub);
        let option = "meditation/" + sub;
        let temp = [];
        storage.ref(option).listAll().then(list => {
            console.log(list);
            list.prefixes.map(e => {
                console.log(e.name);
                temp.push(e.name)
            })
            setAlbums(temp);
        })
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
        let folder1 = "";
        let folder2 = "";
        let folder3 = "";
        let folder4 = "";

        folder1 = "meditation" + "/" + subOption + "/" + albumOption + "/" + "images"
        folder2 = "meditation" + "/" + subOption + "/" + albumOption + "/" + "sounds"
        folder3 = "meditation" + "/" + subOption + "/" + albumOption
        folder4 = "meditation" + "/" + subOption


        var deleteRef1 = storage.ref(folder1)
        deleteRef1.listAll().then(list => {
            setIsLoading(true);
            console.log(list)
            list.items.map(e => {
                let ref = storage.ref(e.location.path_)
                ref.delete().then(res => {
                }).then(e => {
                    let temp = [];
                    storage.ref(folder4).listAll().then(list => {
                        console.log(list);
                        list.prefixes.map(e => {
                            console.log(e.name);
                            temp.push(e.name)
                        })
                        setAlbums(temp);
                        setAlbumOption(null);
                        setIsLoading(false);
                    })
                })
            })
        })

        var deleteRef2 = storage.ref(folder2)
        deleteRef2.listAll().then(list => {
            setIsLoading(true);
            console.log(list)
            list.items.map(e => {
                let ref = storage.ref(e.location.path_)
                ref.delete().then(res => {
                    console.log(res);
                }).then(e => {
                    let temp = [];
                    storage.ref(folder4).listAll().then(list => {
                        console.log(list);
                        list.prefixes.map(e => {
                            console.log(e.name);
                            temp.push(e.name)
                        })
                        setAlbums(temp);
                        setAlbumOption(null);
                        setIsLoading(false);
                    })
                })

            })
        })

        var deleteRef3 = storage.ref(folder3)
        deleteRef3.listAll().then(list => {
            setIsLoading(true);
            console.log(list)
            list.items.map(e => {
                let ref = storage.ref(e.location.path_)
                ref.delete().then(res => {
                    console.log(res);

                }).then(e => {
                    let temp = [];
                    storage.ref(folder4).listAll().then(list => {
                        console.log(list);
                        list.prefixes.map(e => {
                            console.log(e.name);
                            temp.push(e.name)
                        })
                        setAlbums(temp);
                        setAlbumOption(null);
                        setIsLoading(false);
                    })
                })

            })
        })

    }

    const onSubCreate = () => {
        setShowSubCreate(!showSubCreate);
    }

    const handleUpload = () => {

        if (albumName !== null && albumName !== undefined && albumName !== "") {
            setIsLoading(true);
            let temp1 = [...images, ...sounds]
            console.log(temp1)
            let temp = [];
            temp1.forEach((item) => {
                if (!item.deleted) {
                    temp.push(item)
                }

            })


            console.log(temp)

            let fileIndex = 0;

            temp.map((obj) => {
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
                    fileName = obj.file.name;
                }

                var folder = "";
                folder = "meditation" + "/" + subOption + "/" + albumName + "/" + fileType;


                const uploadTask = storage.ref(`${folder}/${fileName}`).put(obj.file);
                uploadTask.on(
                    "state_changed",
                    snapshot => { },
                    error => {
                        console.log(error);
                    },
                    () => {
                        storage.ref(folder)
                            .child(fileName)
                            .getDownloadURL()
                            .then(url => {
                                console.log(url, fileName);
                            }).then(obj => {
                                let temp = [];
                                storage.ref(`meditation/${subOption}`).listAll().then(list => {
                                    console.log(list);
                                    list.prefixes.map(e => {
                                        console.log(e.name);
                                        temp.push(e.name)
                                    })
                                    setAlbums(temp);
                                    setAlbumName("");
                                    setIsLoading(false);
                                })
                            }).catch(err => {
                                console.log(err);
                            })
                    }
                )
                fileIndex++;
            })

            setFiles([]);
            setImages([]);
            setSounds([]);
            setIsImageFive(true)
            setIsUploadOk(false);
        } else {
            Swal.fire({
                icon: "warning",
                text:
                    "Lütfen albüme isim veriniz!!!",
                showConfirmButton: false,
                timer: 1500,
            })
        }


    }

    const handleAlbumName = (e) => {
        setAlbumName(e.target.value)
    }

    const handleSubDelete = () => {
        let deleteRef1 = storage.ref(`meditation/${subOption}`)

        storage.ref(`meditation/${subOption}`).listAll().then(list => {
            setIsLoading(true);
            list.prefixes.map(e => {
                handleAlbumDelete(e.name)
            })
        }).then(obj => {
            deleteRef1.listAll().then(list => {
                list.items.map(e => {
                    let ref = storage.ref(e.location.path_)
                    ref.delete().then(res => {
                        console.log(res);
                    }).then(obj => {
                        let temp = [];
                        storage.ref("meditation").listAll().then(list => {
                            console.log(list);
                            list.prefixes.map(e => {
                                console.log(e.name);
                                temp.push(e.name)
                            })
                            setSubs(temp);
                            setSubOption(null);
                        }).then(
                            setIsLoading(false)
                        )
                    })
                })
            }).catch(error => {
                console.log(error);
            })
        })

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
                        <form>
                            <label> Kategoriler : </label>
                            <Select id="sub" onChange={onSubChange} style={{ width: "250px" }} required={true} >
                                {
                                    subs !== null &&
                                    subs !== undefined &&
                                    subs.map((e, index) => {
                                        return <option key={index} id={index} value={e}>{e}</option>
                                    })
                                }
                            </Select>
                            <span className="svg-icon" style={{ alignSelf: "center", cursor: "pointer" }} onClick={onSubCreate}>
                                <SVG style={{ height: "20px", width: "20px" }}
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
                                                return <option key={index} id={index} value={e}>{e}</option>
                                            })
                                        }
                                    </Select>
                                </>
                            }
                            <br />
                            <br />



                            {
                                albumOption ?
                                    <Button onClick={() => handleAlbumDelete(albumOption)} color="primary" variant="contained" component="span" className="mr-2"> Albümü Sil </Button>
                                    :
                                    <Button disabled color="primary" variant="contained" component="span" className="mr-2"> Albümü Sil </Button>
                            }
                            {
                                subOption !== null &&
                                    subOption !== undefined ?
                                    <Button onClick={handleSubDelete} color="primary" variant="contained" component="span" className="mr-2"> Kategoriyi Sil </Button>
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




                        </form>
                    </CardBody>
                </Card>
                <div style={{ flex: "0.59" }}>
                    <Card>
                        <CardHeader title="Fotoğraf Yükleyin" />
                        <CardBody>
                            <layout>Albüme İsim Verin : </layout>
                            <Input type="text" onChange={handleAlbumName} value={albumName} />
                            <br />
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
                                                <div>
                                                    <img src={image.displayUrl} key={image.key} style={{ height: "122px", width: "122px", borderStyle: "none", marginRight: "5px" }} />
                                                    <br />
                                                    <Button key={index} onClick={() => onImageDeleteClicked(index)} >Delete</Button>
                                                </div>
                                            )
                                        }

                                    })

                                }
                                {
                                    isImageFive &&

                                    <label htmlFor="image-upload" style={{ borderStyle: "dotted", height: "122px", width: "122px", cursor: "pointer", display: "flex", justifyContent: "center", marginRight: "5px" }}>
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
                                                            {sound.file.name}
                                                        </Marquee>
                                                    </div>


                                                    <br />
                                                    <Button key={index} onClick={() => onSoundDeleteClicked(index)} >Delete</Button>
                                                </div>
                                            )
                                        }

                                    })

                                }
                                <label htmlFor="sound-upload" style={{ borderStyle: "dotted", height: "100px", width: "100px", cursor: "pointer", display: "flex", justifyContent: "center", marginRight: "5px" }}>
                                    <span className="svg-icon" style={{ alignSelf: "center" }}>
                                        <SVG style={{ height: "50px", width: "50px" }}
                                            src={toAbsoluteUrl("/media/svg/icons/Navigation/Plus.svg")}
                                        />
                                    </span>
                                    <input style={{ display: "none" }} id="sound-upload" type="file" accept="audio/mpeg" onChange={handleSoundChange} onClick={e => (e.target.value = null)} />
                                </label>
                            </Row>
                        </CardBody>
                        <CardFooter>
                            {
                                isUploadOk ?
                                    <Button onClick={handleUpload} color="secondary" variant="contained" component="span" className="mr-2"> Upload </Button>
                                    :
                                    <Button disabled color="secondary" variant="contained" component="span" className="mr-2"> Upload </Button>
                            }
                        </CardFooter>

                    </Card>
                </div>
            </Row>

            
        </>
    );
}
