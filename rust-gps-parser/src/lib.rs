use rust_bitmap_tools::bitmap_line;
use std::collections::HashMap;
use std::collections::HashSet;

#[derive(Clone, Copy)]
pub struct GPSCoord (pub f32, pub f32);

pub struct MainBusParsed {
    graph: Box<Vec<i32>>,
    translation: Box<Vec<usize>>
}

struct IntermediateMainBusData {
    uuid: String,
    offset: (usize, usize)
}

pub fn parse_subnetwork(gps_record: Vec<Vec<GPSCoord>>, start_coord: GPSCoord, end_coord: GPSCoord) { 
    //Get Object Inbound
    let mut inbound_object: Vec<Vec<GPSCoord>> = Vec::new();

    for obj in gps_record.iter() {
        for coord in obj.iter() {
            let d_coord: GPSCoord = *coord;
            let lon: f32 = d_coord.0;
            let lat: f32 = d_coord.1;

            if lon <= start_coord.0 && lon >= end_coord.0
            && lat <= start_coord.1 && lat >= end_coord.1 {
                inbound_object.push(obj.clone());
            }
        }
    }

    //Get subnetwork Buffer Size
    let mut lon_max: f32 = -1.0;
    let mut lat_max: f32 = -1.0;
    let mut lon_min: f32 = f32::INFINITY;
    let mut lat_min: f32 = f32::INFINITY;

    for obj in inbound_object.iter() {
        for coord in obj.iter() {
            let d_coord: GPSCoord = *coord;
            let lon: f32 = d_coord.0;
            let lat: f32 = d_coord.1;

            if lon > lon_max {
                lon_max = lon;
            } else if lon < lon_min {
                lon_min = lon;
            }
            if lat > lat_max {
                lat_max = lat;
            } else if lat < lat_min {
                lat_min = lat;
            }
        }
    }

    let lon_size: f32 = lon_max - lon_min;
    let lat_size: f32 = lat_max - lat_min;

    let mut ucrop_buffer: Vec<f32> = Vec::new();
}

pub fn parse_main_bus(point_vec: HashMap<String, (f32, f32, Vec<String>)>) -> MainBusParsed {
    let mut intermediate_bus_data: Vec<IntermediateMainBusData> = Vec::new();
    let mut placed_point: HashSet<String> = HashSet::new();
    let mut point_queue: HashSet<String> = HashSet::new();
    let mut queue: Vec<String> = Vec::new();
    let mut buffer_xsize: usize = 0;
    let mut buffer_ysize: usize = 0;
    loop {
        let uuid: &String = match queue.get(0) {
            Some(id) => id,
            None => break,
        };
        let linked_uuid: Vec<String> = match point_vec.get(uuid) {
            Some(data) => data.2.to_vec(),
            None => panic!("Tried To Access Nonexistent Node (linker)"),
        };
        for l_uuid in linked_uuid.iter() {
            if !point_queue.contains(l_uuid) {
                point_queue.insert(l_uuid.to_string());
                queue.push(l_uuid.to_string());
            }
        }


    }
    MainBusParsed {
        graph: Box::new(vec![1, 2, 3]),
        translation: Box::new(vec![1 as usize, 2 as usize, 3 as usize]),
    }
}
