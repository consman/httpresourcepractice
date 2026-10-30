import { Lokation, Daum, Jeocode, OneCallResponse, SearchResponse } from './funTypes';
export const KNOWNGEOCODES: Jeocode [] =[
    {"zip":"95630","name":"Folsom","lat":38.6709,"lon":-121.1529,"country":"US"}
    ,{"zip":"55121","name":"Eagan","lat":44.8471,"lon":-93.1543,"country":"US"}
    ,{"zip":"95742","name":"Sacramento County","lat":38.5981,"lon":-121.2153,"country":"US"}//Rancho
    ,{"zip":"93424","name":"San Luis Obispo County","lat":35.18,"lon":-120.7318,"country":"US"}
    ,{"zip":"83616","name":"Ada County","lat":43.7069,"lon":-116.362,"country":"US"}
    ,{"zip":"59829","name":"Ravalli County","lat":46.028,"lon":-114.1938,"country":"US"}
    ,{"zip":"08002","name":"Cherry Hill Township","lat":39.9308,"lon":-75.0175,"country":"US"}
    ,{"zip":"94901","name":"San Rafael","lat":37.9691,"lon":-122.5105,"country":"US"}
];


export const initialGeoCode: Jeocode = {
    zip: '',
    name: '',
    lat: 0,
    lon: 0,
    country: ''
};

export const initialOneCallResponse: OneCallResponse = {
    lat: 0,
    lon: 0,
    timezone: '',
    timezone_offset: 0,
    data: [],
    prev: '',
    next: ''
}

export const initialLokation: Lokation ={
    jeocode: initialGeoCode,
    oneCallResponse: initialOneCallResponse,
    dt: 0
}

export const initialSearchResponse: SearchResponse ={
    lokation: initialLokation,
    lokationsCount: 0,
    messageFromServer: '',
    success: false
}; 
