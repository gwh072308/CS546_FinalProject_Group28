(function () {
    var lat = parseFloat(document.getElementById("map").dataset.lat);
    var lon = parseFloat(document.getElementById("map").dataset.lon);

    if (!isNaN(lat) && !isNaN(lon)) {
        var map = L.map("map").setView([lat, lon], 14);

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19
        }).addTo(map);

        L.marker([lat, lon]).addTo(map)
            .bindPopup("Arrest Location")
            .openPopup();
    } else {
        document.getElementById("map").innerHTML =
            "<p>No location data available for this arrest.</p>";
    }
})();