//Token dający dostęp do mapbox
mapboxgl.accessToken = 'pk.eyJ1Ijoid2J1ZHppc3oiLCJhIjoiY2xvZW9rc2ZiMGg2ZTJycGx5YWQwMXJzcyJ9.Hyj0mZgSeyFKnjGAWexYfQ';

//Utworzenie bounding box dla mapy
const bounds = [
    [19.901733, 51.422761], // południowo-zachodni
    [20.437317, 51.629952] // północno-wschodni
];

//Zainicjalizowanie mapy z Mapbox GL
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/wbudzisz/clovk9w7c00tw01nz79u5amkk',
    center: [20.162544, 51.519379],
    zoom: 11,
    maxBounds: bounds
});

//Dodanie możliwości zczytywania lokalizacji na urządzeniu
map.addControl(
    new mapboxgl.GeolocateControl({
        positionOptions: {
            enableHighAccuracy: true
        },
        // Gdy mapa jest aktywna, będzie otrzymywać aktualizacje lokalizacji urządzenia w miarę jej zmian
        trackUserLocation: true,
        // Strzalka wskazująca, w którą stronę użytkownik zmierz.
        showUserHeading: true
    })
);

// Dodanie przycisków nawigacji i zbliżenia
map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');

// Dodanie skali do mapy
map.addControl(new mapboxgl.ScaleControl());

// Funkcja do pokazywania legendy
function toggleLegend() {
    const legend = document.getElementById('legend');
    legend.style.display = legend.style.display === 'none' ? 'block' : 'none';
}

// Dodanie konteneru legendy do mapy
const mapContainer = document.getElementById('map');
const legendContainer = document.getElementById('legend-container');
mapContainer.appendChild(legendContainer);

// Dodanie eventu kliknięcia do konteneru legendy
legendContainer.addEventListener('click', toggleLegend);

// Dodanie elementów legendy
const legend = document.getElementById('legend');
const legendData = [
    { category: 'Bystrza pod mostami', markerImage: 'url(ikony/bystrze.png)', markerSize: '25px', markerVisibility: true },
    { category: 'Przenoski', markerImage: 'url(ikony/przenoska.png)', markerSize: '35px', markerVisibility: true },
    { category: 'Miejsca wodowania', markerImage: 'url(ikony/miejsce_wodowania.png)', markerSize: '30px', markerVisibility: true },
    { category: 'Mosty', markerImage: 'url(ikony/most.png)', markerSize: '25px', markerVisibility: true },
    { category: 'Ujścia rzek', markerImage: 'url(ikony/rzeka.png)', markerSize: '30px', markerVisibility: true },
    { category: 'Atrakcje', markerImage: 'url(ikony/atrakcje.png)', markerSize: '25px', markerVisibility: true },
    { category: 'Łachy', layerId: 'lachy-layer', layerType: 'circle', layerVisibility: 'visible', markerSize: '10px', markerColor: '#6d5747' }
];

//Iteracja elementów legendy do tworzenia ich na podstawie markeru lub warstwy
legendData.forEach(item => {
    const legendItem = document.createElement('div');
    legendItem.className = 'legend-item';

    const legendMarker = document.createElement('div');
    legendMarker.className = 'legend-marker';

    if (item.layerId) {
        // Warstwy
        const layerVisibility = item.layerVisibility || 'visible';
        legendMarker.style.borderRadius = '50%';
        legendMarker.style.backgroundColor = item.markerColor;
        legendMarker.style.width = item.markerSize;
        legendMarker.style.height = item.markerSize;
        legendMarker.style.visibility = layerVisibility;
    } else {
        // Markery
        legendMarker.style.backgroundImage = item.markerImage;
        legendMarker.style.width = item.markerSize;
        legendMarker.style.height = item.markerSize;
        legendMarker.style.display = item.markerVisibility ? 'block' : 'none';
    }

    //tworzenie etykiet elementów legendy
    const legendLabel = document.createElement('div');
    legendLabel.textContent = item.category;

    legendItem.appendChild(legendMarker);
    legendItem.appendChild(legendLabel);
    legend.appendChild(legendItem);
});

