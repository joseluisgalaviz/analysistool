class PoisController < ApplicationController
   protect_from_forgery
  def index
  end

  def load_pois
     pois = Pois.new()
     latitude = params[:txtLatitude].to_f
     longitude = params[:txtLongitude].to_f
     radius = params[:txtRadius].to_f
     coordinate = Coordinates.new('Current ubication',latitude,longitude)
     @locations = pois.Where?(coordinate,radius).to_json
     @actual= coordinate.to_json
  end

end