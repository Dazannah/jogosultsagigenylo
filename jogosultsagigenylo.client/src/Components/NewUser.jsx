import { useEffect, useState } from "react";

import Container from "./Container";
import Column from "../Includes/Column"

import CssClasses from "../CssClasses"
import Loading from "./Loading";

function NewUser() {
    const title = "Új felhasználó"

    const [isLoading, setIsloading] = useState(true)
    const [columns, setColumns] = useState([])

    //const leftField = [
    //    { status: "active", name: "adName", display: "Számítógép bejelentkezési név"},
    //    { status: "active", name: "eMail", display: "E-mail cím"},
    //    { status: "active", name: "medworks", display: "Medworks"},
    //    { status: "active", name: "emedworks", display: "Emedworks"},
    //    { status: "active", name: "ecostat", display: "Ecostat"},
    //    { status: "active", name: "kira", display: "KIRA"},
    //    { status: "active", name: "beeWise", display: "Bee Wise"},
    //    { status: "active", name: "makElektra", display: "MÁK Electra"},
    //    { status: "active", name: "opalIktato", display: "Opal Iktató rendszer"},
    //    { status: "active", name: "jdolber", display: "Jdolber"},
    //    { status: "active", name: "quadroByte", display: "Quadro Byte Élelmezés"},
    //    { status: "active", name: "ovszTraceline", display: "OVSZ Traceline"},
    //    { status: "active", name: "coralVercsoport", display: "Coral vércsoport meghatározás"},
    //    { status: "active", name: "progesa", display: "Progesa Országos donor nyilvántartó"},
    //    { status: "active", name: "hcPointer", display: "HC-Pointer Medivus"},
    //    { status: "active", name: "bsoftEkvik", display: "BSoft eKVIK kontrolling rendszer"},
    //    { status: "active", name: "tetfog", display: "Tetfog fogászati nyilvántartó szoftver"},
    //    { status: "active", name: "tavleletezes", display: "Távleletezés VPN"},
    //    { status: "active", name: "ipTelefonMellek", display: "IP telefon mellék"},
    //    { status: "active", name: "ipTelefonKilepoKod", display: "IP telefon kilépő kód"}
    //]
    //const middleField = [
    //    { status: "active", name: "cashFlow", display: "Cash flow" },
    //    { status: "active", name: "fokonyvRegi", display: "Főkönyv régi" },
    //    { status: "active", name: "fokonyv", display: "Főkönyv" },
    //    { status: "active", name: "intezmenyiElbiralas", display: "Intézeti elbírálás" },
    //    { status: "active", name: "kikuldesiNyilvantartas", display: "Kiküldetési nyilvántartás" },
    //    { status: "active", name: "kotelezettsegvallalas", display: "Kötelezettségvállalás" },
    //    { status: "active", name: "leltar", display: "Leltár" },
    //    { status: "active", name: "leteti", display: "Letéti" },
    //    { status: "active", name: "munkalapIgenyles", display: "Munkalap igénylés" },
    //    { status: "active", name: "munkalap", display: "Munkalap" },
    //    { status: "active", name: "osztalyosIgenyles", display: "Osztályos igénylés" },
    //    { status: "active", name: "parameterKezelo", display: "Paraméter kezelő" },
    //    { status: "active", name: "penzugy", display: "Pénzügy" },
    //    { status: "active", name: "penzugy2", display: "Pénzügy 2" },
    //    { status: "active", name: "projektNyilvantartas", display: "Projekt nyilvántartás" },
    //    { status: "active", name: "projektKezeles", display: "Projekt kezelés" },
    //    { status: "active", name: "raktar", display: "Raktár" },
    //    { status: "active", name: "rendeles", display: "Rendelés" },
    //    { status: "active", name: "targyiEszközkezelo", display: "Tárgyi eszközkezelő" },
    //    { status: "active", name: "vedelmiRendszer", display: "Védelmi rendszer" }
    //]
    //const rightField = [
    //    { status: "active", name: "osztalyvezetoFoorvos", display: "Osztályvezető főorvos" },
    //    { status: "active", name: "orvos", display: "Orvos" },
    //    { status: "active", name: "osztalyosInformatikus", display: "Osztályos Informatikus" },
    //    { status: "active", name: "nover", display: "Nővér" },
    //    { status: "active", name: "fekvobetegAdminisztrator", display: "Fekvőbeteg adminisztrátor" },
    //    { status: "active", name: "jarobetegAdminisztrator", display: "Járóbeteg adminisztrátor" },
    //    { status: "active", name: "kuraszeruEllatas", display: "Kúraszerű ellátás adminisztrátor" },
    //    { status: "active", name: "penzugyiRendszer", display: "Gazdálkodási és pénzügyi rendszer" },
    //    { status: "active", name: "osztalyosGyogyszerfelelos", display: "Osztályos gyógyszerfelelős" },
    //    { status: "active", name: "kodoloCsoport", display: "Kódoló csoport" },
    //    { status: "active", name: "porta", display: "Porta" },
    //    { status: "active", name: "mutosno", display: "Műtősnő" },
    //    { status: "active", name: "osztalyosElemzes", display: "Osztályos élelmezés" },
    //    { status: "active", name: "labworks", display: "Labworks" },
    //    { status: "active", name: "siemensPacs", display: "Siemens PACS" },
    //    { status: "active", name: "elelmezes", display: "Élelmezés" }
    //]

    useEffect(() => {
        fetch("/api/columns")
            .then(response => {
                return response.json()
            })
            .then(data => {
                setColumns(data)
                setIsloading(false)
            }).catch(err => {
                console.log(err)
            })
    }, [])

    if (isLoading) return <Loading title={title} />

    return (
        <Container title={"Új felhasználó"}>
            <form action="/new-user" method="post" className="w-full max-w-5xl mx-auto p-5 shadow-lg sm:rounded-lg">
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className={`${CssClasses.label}`} htmlFor="name">
                                Név*
                        </label>
                        <input className={`${CssClasses.input}`} id="name" autoComplete="off" type="text" placeholder="Név" required />
                    </div>

                    <div className="w-full md:w-1/3 px-3">
                        <label className={`${CssClasses.label}`} htmlFor="registration-number">
                                Nyilv. szám
                            </label>
                        <input className={`${CssClasses.input}`} id="registration-number" type="text" placeholder="Nyilv. szám" />
                    </div>
                    <div className="w-full md:w-1/3 px-3">
                        <label className="uppercase tracking-wide text-gray-700 dark:text-white text-xs font-bold mb-2 cursor-pointer" htmlFor="isTechnical">Technikai fiók</label>{" "}
                        <input id="isTechnical" className="my-auto cursor-pointer" autoComplete="off" type="checkbox" />
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-2">
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className={`${CssClasses.label}`} htmlFor="work-location">
                            Munkavégzés helye*
                        </label>
                        <input className={`${CssClasses.input}`} id="work-location" type="text" placeholder="Munkavégzés helye" required />
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className={`${CssClasses.label}`} htmlFor="class-leader">
                            Osztályvezető*
                        </label>
                        <input className={`${CssClasses.input}`} id="class-leader" type="text" placeholder="Osztályvezető" required />
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className={`${CssClasses.label}`} htmlFor="position">
                            Beosztás*
                        </label>
                        <input className={`${CssClasses.input}`} id="position" type="text" placeholder="Beosztás" required />
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-2">
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className={`${CssClasses.label}`} htmlFor="phone-number">
                            Tel.szám(70-1234567)*
                        </label>
                        <input className={`${CssClasses.input}`} id="phone-number" name="phone-number" type="tel" placeholder="70-1234567" pattern="[0-9]{2}-[0-9]{7}" required />
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className={`${CssClasses.label}`} htmlFor="email">
                            Email cím
                        </label>
                        <input className={`${CssClasses.input}`} id="email" type="email" placeholder="Email cím" />
                    </div>
                    <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
                        <label className={`${CssClasses.label}`} htmlFor="position">
                            Beosztás*
                        </label>
                        <input className={`${CssClasses.input}`} id="position" type="text" placeholder="Beosztás" required />
                    </div>
                </div>
                <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full md:w-1/3 px-3">
                        <label className={`${CssClasses.label}`} htmlFor="classes">
                            Osztály kiválasztása**
                        </label>
                        <select id="classes" className="w-full rounded border bg-gray-100 dark:bg-gray-900 border-teal-700 focus:border-orange-500 cursor-pointer" required >
                            <option value="">---</option>
                            <option value="1">Belgyógyászat</option>
                            <option value="2">Sebészet</option>
                        </select>
                    </div>

                    </div>

                <div className="flex flex-wrap m-3 py-3 -mx-3 my-5 mb-2">
                    {
                        columns.map(column => {
                            if(column.status?.id == 1) return <Column key={column.id} column={column} />
                        })
                    }
                </div>
                <div className="flex flex-wrap m-3 py-3 -mx-3 my-5 mb-2">
                    <label className={`${CssClasses.label}`} htmlFor="createTextArea">
                        Egyéb igény (egyéb szakrendszer, alkalmazás, mobiltelefon, adathordozó, laptop használat):
                    </label>
                    <textarea className={`${CssClasses.input}`} id="createTextArea" name="createTextArea" title="createTextArea"></textarea>
                </div>

                <div className="md:w-2/3">

                    <button className="shadow bg-teal-700 hover:bg-orange-500 cursor-pointer focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                        Küldés
                    </button>
                </div>

            </form>
            <br />
            <small>* mező megadása kötelező.</small><br />
            <small>** több is választható.</small>
        </Container>
  );
}

export default NewUser;