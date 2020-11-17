import React, { useMemo, useState, useEffect } from "react";
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
import Swal from "sweetalert2"
import { ThemeDeleteWarning } from "./ThemeDeleteWarning";




export function Theme() {
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
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploadOk, setIsUploadOk] = useState(false);
    const [image, setImage] = useState(null);
    const [sound, setSound] = useState(null);
    const [themeName, setThemeName] = useState(null);
    const [themes, setThemes] = useState(null)
    const [themeOption, setThemeOption] = useState(null);
    let imageUrl = "";
    let soundUrl = "";
    const [themeId, setThemeId] = useState(uuidv4());
    const [showThemeDelete, setShowThemeDelete] = useState(false)

    useEffect(() => {
        let temp = [];
        firestore.collection("themes").get().then(querySnapshots =>{
            querySnapshots.docs.map(doc =>{
                if(doc.data().blob){
                }else{
                    temp.push(doc.data());
                }
            })
            setThemes(temp)
        })
    }, [])

    useEffect(()=> {
        uploadControl();
    }, [image, sound])

    const uploadControl = () => {

        if(image !== null && image !== undefined && sound!== null && sound !== undefined){
            setIsUploadOk(true)
        }else{
            setIsUploadOk(false)
        }
    }

    const handleSoundChange = e => {
        let key = uuidv4();
        let url = URL.createObjectURL(e.target.files[0])

        var tempSound = {
            displayUrl: url,
            file: e.target.files[0],
            deleted: false,
            key: key,
        }
        setSound(tempSound)
        

        if (e.target.files[0]) {
            setDisplay(url)
        }
        
    }

    const handleImageChange = e => {

        let key = uuidv4();
        let url = URL.createObjectURL(e.target.files[0])

        let tempImage = {
            displayUrl: url,
            file: e.target.files[0],
            deleted: false,
            key: key,
        }

        setImage(tempImage)
        

        if (e.target.files[0]) {
            setDisplay(url)
        }

        
    }

    const onImageDeleteClicked = () => {
        setImage(null);
        uploadControl();
    }

    const onSoundDeleteClicked = () => {
        setSound(null)
        uploadControl();
    }

    const onThemeChange = e => {
        let theme = e.target.value;
        setThemeOption(theme);
    }

    const handleThemeDelete = (themeOption) => {
        setIsLoading(true);
        let folder1 = "";
        let folder2 = "";

        firestore.collection("themes").where("id", "==", themeOption.id).get().then(querySnapshots => {
            querySnapshots.docs[0].ref.delete();
        })

        folder1 = "theme" + "/" + themeOption.id + "/" + "image"
        folder2 = "theme" + "/" + themeOption.id + "/" + "sound"
        


        var deleteRef1 = storage.ref(folder1)
        deleteRef1.listAll().then(list => {
            setIsLoading(true);
            console.log(list)
            list.items.map(e => {
                let ref = storage.ref(e.location.path_)
                ref.delete().then(() => {
                    let temp = [];
                    firestore.collection("themes").get().then(querySnapshots =>{
                        querySnapshots.docs.map(doc =>{
                            if(doc.data().blob){
                            }else{
                                temp.push(doc.data());
                            }
                        })
                        setThemes(temp);
                        setThemeOption(null);
                        setIsLoading(false);
                        setShowThemeDelete(false)
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
                ref.delete().then(() => {
                    let temp = [];
                    firestore.collection("themes").get().then(querySnapshots =>{
                        querySnapshots.docs.map(doc =>{
                            if(doc.data().blob){
                            }else{
                                temp.push(doc.data());
                            }
                        })
                        setThemes(temp);
                        setThemeOption(null);
                        setIsLoading(false);
                        setShowThemeDelete(false);
                    })
                })

            })
        })
    }

    const firestoreUpload = () => {

        let tempTheme = {
            id : themeId,
            name : themeName,
            image : imageUrl,
            sound : soundUrl,
        }

        console.log(tempTheme);
        let temp = [];
        firestore.collection("themes").add(tempTheme).then(() => {
            firestore.collection("themes").get().then(querySnapshots => {
                querySnapshots.docs.map(doc => {
                    if(doc.data().blob){
                    }else{ 
                        temp.push(doc.data())
                    }
                })
                setThemes(temp);
                document.getElementById("theme-name").value = null;
            })
        })
    }

    const handleUpload = () => {

        

        if (themeName !== null && themeName !== undefined && themeName !== "") {
            setIsLoading(true);
            let temp = [image,sound]
            let promises = [];
            console.log(temp);
            temp.map(obj=>{
                let fileType = "";
                if (obj.file.type.split("/")[0] === "audio") {
                    fileType = "/sound"
                } else if (obj.file.type.split("/")[0] === "image") {
                    fileType = "/image"
                }

                let folder = "theme/" + themeId + fileType

                const uploadTask = storage.ref(`${folder}/${obj.file.name}`).put(obj.file)
                promises.push(uploadTask);

                uploadTask.on(
                    "state_changed",
                    snapshot => { },
                    error => {
                    },
                    () => {
                        storage.ref(folder)
                            .child(obj.file.name)
                            .getDownloadURL()
                            .then(url => {
                                if(fileType === "/image"){
                                    console.log(url, "imageee")
                                    imageUrl = url
                                }else if(fileType === "/sound"){
                                    console.log(url,"souunnddd")
                                    soundUrl = url;
                                }
                            }).then(() => {
                                if(imageUrl !== "" && soundUrl !== ""){
                                    Promise.all(promises).then(()=> {
                                        firestoreUpload();
                                    }).then(()=>{
                                        firestore.collection("themes").get().then(querySnapshots =>{
                                            let temp = [];
                                            querySnapshots.docs.map(doc => {
                                                if(doc.data().blob){
                                                }else{
                                                    temp.push(doc.data());
                                                }
                                            })
                                            setThemes(temp);
                                        })
                                    }).then(() => {
                                        setThemeId(uuidv4());
                                        setIsLoading(false);
                                        setImage(null);
                                        setSound(null);
                                        setThemeName(null);
                                        setFiles([]);
                                    })
                                }
                            }).catch(err => {
                            })
                    }
                    
                )
            })
        } else {
            Swal.fire({
                icon: "warning",
                text:
                    "Lütfen temaya isim veriniz!!!",
                showConfirmButton: false,
                timer: 1500,
            })
        }


    }

    const handleShowThemeDelete = () => {
        setShowThemeDelete(!showThemeDelete)
    }

    return (
        <>
            <Card>
                <CardHeader style={{ justifyContent: "center" }} title="Tema">
                </CardHeader>
            </Card>
            <br />
            <Row className="form-group" style={{display:"flex", justifyContent:"space-between"}}>
                <div style={{ flex: "0.35" }}>
                <Card>
                    <CardHeader title="Tema Seçin">

                    </CardHeader>
                    <CardBody>
                        <form>
                            <label> Temalar : </label>
                            <Select id="sub" onChange={onThemeChange} style={{ width: "250px" }} required={true} >
                                {
                                    themes !== null &&
                                    themes !== undefined &&
                                    themes.map((e, index) => {
                                        return <option key={index} id={index} value={e}>{e.name}</option>
                                    })
                                }
                            </Select>

                            <br />
                            {
                                isLoading &&
                                <div style={{ display: "flex", justifyContent: "center" }}>
                                    <CircularProgress color="secondary" style={{ marginTop: "50px" }} />
                                </div>
                            }
                        </form>
                    </CardBody>
                        <span style={{ display: "flex", justifyContent: "flex-end",margin:"1rem" }}>
                        {
                            themeOption ?
                                <Button style={{alignSelf:"flex-end"}} onClick={handleShowThemeDelete} color="primary" variant="contained" component="span" className="mr-2"> Temayı Sil </Button>
                                :
                                <Button style={{alignSelf:"flex-end"}} disabled color="primary" variant="contained" component="span" className="mr-2"> Temayı Sil </Button>
                        }
                        </span>
                </Card>
                </div>
                <div style={{ flex: "0.64" }}>
                    <Card>
                        <CardHeader title="Tema Yükleyin" />
                        <CardBody>
                            <layout>Temaya İsim Verin : <Input type="text" id="theme-name" onChange={(e) => {
                                setThemeName(e.target.value)
                            }}/>
                            </layout>
                            
                            <br />
                            <br />
                            <Row style={{ display: "flex", justifyContent: "space-evenly" }}>
                                <h4 >Tema Resmi</h4>
                                <h4 >Tema Müziği</h4>
                            </Row>
                            <Row style={{ display: "flex", justifyContent: "space-evenly" }}>
                                <span>
                                    {
                                        image !== null &&
                                        image !== undefined &&
                                                    <div>
                                                        <img src={image.displayUrl} key={image.key} style={{ height: "150px", width: "150px", borderStyle: "none", marginRight: "5px" }} />
                                                        <br />
                                                        <Button onClick={onImageDeleteClicked} >Delete</Button>
                                                    </div>
                                                
                                    }
                                    {
                                        image === null ||
                                        image === undefined ?
                                        <label htmlFor="image-upload" style={{ borderStyle: "dotted", height: "150px", width: "150px", cursor: "pointer", display: "flex", justifyContent: "center", marginRight: "5px" }}>
                                            <span className="svg-icon" style={{ alignSelf: "center" }}>
                                                <SVG style={{ height: "50px", width: "50px" }}
                                                    src={toAbsoluteUrl("/media/svg/icons/Navigation/Plus.svg")}
                                                />
                                            </span>
                                            <input style={{ display: "none" }} id="image-upload" type="file" accept="image/*" onChange={handleImageChange} onClick={e => (e.target.value = null)} />
                                        </label>
                                        : null
                                    }
                                </span>
                                <span>
                                    {
                                        sound !== null &&
                                        sound !== undefined &&
                                        
                                                    <div>
                                                        <label style={{ borderStyle: "solid", height: "150px", width: "150px", display: "flex", justifyContent: "center", marginRight: "5px" }}>
                                                            <LibraryMusicIcon style={{ alignSelf: "center" }} />

                                                        </label>
                                                        <div style={{
                                                            width: '150px',
                                                            whiteSpace: 'nowrap',
                                                        }}>
                                                            <Marquee
                                                                direction="left"
                                                            >
                                                                {sound.file.name}
                                                            </Marquee>
                                                        </div>


                                                        <br />
                                                        <Button onClick={onSoundDeleteClicked} >Delete</Button>
                                                    </div>

                                    }
                                    {
                                        sound === null ||
                                        sound === undefined ?
                                        <label htmlFor="sound-upload" style={{ borderStyle: "dotted", height: "150px", width: "150px", cursor: "pointer", display: "flex", justifyContent: "center", marginRight: "5px" }}>
                                        <span className="svg-icon" style={{ alignSelf: "center" }}>
                                            <SVG style={{ height: "50px", width: "50px" }}
                                                src={toAbsoluteUrl("/media/svg/icons/Navigation/Plus.svg")}
                                            />
                                        </span>
                                            <input style={{ display: "none" }} id="sound-upload" type="file" accept="audio/mpeg" onChange={handleSoundChange} onClick={e => (e.target.value = null)} />
                                        </label>
                                        : null
                                    }
                                </span>
                            </Row>

                        </CardBody>
                        <span style={{ display: "flex", justifyContent: "flex-end",margin:"1rem" }}>
                            {
                                isUploadOk ?
                                    <Button onClick={handleUpload} color="secondary" variant="contained" component="span" className="mr-2"> Upload </Button>
                                    :
                                    <Button disabled color="secondary" variant="contained" component="span" className="mr-2"> Upload </Button>
                            }
                        </span>
                    </Card>
                </div>
            </Row>
                            {   
                                showThemeDelete &&
                                <ThemeDeleteWarning show={showThemeDelete} onClose={handleShowThemeDelete} handleThemeDelete={handleThemeDelete} themeOption={themeOption} />
                            }
        </>
    );
}