// Funkcja do obsługi checkboxów
function toggleMarkers() {
    const miejscaCheckbox = document.getElementById('miejscaCheckbox');
    const przenoskiCheckbox = document.getElementById('przenoskiCheckbox');
    const bystrzaCheckbox = document.getElementById('bystrzaCheckbox');
    const rzekiCheckbox = document.getElementById('rzekiCheckbox');
    const mostyCheckbox = document.getElementById('mostyCheckbox');
    const lachyCheckbox = document.getElementById('lachyCheckbox');
    const atrakcjeCheckbox = document.getElementById('atrakcjeCheckbox');

    const miejscaMarkers = document.querySelectorAll('.miejsca-marker');
    const przenoskiMarkers = document.querySelectorAll('.przenoski-marker');
    const bystrzaMarkers = document.querySelectorAll('.bystrza-marker');
    const rzekiMarkers = document.querySelectorAll('.rzeki-marker');
    const mostyMarkers = document.querySelectorAll('.mosty-marker');
    const atrakcjeMarkers = document.querySelectorAll('.atrakcje-marker');

    const rzekiLabels = document.querySelectorAll('.rzeki-marker-label');

    toggleMarkersVisibility(miejscaMarkers, miejscaCheckbox.checked);
    toggleMarkersVisibility(przenoskiMarkers, przenoskiCheckbox.checked);
    toggleMarkersVisibility(bystrzaMarkers, bystrzaCheckbox.checked);
    toggleMarkersVisibility(rzekiMarkers, rzekiCheckbox.checked);
    toggleMarkersVisibility(mostyMarkers, mostyCheckbox.checked);
    toggleMarkersVisibility(atrakcjeMarkers, atrakcjeCheckbox.checked);

    toggleMarkersVisibility(rzekiLabels, rzekiCheckbox.checked);

    const lachyLayer = map.getLayer('lachy-layer');
    toggleLayerVisibility(lachyLayer, lachyCheckbox.checked);
}

// Funkcja do włączania i wyłączania markerów
function toggleMarkersVisibility(markers, isVisible) {
    markers.forEach(marker => {
        marker.style.display = isVisible ? 'block' : 'none';
    });
}

// Funkcja do włączania i wyłączania warstw
function toggleLayerVisibility(layer, isVisible) {
    if (layer) {
        map.setLayoutProperty(layer.id, 'visibility', isVisible ? 'visible' : 'none');
    }
}

// Dołączanie detektoru zmian do checkboxów
document.getElementById('miejscaCheckbox').addEventListener('change', toggleMarkers);
document.getElementById('przenoskiCheckbox').addEventListener('change', toggleMarkers);
document.getElementById('bystrzaCheckbox').addEventListener('change', toggleMarkers);
document.getElementById('rzekiCheckbox').addEventListener('change', toggleMarkers);
document.getElementById('mostyCheckbox').addEventListener('change', toggleMarkers);
document.getElementById('lachyCheckbox').addEventListener('change', toggleMarkers);
document.getElementById('atrakcjeCheckbox').addEventListener('change', toggleMarkers);


