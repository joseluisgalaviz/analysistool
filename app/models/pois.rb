class Pois
  EARTH_RADIUS = 6371e3;

  def calculate_distance(l1,l2)
    begin
      l1_rads = l1.lat * Math::PI / 180;
      l2_rads = l2.lat * Math::PI / 180;
      delta_lat = (l2_rads-l1_rads);
      delta_lat = delta_lat * Math::PI / 180;
      delta_lon = (l2.lon-l1.lon);
      delta_lon = delta_lon * Math::PI / 180;
      a= (Math::sin(delta_lat/2) * Math::sin(delta_lat/2))+(Math::cos(l1_rads)*Math::cos(l2_rads) *
          Math::sin(delta_lon/2) * Math::sin(delta_lon/2));
      c=2*Math::atan2(Math::sqrt(a),Math::sqrt(1-a));
      d = EARTH_RADIUS*c;
     return d;
    rescue Exception => e
      print e.to_s;
      return 0;
    end
  end

  public
  def inside?(l1,l2,r)
    distance = calculate_distance(l1,l2);
    if(distance<=r)
      true
    else
      false
    end
  end

  def Where?(l1,r)
    begin
    locations=Location.all
    poi = [];
    locations.each do |location|
      name = location.name
      latitude = location.latitude.to_f
      long = location.longitude.to_f
      coordinate = Coordinates.new(name,latitude,long)
      distance = calculate_distance(l1,coordinate);
      if(distance<=r)
        poi.push(location);
      end
    end
    poi
    rescue
      []
    end
  end


end