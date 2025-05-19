import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  CircularProgress,
  Typography,
  Alert,
  TextField,
  Autocomplete
} from '@mui/material';
import { LocationOn } from '@mui/icons-material';
import { splitDot } from 'utils/split';

const determineRegion = (province) => {
  const REGIONS = {
    // ภาคเหนือ
    เชียงใหม่: 'ภาคเหนือ',
    เชียงราย: 'ภาคเหนือ',
    ลำปาง: 'ภาคเหนือ',
    ลำพูน: 'ภาคเหนือ',
    แม่ฮ่องสอน: 'ภาคเหนือ',
    น่าน: 'ภาคเหนือ',
    พะเยา: 'ภาคเหนือ',
    แพร่: 'ภาคเหนือ',
    อุตรดิตถ์: 'ภาคเหนือ',
    ตาก: 'ภาคเหนือ',
    สุโขทัย: 'ภาคเหนือ',
    พิษณุโลก: 'ภาคเหนือ',
    กำแพงเพชร: 'ภาคเหนือ',
    พิจิตร: 'ภาคเหนือ',
    เพชรบูรณ์: 'ภาคเหนือ',
    นครสวรรค์: 'ภาคเหนือ',
    อุทัยธานี: 'ภาคเหนือ',

    // ภาคกลาง
    กรุงเทพมหานคร: 'ภาคกลาง',
    นนทบุรี: 'ภาคกลาง',
    ปทุมธานี: 'ภาคกลาง',
    พระนครศรีอยุธยา: 'ภาคกลาง',
    อ่างทอง: 'ภาคกลาง',
    สิงห์บุรี: 'ภาคกลาง',
    ชัยนาท: 'ภาคกลาง',
    สระบุรี: 'ภาคกลาง',
    ลพบุรี: 'ภาคกลาง',
    สมุทรปราการ: 'ภาคกลาง',
    สมุทรสาคร: 'ภาคกลาง',
    สมุทรสงคราม: 'ภาคกลาง',
    นครปฐม: 'ภาคกลาง',
    สุพรรณบุรี: 'ภาคกลาง',
    กาญจนบุรี: 'ภาคกลาง',
    ราชบุรี: 'ภาคกลาง',
    เพชรบุรี: 'ภาคกลาง',
    ประจวบคีรีขันธ์: 'ภาคกลาง',

    // ภาคตะวันออกเฉียงเหนือ
    นครราชสีมา: 'ภาคตะวันออกเฉียงเหนือ',
    บุรีรัมย์: 'ภาคตะวันออกเฉียงเหนือ',
    สุรินทร์: 'ภาคตะวันออกเฉียงเหนือ',
    ศรีสะเกษ: 'ภาคตะวันออกเฉียงเหนือ',
    อุบลราชธานี: 'ภาคตะวันออกเฉียงเหนือ',
    ยโสธร: 'ภาคตะวันออกเฉียงเหนือ',
    ชัยภูมิ: 'ภาคตะวันออกเฉียงเหนือ',
    อำนาจเจริญ: 'ภาคตะวันออกเฉียงเหนือ',
    บึงกาฬ: 'ภาคตะวันออกเฉียงเหนือ',
    หนองบัวลำภู: 'ภาคตะวันออกเฉียงเหนือ',
    ขอนแก่น: 'ภาคตะวันออกเฉียงเหนือ',
    อุดรธานี: 'ภาคตะวันออกเฉียงเหนือ',
    เลย: 'ภาคตะวันออกเฉียงเหนือ',
    หนองคาย: 'ภาคตะวันออกเฉียงเหนือ',
    มหาสารคาม: 'ภาคตะวันออกเฉียงเหนือ',
    ร้อยเอ็ด: 'ภาคตะวันออกเฉียงเหนือ',
    กาฬสินธุ์: 'ภาคตะวันออกเฉียงเหนือ',
    สกลนคร: 'ภาคตะวันออกเฉียงเหนือ',
    นครพนม: 'ภาคตะวันออกเฉียงเหนือ',
    มุกดาหาร: 'ภาคตะวันออกเฉียงเหนือ',

    // ภาคตะวันออก
    ชลบุรี: 'ภาคตะวันออก',
    ระยอง: 'ภาคตะวันออก',
    จันทบุรี: 'ภาคตะวันออก',
    ตราด: 'ภาคตะวันออก',
    ฉะเชิงเทรา: 'ภาคตะวันออก',
    ปราจีนบุรี: 'ภาคตะวันออก',
    นครนายก: 'ภาคตะวันออก',
    สระแก้ว: 'ภาคตะวันออก',

    // ภาคใต้
    นครศรีธรรมราช: 'ภาคใต้',
    กระบี่: 'ภาคใต้',
    พังงา: 'ภาคใต้',
    ภูเก็ต: 'ภาคใต้',
    สุราษฎร์ธานี: 'ภาคใต้',
    ระนอง: 'ภาคใต้',
    ชุมพร: 'ภาคใต้',
    สงขลา: 'ภาคใต้',
    สตูล: 'ภาคใต้',
    ตรัง: 'ภาคใต้',
    พัทลุง: 'ภาคใต้',
    ปัตตานี: 'ภาคใต้',
    ยะลา: 'ภาคใต้',
    นราธิวาส: 'ภาคใต้'
  };

  return REGIONS[province] || 'ไม่ระบุภูมิภาค';
};