// Ładowanie mapy następuje za każdym razem, gdy obiekt 
// Mapbox GL JS Map jest inicjowany na stronie internetowej.
// Oznacza to, że osoby korzystające z Twojej mapy internetowej 
// mogą włączać i wyłączać dodatkowe źródła, wchodzić w interakcję
// z mapą i przełączać się między stylami bez wpływu na Twoje użytkowanie.
map.on('load', () => {

    // Dodanie pliku geojson z przebiegiem Pilicy jako źródło,
    // a następnie utworzenie warstwy z tego źródła
    map.addSource('pilica', {
        type: 'geojson',
        data: 'dane/pilica.geojson'
    })

    map.addLayer({
        id: 'pilica-line',
        type: 'line',
        source: 'pilica',
        paint: {
            'line-color': '#2a5e8c',
            'line-width': 5
        }
    })

    // Dodanie pliku geojson z łachami jako źródło,
    // a następnie utworzenie warstwy z tego źródła
    map.addSource('łachy', {
        type: 'geojson',
        data: 'dane/łachy.geojson'
    })

    map.addLayer({
        'id': 'lachy-layer',
        'type': 'circle',
        'source': 'łachy',
        'paint': {
            'circle-radius': 4.5,
            'circle-color': '#6d5747',
            'circle-stroke-color': 'rgb(1, 1, 1)', 
            'circle-stroke-width': 0.5 
        }
    });
})

// Utworzenie tablicy z miejscami wodowania
const miejsce_wodowania = [
    {
        name: "Smardzewice",
        attribute: "1.6 km trasy - Dogodny dojazd ul. Dziubałtowskiego w pobliżu brzegu.",
        LangLat: [20.003547,51.488327]
    },
    {
        name: "Tomaszów Mazowiecki",
        attribute: "7 km trasy - Przystań nad Pilicą. Dogodne miejsce lądowania i wodowania na betonowym slipie.",
        LangLat: [20.032464,51.518792]
    },
    {
        name: "Spała",
        attribute: "18.6 km trasy - Pomost dla kajakarzy.",
        LangLat: [20.136259,51.536864]
    },
    {
        name: "Teofilów",
        attribute: "24.8 km trasy - Przystań kajakowa 'Kąpielisko Teofilów'.",
        LangLat: [20.195513, 51.524282]
    },
    {
        name: "Inowłódz",
        attribute: "16.8 km trasy - Przystań 'Tama' nad rzeką. Wyjście po slipie.",
        LangLat: [20.225423,51.522907]
    },
    {
        name: "Zakościele",
        attribute: "27.8 km trasy - Pomost widokowy i dogodne miejsce lądowania  dla grup kajakowych.",
        LangLat: [20.236795,51.528002]
    },
    {
        name: "Kozłowiec",
        attribute: "33.2 km trasy - Przystań kajakowa.",
        LangLat: [20.291897,51.549412]
    },
    {
        name: "Mysiakowiec",
        attribute: "37.9 km trasy - Lądowanie przed mostem na prawym brzegu na plaży.",
        LangLat: [20.334332,51.573688]
    },
    {
        name: "Gapinin",
        attribute: "43.8 km trasy - Lądowanie przed mostem na prawym brzegu na plaży.",
        LangLat: [20.396107, 51.585508]
    }

]

// Tworzenie dla każdego elementu tablicy markeru
for (const marker of miejsce_wodowania) {
    const el = document.createElement('div');
    el.className = 'marker miejsca-marker';
    el.style.backgroundImage = `url(ikony/miejsce_wodowania.png)`;
    el.style.width = `35px`;
    el.style.height = `35px`;
    el.style.backgroundSize = '100%';

    // Tworzenie popup
    const popup = new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat(marker.LangLat)
        .setHTML(`<h3>${marker.name}</h3><p>${marker.attribute}</p>`);

    // Dodanie markeru i popupu do mapy
    new mapboxgl.Marker(el)
        .setLngLat(marker.LangLat)
        .setPopup(popup)
        .addTo(map);

    // Dodanie zdarzenia kliknięcia do markeru
    el.addEventListener('click', function () {
        // Po kliknięci zbliżenie do miejsca markeru
        map.flyTo({
            center: marker.LangLat,
            zoom: 15
        });
    });

}


