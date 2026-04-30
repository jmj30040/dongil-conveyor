const mapElement = document.getElementById("kakao-map");

if (mapElement && window.kakao?.maps?.services) {
  const company = {
    name: "동일컨베어",
    address: "충청북도 충주시 목행산단2로 82",
  };

  const geocoder = new kakao.maps.services.Geocoder();

  geocoder.addressSearch(company.address, (result, status) => {
    if (status !== kakao.maps.services.Status.OK || !result[0]) {
      mapElement.innerHTML = '<div class="map-placeholder"><span>지도를 불러오지 못했습니다</span></div>';
      return;
    }

    const position = new kakao.maps.LatLng(result[0].y, result[0].x);
    const map = new kakao.maps.Map(mapElement, {
      center: position,
      level: 4,
    });

    const marker = new kakao.maps.Marker({
      map,
      position,
    });

    const infoWindow = new kakao.maps.InfoWindow({
      content: `
        <div class="map-info-window">
          <strong>${company.name}</strong>
          <span>${company.address}</span>
        </div>
      `,
    });

    infoWindow.open(map, marker);

    const mapTypeControl = new kakao.maps.MapTypeControl();
    const zoomControl = new kakao.maps.ZoomControl();

    map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);
    map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
  });
}
