import source from "../PeriodicTableJSON.json";
import fetch from "node-fetch";
import fs from "fs";

const fixElement = ele => {
    const fixedElement = ele;
    // Fix name
    switch(ele.name) {
        case "Cesium": fixedElement.name = "Caesium";
            break;
        default: break;
    }

    // Fix url
    const url = ele.source;
    const endUrl = url.split("/").pop();
    switch(endUrl) {
        case "Ununpentium": fixedElement.source = url.replace(endUrl, "Moscovium");
            break;
        case "Ununtrium": fixedElement.source = url.replace(endUrl, "Nihonium");
            break;
        case "Cesium": fixedElement.source = url.replace(endUrl, "Caesium");
            break;
        case "Lead_(element)": fixedElement.source = url.replace(endUrl, "Lead");
            break;
        case "Mercury (Element)": fixedElement.source = url.replace(endUrl, "Mercury_(element)");
            break;
        default: break;
    }

    return fixedElement;
};

const getFilteredData = element => {
    const data = {
        name: element.name,
        category: element.category,
        number: element.number,
        symbol: element.symbol,
        xpos: element.xpos,
        ypos: element.ypos,
        source: element.source
    };
    return data;
}

// Need to call this multiple times since you can't ask for it to return multiple specific lang codes
const getWikiLocale = async (name, locale) => {
    const query = `https://en.wikipedia.org/w/api.php?action=query&titles=${name}&prop=langlinks&format=json&lllang=${locale}&llprop=url`;    
    const response = await fetch(query, {
        // You need to fill in the user agent for wikipedia api
        // "ExampleApplication/1.0.0 (contactemail@something.com)"
        headers: {
            "User-Agent": "ExampleApplication/1.0.0 (contactemail@something.com)"
        } });
    const responseJson = await response.json();
    const [{ langlinks }] = Object.values(responseJson.query.pages);
    const [{ "*": localizedName, url}] = langlinks;
    return {
        name: localizedName.split(/[_\s]+/)[0],
        source: url
    }
}


const getLocalData = async (ele) => {
    const endPoint = ele.source.split("/").pop();
    const frData = await getWikiLocale(endPoint, "fr");
    const esData = await getWikiLocale(endPoint, "es");
    const locales = {
        fr: frData,
        es: esData
    }
    return locales;
}

(async () => {
    const { elements } = source;  
    const filteredElements = await Promise.all(elements.map(async ele => {
        const element = getFilteredData(fixElement(ele));
        const locales = await getLocalData(element).catch(err => console.log(err));
        element.locales = locales;
        return element;
    }));

    const json = JSON.stringify(filteredElements);

    fs.writeFile("src/periodicElements.json", json, err => {
        if(err) {
            console.log("Error Writing File", err);
        }
    });

})();

