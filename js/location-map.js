const mapElement = document.getElementById("kakao-map");

const showMapMessage = (message) => {
  if (!mapElement) return;
  mapElement.innerHTML = `<div class="map-placeholder"><span>${message}</span></div>`;
};

const initKakaoMap = () => {
  if (!mapElement) return;

  const company = {
    name: "동일컨베어",
    address: "충청북도 충주시 목행산단2로 82",
  };

  if (!window.kakao?.maps?.services) {
    showMapMessage("카카오 지도 API를 불러오지 못했습니다");
    return;
  }

  kakao.maps.load(() => {
    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(company.address, (result, status) => {
      if (status !== kakao.maps.services.Status.OK || !result[0]) {
        showMapMessage("주소 좌표를 찾지 못했습니다");
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
  });
};

window.addEventListener("load", () => {
  window.setTimeout(initKakaoMap, 100);
});