const loadLongdoMapScript = (key) => {
  return new Promise((resolve, reject) => {
    // ตรวจสอบว่ามี script อยู่แล้วหรือไม่
    if (window.longdo) {
      resolve(window.longdo);
      return;
    }

    // สร้าง script element
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = `https://api.longdo.com/map/?key=${key}`;
    script.async = true;

    // กำหนด event handlers
    script.onload = () => resolve(window.longdo);
    script.onerror = (err) => reject(err);

    // เพิ่ม script เข้าไปใน document
    document.head.appendChild(script);
  });
};

const LocationPicker = ({ open, onClose, onLocationSelect, longdoMapKey }) => {
  const defaultPosition = { lat: 13.7563, lng: 100.5018 }; // กรุงเทพฯ
  const [position, setPosition] = useState(defaultPosition);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);
  const [zoom, setZoom] = useState(13);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchOptions, setSearchOptions] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchTimeout, setSearchTimeout] = useState(null);

  // เริ่มต้น Longdo Map
  useEffect(() => {
    let mounted = true;
    let mapInstance = null;

    const initMap = async () => {
      try {
        if (!open) return;
        setIsLoading(true);
        const longdo = await loadLongdoMapScript(longdoMapKey);
        if (!mounted) return;
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;
        mapInstance = new longdo.Map({
          placeholder: mapContainer,
          language: 'th',
          location: { lon: position.lng, lat: position.lat },
          zoom: zoom
        });

        // สร้าง marker
        const newMarker = new longdo.Marker({ lon: position.lng, lat: position.lat });
        mapInstance.Overlays.add(newMarker);

        mapInstance.Event.bind('click', function (overlay, location) {
          console.log('Map click event:', { overlay, location });

          // ดึงพิกัดจาก click event
          const clickLocation = mapInstance.location(location);
          console.log('Converted location:', clickLocation);

          if (clickLocation && typeof clickLocation.lat === 'number') {
            handleMapClick(clickLocation);
          }
        });

        setMap(mapInstance);
        setMarker(newMarker);
        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing map:', error);
        if (mounted) {
          setError('ไม่สามารถโหลดแผนที่ได้');
          setIsLoading(false);
        }
      }
    };

    initMap();
    return () => {
      mounted = false;
      if (mapInstance) {
        mapInstance.Overlays.clear();
        mapInstance.Event.unbind('click', handleMapClick);
      }
    };
  }, [open, longdoMapKey]);

  // ฟังก์ชันค้นหาสถานที่
  const handleSearch = (value) => {
    console.log('Search value:', value);
    setSelectedLocation(null);
    setSearchInput(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const newTimeout = setTimeout(async () => {
      if (value.length >= 2) {
        setIsLoading(true);
        try {
          const response = await fetch(
            `https://search.longdo.com/mapsearch/json/search?keyword=${encodeURIComponent(value)}&limit=5&key=${longdoMapKey}`
          );
          const data = await response.json();
          console.log('Search results:', data);

          if (data && data.data) {
            const results = data.data.map((item) => ({
              label: item.name,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon),
              address: item.address
            }));
            setSearchOptions(results);
          }
        } catch (error) {
          console.error('Search error:', error);
          setError('เกิดข้อผิดพลาดในการค้นหา');
        }
        setIsLoading(false);
      } else {
        setSearchOptions([]);
      }
    }, 500);

    setSearchTimeout(newTimeout);
  };

  // ฟังก์ชันเมื่อเลือกสถานที่จากการค้นหา
  const handleSearchSelect = async (event, value) => {
    setError(null);
    if (value && value.lat && value.lng) {
      console.log('value', value, event);

      let newAddress = {};

      if (value.address.split(' ').length > 3) {
        console.log('มากกว่า 2');
        const data = value.address.split(' ');
        console.log('data', data);
        newAddress = {
          address: value.label,
          subDistrict: data.at(-4),
          district: data.at(-3),
          province: data.at(-2),
          postalCode: data.at(-1)
        };
      } else {
        const postalCode = value.address.split(' ').at(-1);
        if (value.label.split(' ').length > 2) {
          const data = value.label.split(' ');
          newAddress = {
            address: '',
            subDistrict: data.at(-3),
            district: data.at(-2),
            province: data.at(-1),
            postalCode
          };
        } else {
          setError('กรุณาเลือก แขวง/ตําบล เขต/อําเภอ และ จังหวัด ให้ครบถ้วน');
        }
      }

      console.log('newAddress', newAddress);

      try {
        marker.move({ lon: value.lng, lat: value.lat }, true);
        const locationData = {
          address: newAddress.address,
          subDistrict: splitDot(newAddress.subDistrict),
          district: splitDot(newAddress.district),
          province: splitDot(newAddress.province),
          postalCode: newAddress.postalCode,
          region: determineRegion(splitDot(newAddress.province)),
          coordinates: `${value.lat.toFixed(6)}, ${value.lng.toFixed(6)}`,
          lat: value.lat,
          lng: value.lng,
          fullAddress: value.label + ' ' + value.address,
          directionsUrl: `https://map.longdo.com/p/${value.lat},${value.lng}`
        };

        console.log(locationData.address);
        setSelectedLocation(locationData);
        setPosition({ lat: value.lat, lng: value.lng });

        if (map && marker) {
          map.location({ lon: value.lng, lat: value.lat }, true);
          marker.location({ lon: value.lng, lat: value.lat });
          map.zoom(17, true);
        }
      } catch (error) {
        console.error('Error processing location:', error);
        // setError('เกิดข้อผิดพลาดในการประมวลผลข้อมูล');
        setError('กรุณาเลือก แขวง/ตําบล เขต/อําเภอ และ จังหวัด ให้ครบถ้วน');
      }
    }
  };

  // ฟังก์ชันเมื่อคลิกบนแผนที่
  const handleMapClick = async (location) => {
    console.log('Raw click location:', location);

    // ตรวจสอบและแปลงค่าพิกัด
    const lat = parseFloat(location.lat);
    const lon = parseFloat(location.lon);

    if (isNaN(lat) || isNaN(lon)) {
      console.error('Invalid coordinates');
      return;
    }

    console.log('Processing coordinates:', { lat, lon });

    try {
      // เรียกใช้ Reverse Geocoding API
      const geocodeUrl = `https://api.longdo.com/map/services/address?lon=${lon}&lat=${lat}&key=${longdoMapKey}`;
      console.log('Geocoding URL:', geocodeUrl);
      marker.move({ lon: lon, lat: lat }, true);
      const response = await fetch(geocodeUrl);
      const data = await response.json();
      console.log('Raw geocoding response:', data);

      // สร้างข้อมูล location
      const locationData = {
        address: data?.road || '',
        subDistrict: splitDot(data?.subdistrict) || '',
        district: splitDot(data?.district) || '',
        province: splitDot(data?.province) || '',
        postalCode: data?.postcode || '',
        region: determineRegion(splitDot(data?.province) || ''),
        fullAddress: [data?.road, data?.subdistrict, data?.district, data?.province, data?.postcode].filter(Boolean).join(' '),
        coordinates: `${lat.toFixed(6)}, ${lon.toFixed(6)}`,
        lat: lat,
        lng: lon,
        directionsUrl: `https://map.longdo.com/p/${lat},${lon}`
      };

      console.log('Processed location data:', locationData);

      // อัพเดทข้อมูล
      setSelectedLocation(locationData);
      setPosition({ lat, lng: lon });

      // อัพเดท marker
      if (marker) {
        marker.location({ lon, lat });
      }

      // อัพเดทแผนที่
      if (map) {
        map.location({ lon, lat }, true);
        map.zoom(17, true);
      }
    } catch (error) {
      console.error('Error in handleMapClick:', error);
      setError('ไม่สามารถระบุที่อยู่ได้');
    }
  };

  // ฟังก์ชันระบุตำแหน่งปัจจุบัน
  const getCurrentLocation = () => {
    setIsLoading(true);
    setError(null);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          console.log('Current position:', latitude, longitude);

          // ต้องเปลี่ยนตำแหน่งแผนที่ก่อน
          if (map && marker) {
            const location = {
              lat: latitude,
              lon: longitude
            };

            // เลื่อนแผนที่ไปยังตำแหน่งปัจจุบัน
            map.location(location, true);
            map.zoom(17, true);

            // อัพเดทตำแหน่ง marker
            marker.location(location);

            // เรียก handleMapClick เพื่อดึงข้อมูลที่อยู่
            handleMapClick(location);
          }

          setIsLoading(false);
        },
        (error) => {
          console.error('Geolocation error:', error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              setError('ผู้ใช้ปฏิเสธการเข้าถึงตำแหน่ง');
              break;
            case error.POSITION_UNAVAILABLE:
              setError('ไม่สามารถระบุตำแหน่งได้');
              break;
            case error.TIMEOUT:
              setError('หมดเวลาในการระบุตำแหน่ง');
              break;
            default:
              setError('เกิดข้อผิดพลาดในการระบุตำแหน่ง');
          }
          setIsLoading(false);
        },
        {
          enableHighAccuracy: true, // เพิ่มความแม่นยำ
          timeout: 5000, // timeout 5 วินาที
          maximumAge: 0 // ไม่ใช้ตำแหน่งที่แคชไว้
        }
      );
    } else {
      setError('เบราว์เซอร์ไม่รองรับการระบุตำแหน่ง');
      setIsLoading(false);
    }
  };

  const handleConfirm = () => {
    if (!selectedLocation.subDistrict || !selectedLocation.district || !selectedLocation.province || !selectedLocation.postalCode) {
      window.alert('กรุณากรอกข้อมูลให้ครบ');
    }

    if (selectedLocation) {
      // console.log(selectedLocation);
      onLocationSelect(selectedLocation);
      onClose();
    }
  };

  useEffect(() => {
    if (map) {
      map.Event.bind('click', function (overlay, event) {
        console.log('Click event:', event);
        const latlon = map.location(event);
        console.log('Converted to:', latlon);
        if (latlon && latlon.lat) {
          handleMapClick({
            lat: latlon.lat,
            lon: latlon.lon
          });
        }
      });
    }
  }, [map]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>เลือกสถานที่</DialogTitle>
      <DialogContent>
        <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
          <Button
            variant="contained"
            onClick={getCurrentLocation}
            startIcon={<LocationOn />}
            disabled={isLoading}
            sx={{
              backgroundColor: '#052253',
              '&:hover': {
                backgroundColor: '#052253'
              }
            }}
          >
            ใช้ตำแหน่งปัจจุบัน
          </Button>
          <Autocomplete
            freeSolo
            value={searchInput}
            options={searchOptions}
            getOptionLabel={(option) => {
              console.log('Option:', option); // เพิ่ม log
              return typeof option === 'string' ? option : option.label;
            }}
            sx={{ width: 400, paddingTop: 1 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="ค้นหาสถานที่ (พิมพ์อย่างน้อย 2 ตัวอักษร)"
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  )
                }}
                onChange={(e) => {
                  console.log('Input changed:', e.target.value); // เพิ่ม log
                  handleSearch(e.target.value);
                }}
              />
            )}
            onChange={(event, value) => {
              console.log('Selection changed:', value); // เพิ่ม log
              handleSearchSelect(event, value);
            }}
            loading={isLoading}
          />
        </Box>
        {selectedLocation && (
          <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
            <strong>ที่อยู่ที่เลือก:</strong> {selectedLocation.fullAddress || 'ไม่พบข้อมูลที่อยู่'}
            <br />
            <strong>พิกัด:</strong> {selectedLocation.coordinates}
            <br />
            <strong>ตำบล/แขวง:</strong> {selectedLocation.subDistrict || '-'}
            <br />
            <strong>อำเภอ/เขต:</strong> {selectedLocation.district || '-'}
            <br />
            <strong>จังหวัด:</strong> {selectedLocation.province || '-'}
            <br />
            <strong>รหัสไปรษณีย์:</strong> {selectedLocation.postalCode || '-'}
            <br />
            <strong>ภูมิภาค:</strong> {selectedLocation.region || '-'}
            <br />
          </Typography>
        )}
        <Box sx={{ height: 500, width: '100%', position: 'relative' }}>
          {isLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 1000
              }}
            >
              <CircularProgress />
            </Box>
          )}
          <div id="map" style={{ width: '100%', height: '100%' }}></div>
        </Box>
      </DialogContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <DialogActions>
          <Button onClick={onClose}>ยกเลิก</Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            disabled={!selectedLocation}
            sx={{
              backgroundColor: '#052253',
              '&:hover': {
                backgroundColor: '#052253'
              }
            }}
          >
            ยืนยันตำแหน่ง
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

export default LocationPicker;