//Utworzenie tablicy z przenoskami
const przenoski = [
    {
        attribute: "0 km trasy - Zapora Jeziora Sulejowskiego z ujęciem dla elektrowni wodnej. Uciążliwa przenoska kajaków prawym brzegiem na odległość 400 m.",
        LangLat: [20.006253, 51.473982]
    },
    {
        attribute: "500 m trasy - Próg wodny w miejscu zwanym Ogrody Smardzewickie. Kajaki przenosimy prawym brzegiem na odległość 20 m.",
        LangLat: [20.005215, 51.478290]
    },
    {
        attribute: "6 km trasy - Tomaszów Mazowiecki. Jaz ujęcia wody pitnej dla miasta przy Rezerwacie Przyrody Niebieskie Źródła. Niedogodne wyjście z wody przy siatce ogrodzenia w zatoczce z prawej strony brzegu; wodowanie dogodne z piaszczystej łachy.",
        LangLat: [20.022590, 51.512264]
    }
]

for (const marker2 of przenoski) {
    const el = document.createElement('div');
    el.className = 'marker przenoski-marker';
    el.style.backgroundImage = `url(ikony/przenoska.png)`;
    el.style.width = `50px`;
    el.style.height = `50px`;
    el.style.backgroundSize = '100%';


    const popup = new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat(marker2.LangLat)
        .setHTML(`<p>${marker2.attribute}</p>`);

    new mapboxgl.Marker(el)
        .setLngLat(marker2.LangLat)
        .setPopup(popup)
        .addTo(map);

    el.addEventListener('click', function () {
        map.flyTo({
            center: marker2.LangLat,
            zoom: 15
        });
    });

}


// Utworzenie tablicy z bystrzami pod mostami
const bystrza = [
    {
        attribute: "9.5 km trasy - Wiadukt kolejowy. Pod nim bystrze. Płynąć przy lewym brzegu.",
        LangLat: [20.046619, 51.532007]
    },
    {
        attribute: "26.5 km trasy - Inowłódz. Most drogi nr 726; za nim kamieniste płycizny.",
        LangLat: [20.222911, 51.520682]
    }
]

for (const marker3 of bystrza) {
    const el = document.createElement('div');
    el.className = 'marker bystrza-marker';
    el.style.backgroundImage = `url(ikony/bystrze.png)`;
    el.style.width = `25px`;
    el.style.height = `25px`;
    el.style.backgroundSize = '100%';

    const popup = new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat(marker3.LangLat)
        .setHTML(`<p>${marker3.attribute}</p>`);

    new mapboxgl.Marker(el)
        .setLngLat(marker3.LangLat)
        .setPopup(popup)
        .addTo(map);

    el.addEventListener('click', function () {
        map.flyTo({
            center: marker3.LangLat,
            zoom: 15
        });
    });

};


// Utworzenie tablicy z ujściami rzek
const rzeki = [
    {
        name: "Wolbórka",
        LangLat: [20.054542, 51.534492]
    },
    {
        name: "Gać",
        LangLat: [20.146611, 51.534993]
    },
    {
        name: "Słomianka",
        LangLat: [20.203544, 51.520308]
    },
    {
        name: "Cetenka",
        LangLat: [20.254253, 51.523933]
    }
]

for (const marker4 of rzeki) {
    const el = document.createElement('div');
    el.className = 'marker rzeki-marker';
    el.style.backgroundImage = `url(ikony/rzeka.png)`;
    el.style.width = `30px`;
    el.style.height = `30px`;
    el.style.backgroundSize = '100%';

    new mapboxgl.Marker(el)
        .setLngLat(marker4.LangLat)
        .addTo(map);

    // Utworzenie etykiet do markerów
    const labelEl = document.createElement('div');
    labelEl.className = 'marker-label rzeki-marker-label';
    labelEl.textContent = marker4.name;

    // Stworzenie stylu etykiet
    labelEl.style.fontSize = '12px'; 
    labelEl.style.marginTop = '-10px'; 
    labelEl.style.color = 'rgb(35, 34, 34)';
    labelEl.style.fontWeight = 'bold'; 
    labelEl.style.textShadow = '-1px 0 white, 0 1px white, 1px 0 white, 0 -1px white';

    // Dodanie etykiet do mapy
    new mapboxgl.Marker(labelEl)
        .setLngLat(marker4.LangLat)
        .addTo(map);

    el.addEventListener('click', function () {
        map.flyTo({
            center: marker4.LangLat,
            zoom: 15
        });
    });

};

