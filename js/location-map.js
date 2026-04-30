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
    latitude: 37.002066138255,
    longitude: 127.9257439367,
  };

  if (window.__kakaoMapSdkError) {
    showMapMessage("카카오 지도 SDK 로드에 실패했습니다");
    return;
  }

  if (!window.kakao?.maps?.load) {
    showMapMessage("카카오 지도 API를 불러오지 못했습니다");
    return;
  }

  kakao.maps.load(() => {
    const position = new kakao.maps.LatLng(company.latitude, company.longitude);
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
};

document.addEventListener("DOMContentLoaded", () => {
  window.setTimeout(initKakaoMap, 100);
});
