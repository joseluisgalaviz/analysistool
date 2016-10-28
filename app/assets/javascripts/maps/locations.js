var map;
var selectControl;

var SHADOW_Z_INDEX = 10;
var MARKER_Z_INDEX = 11;

function initMap(locations,current) {
    map = new OpenLayers.Map({
                         div:"map",
                         allOverlays:true});
    var mapnik = new OpenLayers.Layer.OSM();
    var bing = new OpenLayers.Layer.Bing({
        key: "AvMWbfAOLj7TwpafrYzZliDCtn2rjVhfErn_kE5fO2QS0FBmx0ujfB3449IZMY46", //Get your API key at https://www.bingmapsportal.com
        type: "Aerial"
    });
    var fromProjection = new OpenLayers.Projection("EPSG:4326"); // Transform from WGS 1984
    var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
    var position = new OpenLayers.LonLat(-116.60520, 31.86648).transform(fromProjection, toProjection); //Ensenada, BC, MX
    var zoom = 12;

    map.addLayers([mapnik, bing]);
    map.setBaseLayer(mapnik);
    map.addControl(new OpenLayers.Control.LayerSwitcher());
    map.addControl(new OpenLayers.Control.MousePosition({
        displayProjection: "EPSG:4326"
    }));
    map.setCenter(position, zoom);

    var locationsJSON = eval('(' + locations + ')');
    var currentJSON = eval('(' + current + ')');

    //todo: use reviver function?
//    var locationsJSON = JSON.parse(locations, reviver);





    //=================================================
    //BEGIN Locations

    var styles = new OpenLayers.StyleMap({
        "default": new OpenLayers.Style(OpenLayers.Util.applyDefaults({
            externalGraphic: "/assets/maps/icons/blue-dot.png",
            backgroundGraphic: "/assets/maps/icons/balloon-shadow.png",
            graphicZIndex: MARKER_Z_INDEX,
            backgroundGraphicZIndex: SHADOW_Z_INDEX,
            backgroundXOffset: -7,
            graphicHeight: 32,
            fillOpacity: 1
        }, OpenLayers.Feature.Vector.style["default"])),
        "select": new OpenLayers.Style({
            externalGraphic: "/assets/maps/icons/red-dot.png"
        })
    });


    var locationsLayer = new OpenLayers.Layer.Vector("Locations", {styleMap: styles});
    map.addLayer(locationsLayer);

    for (var location in locationsJSON) {
        var locationPosition = new OpenLayers.LonLat(locationsJSON[location].longitude, locationsJSON[location].latitude).transform(fromProjection, toProjection);

        var locationMarker = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(locationPosition.lon, locationPosition.lat), {
                title: locationsJSON[location].name,
                description: locationsJSON[location].description
            }
        );

        locationsLayer.addFeatures(locationMarker);
    }

    selectControl = new OpenLayers.Control.SelectFeature(
        locationsLayer,
        {
            clickout: true,
            toggle: false,
            multiple: false,
            hover: false,
            toggleKey: "ctrlKey", // ctrl key removes from selection
            multipleKey: "shiftKey" // shift key adds to selection
        }
    );

    map.addControl(selectControl);
    selectControl.activate();
    locationsLayer.events.on({
        'featureselected': onFeatureSelect,
        'featureunselected': onFeatureUnselect
    });
    //================================================================
    //END


  try {

      //Add Marker for current
      //=================================================

      var currentLocation = new OpenLayers.LonLat(currentJSON.lon, currentJSON.lat).transform(fromProjection, toProjection);
      var currentLocationMarker = new OpenLayers.Feature.Vector(
          new OpenLayers.Geometry.Point(currentLocation.lon, currentLocation.lat), {
              title: currentJSON.name,
              description: currentJSON.name
          }, {
              externalGraphic: '/assets/maps/icons/orange-dot.png',
              graphicHeight: 32,
              graphicZIndex: MARKER_Z_INDEX,
              backgroundGraphicZIndex: SHADOW_Z_INDEX,
              backgroundXOffset: -7,
              fillOpacity: 1
          }
      );

      locationsLayer.addFeatures(currentLocationMarker);

      selectCurrentControl = new OpenLayers.Control.SelectFeature(
          locationsLayer,
          {
              clickout: true,
              toggle: false,
              multiple: false,
              hover: false,
              toggleKey: "ctrlKey", // ctrl key removes from selection
              multipleKey: "shiftKey" // shift key adds to selection
          }
      );

      map.addControl(selectCurrentControl);
      selectCurrentControl.activate();
      locationsLayer.events.on({
          'featureselected': onFeatureSelect,
          'featureunselected': onFeatureUnselect
      });
      //==================================================
      //END Current Marker

  }catch (err){}




}





