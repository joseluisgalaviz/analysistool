
class Coordinates
  @name;
  @lat;
  @lon;

  def initialize(name,latitude,longitude)
    @name=name;
    @lat=latitude;
    @lon=longitude;
  end


  def lat
    @lat;
  end

  def lon
    @lon;
  end

  def name
    @name;
  end
end