//Utworzenie tablicy z mostami
const mosty = [
    {
        name: "Tomaszów Mazowiecki",
        attribute: "6.4 km trasy - Most drogi do Sulejowa.",
        LangLat: [20.027199, 51.514680]
    },
    {
        name: "Tomaszów Mazowiecki",
        attribute: "8.9 km trasy - Most drogi nr 713 do Opoczna.",
        LangLat: [20.039929, 51.528325]
    },
    {
        name: "Spała",
        attribute: "18.5 km trasy - Most drogi do Ciebłowic.",
        LangLat: [20.133978, 51.537452]
    },
    {
        name: "Mysiakowiec",
        attribute: "37.9 km trasy - Most lokalnej drogi, obecnie łączącej Rzeczycę z Poświętnem.",
        LangLat: [20.334816, 51.574281]
    },
    {
        name: "Gapinin",
        attribute: "43.88 km trasy - Wiadukt Centralnej Magistrali Kolejowej. Przez wiadukt prowadzi ścieżka dla pieszych i rowerzystów.",
        LangLat: [20.397365, 51.585822]
    }
]

for (const marker5 of mosty) {
    const el = document.createElement('div');
    el.className = 'marker mosty-marker';
    el.style.backgroundImage = `url(ikony/most.png)`;
    el.style.width = `25px`;
    el.style.height = `25px`;
    el.style.backgroundSize = '100%';

    const popup = new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat(marker5.LangLat)
        .setHTML(`<p>${marker5.attribute}</p>`);

    new mapboxgl.Marker(el)
        .setLngLat(marker5.LangLat)
        .setPopup(popup)
        .addTo(map);

    el.addEventListener('click', function () {
        map.flyTo({
            center: marker5.LangLat,
            zoom: 15
        });
    });

};


//Utworzenie tablicy z atrakcjami
const atrakcje = [
    {
        name: "Rezerwat przyrody Niebieskie Źródła",
        attribute: "https://pl.wikipedia.org/wiki/Rezerwat_przyrody_Niebieskie_%C5%B9r%C3%B3d%C5%82a",
        LangLat: [20.028194, 51.511894]
    },
    {
        name: "Skansen rzeki Pilicy",
        attribute: "http://skansenpilicy.pl/",
        LangLat: [20.030305, 51.515109]
    },
    {
        name: "Kościół św. Idziego w Inowłodzu ",
        attribute: "https://pl.wikipedia.org/wiki/Ko%C5%9Bci%C3%B3%C5%82_%C5%9Bw._Idziego_w_Inow%C5%82odzu",
        LangLat: [20.227477, 51.527356]
    },
    {
        name: "Zamek w Inowłodzu",
        attribute: "https://pl.wikipedia.org/wiki/Zamek_w_Inow%C5%82odzu",
        LangLat: [20.220345, 51.523775]
    }
]

for (const marker6 of atrakcje) {
    const el = document.createElement('div');
    el.className = 'marker atrakcje-marker';
    el.style.backgroundImage = `url(ikony/atrakcje.png)`;
    el.style.width = `25px`;
    el.style.height = `25px`;
    el.style.backgroundSize = '100%';


    const popup = new mapboxgl.Popup({ offset: [0, -15] })
        .setLngLat(marker6.LangLat)
        .setHTML(`<h3>${marker6.name}</h3><p style="word-wrap: break-word;"><a href=${marker6.attribute}>${marker6.attribute}</a></p>`);

    new mapboxgl.Marker(el)
        .setLngLat(marker6.LangLat)
        .setPopup(popup)
        .addTo(map);

    el.addEventListener('click', function () {
        map.flyTo({
            center: marker6.LangLat,
            zoom: 15
        });
    });

}