function initMapConvexHull(locations) {
    map = new OpenLayers.Map({
        div:"map",
        allOverlays:true});
    var mapnik = new OpenLayers.Layer.OSM();
    var bing = new OpenLayers.Layer.Bing({
        key: "AvMWbfAOLj7TwpafrYzZliDCtn2rjVhfErn_kE5fO2QS0FBmx0ujfB3449IZMY46", //Get your API key at https://www.bingmapsportal.com
        type: "Aerial"
    });
    var fromProjection = new OpenLayers.Projection("EPSG:4326"); // Transform from WGS 1984
    var toProjection = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection
    var position = new OpenLayers.LonLat(-116.60520, 31.86648).transform(fromProjection, toProjection); //Ensenada, BC, MX
    var zoom = 12;

    map.addLayers([mapnik, bing]);
    map.setBaseLayer(mapnik);
    map.addControl(new OpenLayers.Control.LayerSwitcher());
    map.addControl(new OpenLayers.Control.MousePosition({
        displayProjection: "EPSG:4326"
    }));
    map.setCenter(position, zoom);

    var locationsJSON = eval('(' + locations + ')');

    //todo: use reviver function?
//    var locationsJSON = JSON.parse(locations, reviver);


    //=================================================
    //BEGIN Locations

    var styles = new OpenLayers.StyleMap({
        "default": new OpenLayers.Style(OpenLayers.Util.applyDefaults({
            externalGraphic: "/assets/maps/icons/blue-dot.png",
            backgroundGraphic: "/assets/maps/icons/balloon-shadow.png",
            graphicZIndex: MARKER_Z_INDEX,
            backgroundGraphicZIndex: SHADOW_Z_INDEX,
            backgroundXOffset: -7,
            graphicHeight: 32,
            fillOpacity: 1
        }, OpenLayers.Feature.Vector.style["default"])),
        "select": new OpenLayers.Style({
            externalGraphic: "/assets/maps/icons/red-dot.png"
        })
    });


    var locationsLayer = new OpenLayers.Layer.Vector("Locations", {styleMap: styles});
    map.addLayer(locationsLayer);

    var coordinates = [];
    for (var i=0, l=locationsJSON.length; i<l; i++){
        var locationPosition = new OpenLayers.LonLat(locationsJSON[i].lon, locationsJSON[i].lat).transform(fromProjection, toProjection);
        var point = new OpenLayers.Geometry.Point(locationPosition.lat,locationPosition.lon);
        coordinates.push(point);
        var locationMarker = new OpenLayers.Feature.Vector(
            new OpenLayers.Geometry.Point(locationPosition.lon, locationPosition.lat), {
                title: locationsJSON[i].name,
                description: locationsJSON[i].name
            }
        );

        locationsLayer.addFeatures(locationMarker);
    }



    selectControl = new OpenLayers.Control.SelectFeature(
        locationsLayer,
        {
            clickout: true,
            toggle: false,
            multiple: false,
            hover: false,
            toggleKey: "ctrlKey", // ctrl key removes from selection
            multipleKey: "shiftKey" // shift key adds to selection
        }
    );

    map.addControl(selectControl);
    selectControl.activate();
    locationsLayer.events.on({
        'featureselected': onFeatureSelect,
        'featureunselected': onFeatureUnselect
    });
    //================================================================
    //END
    var lineLayer = new OpenLayers.Layer.Vector("Line Layer");

    map.addLayer(lineLayer);
    map.addControl(new OpenLayers.Control.DrawFeature(lineLayer, OpenLayers.Handler.Path));


    var line = new OpenLayers.Geometry.LineString(coordinates);

    var style = {
        strokeColor: '#0000ff',
        strokeOpacity: 0.5,
        strokeWidth: 5
    };

    var lineFeature = new OpenLayers.Feature.Vector(line, null, style);
    lineLayer.addFeatures([lineFeature]);

}



function addMarker(layer, markerPosition, popupClass, popupContentHTML, closeBox, overflow) {
    var feature = new OpenLayers.Feature(layer, markerPosition);
    feature.closeBox = closeBox;
    feature.popupClass = popupClass;
    feature.data.popupContentHTML = popupContentHTML;
    feature.data.overflow = (overflow) ? "auto" : "hidden";

    var marker = feature.createMarker();

    var markerClick = function (evt) {
        if (this.popup == null) {
            this.popup = this.createPopup(this.closeBox);
            map.addPopup(this.popup);
            this.popup.show();
        } else {
            this.popup.toggle();
        }
        currentPopup = this.popup;
        OpenLayers.Event.stop(evt);
    };
    marker.events.register("mousedown", feature, markerClick);

    layer.addFeatures(marker);
}


function onPopupClose(evt) {
    // 'this' is the popup.
    var feature = this.feature;
    if (feature.layer) { // The feature is not destroyed
        selectControl.unselect(feature);
    } else { // After "moveend" or "refresh" events on POIs layer all
        // features have been destroyed by the Strategy.BBOX
        this.destroy();
    }
}
function onFeatureSelect(evt) {
    feature = evt.feature;
    popup = new OpenLayers.Popup.FramedCloud(
        "featurePopup",
        feature.geometry.getBounds().getCenterLonLat(),
        null,
        "<h1>"+feature.attributes.title + "</h1>" + feature.attributes.description,
        null,
        true,
        onPopupClose
    );
    feature.popup = popup;
    popup.feature = feature;
    map.addPopup(popup, true);
}
function onFeatureUnselect(evt) {
    feature = evt.feature;
    if (feature.popup) {
        popup.feature = null;
        map.removePopup(feature.popup);
        feature.popup.destroy();
        feature.popup = null;
    }
}