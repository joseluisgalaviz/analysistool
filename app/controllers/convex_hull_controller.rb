class ConvexHullController < ApplicationController

  def index
    locations = []
    all_locations = Location.all
    coordinates = convert_to_coordinates(all_locations)
    convex_hull_points = convex(coordinates)
    farthest = farthest_distance(Location.find_by_name('Casa'),convex_hull_points)
    locations = convex_hull_points.to_json

    render 'index', :locals =>{:locations=>locations,:convex_hull_points=>convex_hull_points,:farthest=>farthest[0],
    :distance => farthest[1],:perimeter=>perimeter(convex_hull_points)}
  end





  private

  def perimeter(points)
    perimeter = 0
    query_pois = Pois.new
    1.upto points.length-1 do |i|
       perimeter += query_pois.calculate_distance(points[i-1],points[i])
    end
    perimeter+=query_pois.calculate_distance(points[points.length-1],points[0])
  end

  def farthest_distance(home_location,convex_hull_locations)
    farthest = nil
    distance = 0;
    home = Coordinates.new(home_location.name,home_location.latitude,home_location.longitude)
    query_pois = Pois.new
    convex_hull_locations.each do |location|
          query_distance = query_pois.calculate_distance(home,location)
          if(query_distance>distance)
            distance = query_distance
            farthest = location
          end
    end
    [farthest,distance]
  end

  def convert_to_coordinates(locations)
    coordinates= []
    locations.each do |location|
      coordinate= Coordinates.new(location.name,location.latitude.to_f,location.longitude.to_f)
      coordinates<<coordinate
    end
    coordinates
  end

  def convex(points)

    points.sort!{|a,b|a.lat<=>b.lat}

    superiores = [points.last, points.reverse[1]]

    for i in 3..points.size-1 do
      superiores << points[i]

      while superiores.size > 2 and turn(superiores.last, superiores.reverse[1], superiores.reverse[2]) >= 0
        superiores.delete_at(superiores.size-2)
      end
    end

    inferiores = [points.first, points[1]]

    for i in points.size-1..0 do
      inferiores << points[i]

      while inferiores.size > 2 and turn(inferiores.first, inferiores[1], inferiores[2]) >= 0
        inferiores.delete_at(inferiores.size-2)
      end
    end

    superiores.delete_at 0
    inferiores.delete_at inferiores.size-1

    new_points = superiores + inferiores
    new_points
  end

  def turn(p1,p2,p3)
    (p2.lat-p1.lat)*(p3.lon-p1.lon)-(p3.lat-p1.lat)*(p2.lon-p1.lon)
  end


  end
